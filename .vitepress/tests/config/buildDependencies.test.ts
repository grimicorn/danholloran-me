import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

// Packages needed to build the site with `vitepress build`: `.vitepress/config.ts`
// imports vitepress, @tailwindcss/vite, plist, feed, yaml, and minisearch (directly
// or via the theme utils it calls in `buildEnd`), and the theme CSS imports
// tailwindcss. Because they are used at build time, the project's dependency audit
// (`fallow audit`) requires them in `dependencies`, and a production-style install
// (`npm ci --omit=dev`) must still install them. This test fails if any regress back
// to `devDependencies`. Paths resolve from `process.cwd()` (the repo root vitest
// runs in), matching the convention in generateFeed.ts and sitemap.ts.
const BUILD_TIME_DEPENDENCIES = [
  "@tailwindcss/vite",
  "feed",
  "minisearch",
  "plist",
  "tailwindcss",
  "vitepress",
  "yaml",
];

type DependencyManifest = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type LockfilePackage = { dev?: boolean };

function readJsonFromRoot(fileName: string): unknown {
  const filePath = join(process.cwd(), fileName);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function readPackageJson(): DependencyManifest {
  return readJsonFromRoot("package.json") as DependencyManifest;
}

function readLockfilePackages(): Record<string, LockfilePackage> {
  const lockfile = readJsonFromRoot("package-lock.json") as {
    packages?: Record<string, LockfilePackage>;
  };
  return lockfile.packages ?? {};
}

describe("package.json build-time dependency placement", () => {
  const manifest = readPackageJson();

  it.each(BUILD_TIME_DEPENDENCIES)("declares %s in dependencies", (name) => {
    expect(Object.keys(manifest.dependencies ?? {})).toContain(name);
  });

  it.each(BUILD_TIME_DEPENDENCIES)(
    "does not declare %s in devDependencies",
    (name) => {
      expect(Object.keys(manifest.devDependencies ?? {})).not.toContain(name);
    },
  );
});

describe("package-lock.json installs every build dependency without --omit=dev", () => {
  const packages = readLockfilePackages();

  it.each(BUILD_TIME_DEPENDENCIES)(
    "installs %s in a production install",
    (name) => {
      const entry = packages[`node_modules/${name}`];
      expect(entry).toBeDefined();
      expect(entry?.dev).not.toBe(true);
    },
  );
});
