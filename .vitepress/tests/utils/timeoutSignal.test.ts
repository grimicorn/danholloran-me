import { describe, it, expect, vi, afterEach } from "vitest";
import { withTimeoutSignal } from "../../theme/utils/timeoutSignal";

const TIMEOUT_MS = 10_000;

describe("withTimeoutSignal", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("uses the native AbortSignal.timeout when it is available", () => {
    const nativeSignal = new AbortController().signal;
    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(nativeSignal);

    const { signal, clear } = withTimeoutSignal(TIMEOUT_MS);

    expect(timeoutSpy).toHaveBeenCalledWith(TIMEOUT_MS);
    expect(signal).toBe(nativeSignal);
    // The browser owns the native timer, so clear() is a safe no-op.
    expect(() => clear()).not.toThrow();
  });

  it("aborts via the fallback timer when AbortSignal.timeout is unavailable", () => {
    vi.useFakeTimers();
    vi.stubGlobal("AbortSignal", {});

    const { signal } = withTimeoutSignal(TIMEOUT_MS);

    expect(signal).toBeDefined();
    expect(signal?.aborted).toBe(false);
    vi.advanceTimersByTime(TIMEOUT_MS - 1);
    expect(signal?.aborted).toBe(false);
    vi.advanceTimersByTime(1);
    expect(signal?.aborted).toBe(true);
  });

  it("aborts the fallback with a TimeoutError, matching native semantics", () => {
    vi.useFakeTimers();
    vi.stubGlobal("AbortSignal", {});

    const { signal } = withTimeoutSignal(TIMEOUT_MS);
    vi.advanceTimersByTime(TIMEOUT_MS);

    expect(signal?.reason).toBeInstanceOf(DOMException);
    expect(signal?.reason.name).toBe("TimeoutError");
  });

  it("stays unbounded when AbortSignal.timeout is present but throws", () => {
    vi.stubGlobal("AbortSignal", {
      timeout: () => {
        throw new Error("boom");
      },
    });
    vi.stubGlobal("AbortController", undefined);

    const { signal, clear } = withTimeoutSignal(TIMEOUT_MS);

    expect(signal).toBeUndefined();
    expect(() => clear()).not.toThrow();
  });

  it("clear() cancels the fallback timer so a settled request never aborts", () => {
    vi.useFakeTimers();
    vi.stubGlobal("AbortSignal", {});

    const { signal, clear } = withTimeoutSignal(TIMEOUT_MS);
    clear();
    vi.advanceTimersByTime(TIMEOUT_MS);

    expect(signal?.aborted).toBe(false);
  });

  it("stays unbounded when neither AbortSignal.timeout nor AbortController exists", () => {
    vi.stubGlobal("AbortSignal", undefined);
    vi.stubGlobal("AbortController", undefined);

    const { signal, clear } = withTimeoutSignal(TIMEOUT_MS);

    expect(signal).toBeUndefined();
    expect(() => clear()).not.toThrow();
  });
});
