import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

const HEADERS_PATH = resolve(process.cwd(), "public/_headers");
const NEWSLETTER_CONNECT_SRC = "https://app.kit.com";
const ANALYTICS_CONNECT_SRC = [
  "https://www.google-analytics.com",
  "https://www.googletagmanager.com",
];

function readConnectSrc(): string[] {
  const contents = readFileSync(HEADERS_PATH, "utf8");
  const cspLine = contents
    .split("\n")
    .find((line) => line.includes("Content-Security-Policy:"));
  if (!cspLine) {
    throw new Error("Content-Security-Policy header not found in _headers");
  }
  const directive = cspLine
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("connect-src "));
  if (!directive) {
    throw new Error("connect-src directive not found in CSP");
  }
  return directive.replace("connect-src ", "").split(/\s+/);
}

describe("public/_headers connect-src", () => {
  it("allows the Kit newsletter form endpoint so subscribe() is not CSP-blocked", () => {
    expect(readConnectSrc()).toContain(NEWSLETTER_CONNECT_SRC);
  });

  it("still allows the analytics endpoints", () => {
    const sources = readConnectSrc();
    ANALYTICS_CONNECT_SRC.forEach((source) => {
      expect(sources).toContain(source);
    });
  });
});
