import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

// Packages needed to build the site with `vitepress build`: `.vitepress/config.ts`
// imports vitepress, @tailwindcss/vite, plist, feed, yaml, and minisearch (directly
// or via the theme utils it calls in `buildEnd`), and the theme CSS imports
// tailwindcss. Because they are used at build time, the project's dependency audit
// (`fallow audit`) requires them in `dependencies`, and a production-style install
// (`npm ci --omit=dev`) must still install them. This test fails if any regress back
// to `devDependencies`. (`vue` is also a build-time import but is intentionally
// undeclared and consumed via vitepress's transitive copy — see `.fallowrc.json`
// `ignoreDependencies` — so it is not listed here.) Paths resolve from
// `process.cwd()` (the repo root vitest runs in), matching generateFeed.ts and
// sitemap.ts.
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

function readJsonFromRoot(fileName: string): unknown {
  const filePath = join(process.cwd(), fileName);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function readPackageJson(): DependencyManifest {
  return readJsonFromRoot("package.json") as DependencyManifest;
}

type LockfilePackageEntry = {
  dev?: boolean;
  devOptional?: boolean;
};

function readLockfilePackages(): Record<string, LockfilePackageEntry> {
  const lockfile = readJsonFromRoot("package-lock.json") as {
    packages?: Record<string, LockfilePackageEntry & DependencyManifest>;
  };
  return lockfile.packages ?? {};
}

// The lockfile's `packages[""]` block mirrors package.json's dependency edges;
// asserting against it catches a lockfile left stale relative to package.json
// (hand-edited, `npm install` never re-run).
function readLockfileRootManifest(): DependencyManifest {
  return readLockfilePackages()[""] ?? {};
}

function assertPlacement(describeName: string, manifest: DependencyManifest) {
  describe(describeName, () => {
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
}

assertPlacement(
  "package.json build-time dependency placement",
  readPackageJson(),
);
assertPlacement(
  "package-lock.json build-time dependency placement",
  readLockfileRootManifest(),
);

// `npm ci --omit=dev` prunes each installed node whose per-package lockfile entry
// is flagged `dev`/`devOptional`, independent of the root edges checked above. This
// asserts on the exact mechanism the production install uses, catching a lockfile
// that lists a package as a root dependency yet still marks its node dev-only.
describe("package-lock.json build-time entries survive --omit=dev", () => {
  const lockfilePackages = readLockfilePackages();

  it.each(BUILD_TIME_DEPENDENCIES)(
    "does not flag %s as dev-only",
    (packageName) => {
      const entry = lockfilePackages[`node_modules/${packageName}`];
      expect(entry).toBeDefined();
      expect(entry.dev).not.toBe(true);
      expect(entry.devOptional).not.toBe(true);
    },
  );
});
