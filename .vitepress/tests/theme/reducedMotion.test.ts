import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

const STYLE_PATH = resolve(process.cwd(), ".vitepress/theme/style.css");
const FOOTER_PATH = resolve(
  process.cwd(),
  ".vitepress/theme/components/AppFooter.vue",
);
const ANIMATION_OFF = /animation:\s*none/;
const REDUCED_MOTION_HEADER =
  /@media[^{}]*prefers-reduced-motion\s*:\s*reduce[^{}]*\{/g;
const INFINITE_RULE =
  /([.#][\w-]+)(?::[\w-]+)?\s*\{[^{}]*animation:[^;{}]*infinite[^;{}]*;/g;

type StyleRule = { selectors: string[]; body: string };

function sliceBalancedBlock(contents: string, openBrace: number): string {
  let depth = 0;
  let index = openBrace;
  while (index < contents.length) {
    const character = contents[index];
    index += 1;
    if (character === "{") {
      depth += 1;
      continue;
    }
    if (character !== "}") {
      continue;
    }
    depth -= 1;
    if (depth === 0) {
      return contents.slice(openBrace, index);
    }
  }
  throw new Error("Unbalanced braces in prefers-reduced-motion block");
}

function rulesInBlock(block: string): StyleRule[] {
  const inner = block.slice(block.indexOf("{") + 1, block.lastIndexOf("}"));
  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  const rules: StyleRule[] = [];
  let match: RegExpExecArray | null;
  while ((match = rulePattern.exec(inner)) !== null) {
    rules.push({
      selectors: match[1].split(",").map((selector) => selector.trim()),
      body: match[2],
    });
  }
  return rules;
}

function reducedMotionRules(contents: string): StyleRule[] {
  const rules: StyleRule[] = [];
  let header: RegExpExecArray | null;
  while ((header = REDUCED_MOTION_HEADER.exec(contents)) !== null) {
    const openBrace = header.index + header[0].length - 1;
    rules.push(...rulesInBlock(sliceBalancedBlock(contents, openBrace)));
  }
  return rules;
}

function declarationsFor(rules: StyleRule[], selector: string): string {
  const bodies = rules
    .filter((entry) => entry.selectors.includes(selector))
    .map((entry) => entry.body);
  if (!bodies.length) {
    throw new Error(`No reduced-motion rule targets ${selector}`);
  }
  return bodies.join(";");
}

function selectorsWithInfiniteAnimation(contents: string): string[] {
  const selectors = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = INFINITE_RULE.exec(contents)) !== null) {
    selectors.add(match[1]);
  }
  return [...selectors];
}

function read(path: string): string {
  return readFileSync(path, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
}

// Continuous decorative loops that reduced-motion must silence, per file.
const NEUTRALIZED_LOOPS: Array<{ path: string; selectors: string[] }> = [
  {
    path: STYLE_PATH,
    selectors: [".live-dot", ".mountain-float", ".glitch", ".progress-bar"],
  },
  { path: FOOTER_PATH, selectors: [".heartbeat"] },
];

describe("prefers-reduced-motion coverage", () => {
  NEUTRALIZED_LOOPS.forEach(({ path, selectors }) => {
    const rules = reducedMotionRules(read(path));
    selectors.forEach((selector) => {
      it(`stops ${selector} in its own reduced-motion rule`, () => {
        expect(declarationsFor(rules, selector)).toMatch(ANIMATION_OFF);
      });
    });
  });

  it("collapses the scroll progress bar so it does not paint at full width", () => {
    const rules = reducedMotionRules(read(STYLE_PATH));
    expect(declarationsFor(rules, ".progress-bar")).toMatch(
      /transform:\s*scaleX\(0\)/,
    );
  });

  it("leaves the entrance-reveal reset untouched", () => {
    const rules = reducedMotionRules(read(STYLE_PATH));
    expect(declarationsFor(rules, ".reveal")).toMatch(/opacity:\s*1/);
  });

  // Guard: a newly added infinite loop must not slip past reduced-motion.
  [STYLE_PATH, FOOTER_PATH].forEach((path) => {
    it(`covers every infinite animation in ${path.split("/").pop()}`, () => {
      const contents = read(path);
      const covered = reducedMotionRules(contents)
        .filter((rule) => ANIMATION_OFF.test(rule.body))
        .flatMap((rule) => rule.selectors);
      selectorsWithInfiniteAnimation(contents).forEach((selector) => {
        expect(covered).toContain(selector);
      });
    });
  });
});
