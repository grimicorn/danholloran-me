import { ref, watch } from "vue";
import { useAnalytics } from "@composables/useAnalytics";

const KIT_FORM_ACTION = "https://app.kit.com/forms/9565549/subscriptions";
const SUBSCRIBE_EVENT = "newsletter_subscribe";
// Bounds the Kit request so a hung connection aborts and re-enables the form
// instead of pinning status at "loading" until a page reload.
const REQUEST_TIMEOUT_MS = 10_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Undefined on browsers without AbortSignal.timeout so the request stays
// unbounded (as before) rather than throwing and failing every subscribe.
function requestTimeoutSignal(): AbortSignal | undefined {
  if (
    typeof AbortSignal === "undefined" ||
    typeof AbortSignal.timeout !== "function"
  ) {
    return undefined;
  }
  return AbortSignal.timeout(REQUEST_TIMEOUT_MS);
}

export type NewsletterStatus = "idle" | "loading" | "success" | "error";

export function useNewsletter() {
  const email = ref("");
  const status = ref<NewsletterStatus>("idle");
  const errorMessage = ref("");
  const { trackEvent } = useAnalytics();

  // A post-success edit means the visitor wants to subscribe a different
  // address, so release the one-shot success lock and let them submit again.
  // Sync flush keeps the lock released before any submit in the same tick.
  watch(
    email,
    () => {
      if (status.value !== "success") {
        return;
      }
      status.value = "idle";
    },
    { flush: "sync" },
  );

  async function subscribe() {
    // Blocks a duplicate submit while a request is in flight, or a repeat of
    // the same address that already succeeded (the success lock releases the
    // moment the email is edited — see the watcher above).
    if (status.value === "loading" || status.value === "success") {
      return;
    }

    const trimmedEmail = email.value.trim();
    if (!EMAIL_RE.test(trimmedEmail)) {
      status.value = "error";
      errorMessage.value = "enter a valid email address.";
      return;
    }

    status.value = "loading";
    errorMessage.value = "";

    try {
      const fd = new FormData();
      fd.append("email_address", trimmedEmail);
      const res = await fetch(KIT_FORM_ACTION, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
        signal: requestTimeoutSignal(),
      });
      if (!res.ok) {
        status.value = "error";
        errorMessage.value = "something went wrong — please try again.";
        return;
      }
    } catch {
      status.value = "error";
      errorMessage.value = "network error — please try again.";
      return;
    }

    status.value = "success";
    trackEvent(SUBSCRIBE_EVENT);
  }

  return { email, status, errorMessage, subscribe };
}
