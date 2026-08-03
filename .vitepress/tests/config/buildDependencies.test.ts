import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

// These are needed to build the site (`vitepress build`): `.vitepress/config.ts`
// imports vitepress, @tailwindcss/vite, and plist directly, and the theme CSS
// imports tailwindcss. `npm ci --omit=dev` must still install them, so they
// belong in `dependencies`, never `devDependencies`.
const BUILD_TIME_DEPENDENCIES = [
  "@tailwindcss/vite",
  "plist",
  "tailwindcss",
  "vitepress",
];

function readPackageJson(): {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
} {
  const packageJsonPath = join(process.cwd(), "package.json");
  return JSON.parse(readFileSync(packageJsonPath, "utf8"));
}

describe("build-time dependency placement", () => {
  const packageJson = readPackageJson();

  it.each(BUILD_TIME_DEPENDENCIES)(
    "declares %s in dependencies",
    (packageName) => {
      expect(packageJson.dependencies).toHaveProperty(packageName);
    },
  );

  it.each(BUILD_TIME_DEPENDENCIES)(
    "does not declare %s in devDependencies",
    (packageName) => {
      expect(packageJson.devDependencies ?? {}).not.toHaveProperty(packageName);
    },
  );
});
