import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

// Isolate git from this machine's global/system config (e.g. an iCloud-synced
// ~/.gitconfig) so these subprocess calls can't fail or behave differently
// depending on where the test happens to run.
const GIT_ENV = {
  ...process.env,
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_SYSTEM: "/dev/null",
};

const SCRIPT_PATH = join(__dirname, "../../../netlify-ignore.sh");

let repoDir: string;

function runGit(...args: string[]): void {
  const result = spawnSync("git", args, {
    cwd: repoDir,
    encoding: "utf-8",
    env: GIT_ENV,
  });

  if (result.error) {
    throw new Error(
      `git ${args.join(" ")} failed to spawn: ${result.error.message}`,
    );
  }

  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  }
}

function commitFile(fileName: string, contents: string, message: string): void {
  writeFileSync(join(repoDir, fileName), contents);
  runGit("add", fileName);
  runGit("commit", "-q", "-m", message);
}

function runNetlifyIgnore(): { status: number; stdout: string } {
  const result = spawnSync("bash", [SCRIPT_PATH], {
    cwd: repoDir,
    encoding: "utf-8",
    env: GIT_ENV,
  });

  if (result.error) {
    throw new Error(
      `netlify-ignore.sh failed to spawn: ${result.error.message}`,
    );
  }

  return { status: result.status ?? -1, stdout: result.stdout };
}

describe("netlify-ignore.sh", () => {
  beforeEach(() => {
    repoDir = mkdtempSync(join(tmpdir(), "netlify-ignore-"));
    runGit("init", "-q");
    runGit("config", "user.email", "test@example.com");
    runGit("config", "user.name", "Test");
  });

  afterEach(() => {
    rmSync(repoDir, { recursive: true, force: true });
  });

  it("builds when there is no parent commit to diff against", () => {
    commitFile("file.txt", "hello", "init");

    const { status, stdout } = runNetlifyIgnore();

    expect(status).toBe(1);
    expect(stdout).toContain("Could not compute diff");
  });

  it("builds when the diff succeeds but reports no changed files", () => {
    commitFile("file.txt", "hello", "init");
    runGit("commit", "-q", "--allow-empty", "-m", "empty commit");

    const { status, stdout } = runNetlifyIgnore();

    expect(status).toBe(1);
    expect(stdout).toContain("no changed files were reported");
  });

  it("builds when a non-markdown file changed", () => {
    commitFile("file.txt", "hello", "init");
    commitFile("file.txt", "hello world", "update");

    const { status, stdout } = runNetlifyIgnore();

    expect(status).toBe(1);
    expect(stdout).toContain("Non-markdown file changed: file.txt");
  });

  it("builds when a non-draft markdown file changed", () => {
    commitFile("file.txt", "hello", "init");
    commitFile("post.md", "---\ndraft: false\n---\nbody\n", "publish post");

    const { status, stdout } = runNetlifyIgnore();

    expect(status).toBe(1);
    expect(stdout).toContain("Non-draft markdown file changed: post.md");
  });

  it("builds when a markdown file was deleted", () => {
    commitFile("post.md", "---\ndraft: true\n---\nbody\n", "add draft");
    runGit("rm", "post.md");
    runGit("commit", "-q", "-m", "delete draft");

    const { status, stdout } = runNetlifyIgnore();

    expect(status).toBe(1);
    expect(stdout).toContain("Markdown file deleted: post.md");
  });

  it("builds when a draft markdown file changed alongside a non-markdown file", () => {
    commitFile("file.txt", "hello", "init");
    writeFileSync(join(repoDir, "post.md"), "---\ndraft: true\n---\nbody\n");
    writeFileSync(join(repoDir, "file.txt"), "hello world");
    runGit("add", ".");
    runGit("commit", "-q", "-m", "draft post plus source change");

    const { status, stdout } = runNetlifyIgnore();

    expect(status).toBe(1);
    expect(stdout).toContain("Non-markdown file changed: file.txt");
  });

  it("skips only when every changed file is a draft markdown file", () => {
    commitFile("file.txt", "hello", "init");
    writeFileSync(join(repoDir, "post.md"), "---\ndraft: true\n---\nbody\n");
    writeFileSync(join(repoDir, "post2.md"), "---\ndraft: true\n---\nbody\n");
    runGit("add", ".");
    runGit("commit", "-q", "-m", "add draft posts");

    const { status, stdout } = runNetlifyIgnore();

    expect(status).toBe(0);
    expect(stdout).toContain("Only draft markdown files changed");
  });
});
