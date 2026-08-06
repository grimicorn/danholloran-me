import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { useNewsletter } from "../../theme/composables/useNewsletter";

const VALID_EMAIL = "reader@example.com";

function deferredResponse() {
  let resolveFetch!: (_response: Response) => void;
  const promise = new Promise<Response>((resolve) => {
    resolveFetch = resolve;
  });
  return { promise, resolveFetch };
}

describe("useNewsletter", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects an invalid email without calling the API", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const { email, status, errorMessage, subscribe } = useNewsletter();

    email.value = "not-an-email";
    await subscribe();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(status.value).toBe("error");
    expect(errorMessage.value).toBe("enter a valid email address.");
  });

  it("posts once and reports success on a single submit", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));
    const { email, status, subscribe } = useNewsletter();

    email.value = VALID_EMAIL;
    await subscribe();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(status.value).toBe("success");
  });

  it("ignores a second submit while the first is in flight", async () => {
    const { promise, resolveFetch } = deferredResponse();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockReturnValue(promise as ReturnType<typeof fetch>);
    const { email, status, subscribe } = useNewsletter();

    email.value = VALID_EMAIL;
    const firstCall = subscribe();
    expect(status.value).toBe("loading");

    const secondCall = subscribe();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveFetch(new Response(null, { status: 200 }));
    await Promise.all([firstCall, secondCall]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(status.value).toBe("success");
  });

  it("allows a resubmit after the first request settles", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));
    const { email, subscribe } = useNewsletter();

    email.value = VALID_EMAIL;
    await subscribe();
    await subscribe();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("reports an error when the API responds with a non-ok status", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );
    const { email, status, errorMessage, subscribe } = useNewsletter();

    email.value = VALID_EMAIL;
    await subscribe();

    expect(status.value).toBe("error");
    expect(errorMessage.value).toBe("something went wrong — please try again.");
  });
});
