import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

// Packages needed to run `vitepress build`: `.vitepress/config.ts` imports
// vitepress, @tailwindcss/vite, and plist directly, and the theme CSS imports
// tailwindcss. They are used at build time, so the project's dependency audit
// (`fallow audit`) requires them in `dependencies`, and a production-style
// install (`npm ci --omit=dev`) must still install them to build the site.
// Note: `import.meta.url` is not a file-scheme URL inside the vitest module
// runner, so paths are resolved from the repo root (where vitest runs) instead.
const BUILD_TIME_DEPENDENCIES = [
  "@tailwindcss/vite",
  "plist",
  "tailwindcss",
  "vitepress",
];

type DependencyManifest = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function readJsonFromRoot(fileName: string): unknown {
  const filePath = join(process.cwd(), fileName);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function readPackageJson(): DependencyManifest {
  return readJsonFromRoot("package.json") as DependencyManifest;
}

function readLockfileRootManifest(): DependencyManifest {
  const lockfile = readJsonFromRoot("package-lock.json") as {
    packages?: Record<string, DependencyManifest>;
  };
  return lockfile.packages?.[""] ?? {};
}

function assertBuildDependencyPlacement(manifest: DependencyManifest): void {
  it.each(BUILD_TIME_DEPENDENCIES)("declares %s in dependencies", (name) => {
    expect(manifest.dependencies ?? {}).toHaveProperty(name);
  });

  it.each(BUILD_TIME_DEPENDENCIES)(
    "does not declare %s in devDependencies",
    (name) => {
      expect(manifest.devDependencies ?? {}).not.toHaveProperty(name);
    },
  );
}

describe("package.json build-time dependency placement", () => {
  assertBuildDependencyPlacement(readPackageJson());
});

describe("package-lock.json build-time dependency placement", () => {
  assertBuildDependencyPlacement(readLockfileRootManifest());
});
