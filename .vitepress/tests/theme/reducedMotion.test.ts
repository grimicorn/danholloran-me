import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

const STYLE_PATH = resolve(process.cwd(), ".vitepress/theme/style.css");
const REDUCED_MOTION_QUERY = "@media (prefers-reduced-motion: reduce)";
const LOOPING_SELECTORS = [".live-dot", ".mountain-float", ".progress-bar"];

function readReducedMotionBlock(): string {
  const contents = readFileSync(STYLE_PATH, "utf8");
  const queryStart = contents.indexOf(REDUCED_MOTION_QUERY);
  if (queryStart === -1) {
    throw new Error(`${REDUCED_MOTION_QUERY} block not found in style.css`);
  }
  const openBrace = contents.indexOf("{", queryStart);
  return sliceBalancedBlock(contents, openBrace);
}

function sliceBalancedBlock(contents: string, openBrace: number): string {
  let depth = 0;
  let index = openBrace;
  while (index < contents.length) {
    const character = contents[index];
    if (character === "{") {
      depth += 1;
    }
    if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return contents.slice(openBrace, index + 1);
      }
    }
    index += 1;
  }
  throw new Error("Unbalanced braces in prefers-reduced-motion block");
}

describe("prefers-reduced-motion coverage", () => {
  it("disables the continuous decorative loops for reduced-motion users", () => {
    const block = readReducedMotionBlock();
    LOOPING_SELECTORS.forEach((selector) => {
      expect(block).toContain(selector);
    });
    expect(block).toMatch(/animation:\s*none\s*!important/);
  });
});
