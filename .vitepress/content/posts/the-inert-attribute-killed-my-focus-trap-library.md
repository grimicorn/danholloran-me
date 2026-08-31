---
date: "2026-08-31T02:07:40.000-05:00"
tags: ["accessibility", "javascript", "web-apis"]
draft: false
title: "The inert Attribute Killed My Focus Trap Library"
image: "/images/posts/the-inert-attribute-killed-my-focus-trap-library.jpg"
topic: "development"
description: "A single HTML attribute replaces the focus-trap dependency, the aria-hidden sweep, and the tabindex=-1 bookkeeping most modals still ship. Here is how inert actually works and where it bites."
---

Open the network tab on almost any app with a modal and you will find a focus trap library in the bundle. It exists because of a problem that used to be genuinely hard: when a dialog opens, everything behind it has to stop being reachable. Not just visually dimmed, but untabbable, unclickable, and invisible to a screen reader. The old fix was to walk the DOM, stash every `tabindex` you found, overwrite it with `-1`, sprinkle `aria-hidden="true"` on the background containers, then unwind all of it on close and hope nothing rendered in between.

That whole category of code is now one attribute. `inert` is at roughly 96% browser coverage and does the job at the engine level, which means it does it correctly in cases your loop never covered.

## What inert actually turns off

Put `inert` on an element and the entire subtree goes dead in four separate ways at once. Tab skips every focusable descendant. Pointer and click events are swallowed. The content is dropped from the accessibility tree, so screen readers do not announce it. And find-in-page and text selection stop reaching it.

That last pair is the part hand-rolled traps almost never got right, and the accessibility-tree removal is the part `aria-hidden` gets exactly backwards. `aria-hidden="true"` hides content from assistive tech but leaves it perfectly focusable, so a keyboard user tabs into a link a screen reader user cannot hear. That is a worse state than doing nothing. The rule worth memorizing: `aria-hidden` is for decorative content with no focusable descendants, like an icon glyph or a duplicated label. Anything with a focusable child gets `inert` instead.

```html
<div id="app" inert>
  <!-- nav, main content, footer — all unreachable -->
</div>

<dialog id="settings">
  <h2>Settings</h2>
  <button>Save</button>
</dialog>
```

```js
const app = document.getElementById("app");
const dialog = document.getElementById("settings");

dialog.addEventListener("close", () => {
  app.inert = false;
});

function openSettings() {
  app.inert = true;
  dialog.showModal();
}
```

`inert` reflects as a boolean property, so `el.inert = true` is all you need. No attribute string juggling.

## The structural gotcha that will burn you

`inert` cascades down the whole subtree, and there is no way to un-inert a descendant. Set it on a parent and every child is dead, permanently, until the parent's `inert` is removed. This has one very specific consequence: if your modal lives inside the container you just made inert, you have killed your own modal.

```html
<!-- Broken: the dialog is inside the inert subtree -->
<div id="app" inert>
  <main>...</main>
  <dialog open>You cannot focus anything in here.</dialog>
</div>
```

The dialog has to be a sibling of the inert subtree, not a descendant of it. This is exactly why portal patterns exist in React, Vue, and Svelte: they move overlay content to the end of `<body>` so it sits outside whatever wrapper you are about to seal off. If you were treating portals as a z-index workaround, this is the real reason to keep them.

## When you do not need it at all

Here is the twist that makes most of this moot. `<dialog>` opened with `showModal()` already makes the rest of the document inert, for free, per the spec. It also traps Tab, wires up Escape to close, and puts the element in the top layer so stacking contexts stop mattering.

```js
dialog.showModal(); // background is already inert
```

So the manual `app.inert = true` above is only needed when you are building a non-modal overlay: a slide-out drawer, a full-screen loading state, an onboarding coach mark, a multi-step wizard that dims the step behind it. For an actual modal, reach for `showModal()` first and write no focus code at all.

There is one thing no browser can do for you: restoring focus when the element you came from no longer exists. `<dialog>` returns focus to the invoking element on close, but if that button was inside a list row the dialog just deleted, focus falls to `<body>` and the keyboard user is dumped at the top of the page. Capture a fallback target when you open, and check it is still connected before you focus it.

```js
let returnTo = null;

function open(trigger) {
  returnTo = trigger;
  dialog.showModal();
}

dialog.addEventListener("close", () => {
  const target = returnTo?.isConnected
    ? returnTo
    : document.querySelector("main h1");
  target?.focus();
});
```

Finally, if you make a region inert, make that obvious on screen. Sighted mouse users get no feedback from a swallowed click; they will just think your app broke. A backdrop, a dim, or a blur is not decoration here, it is the visual half of the same message the accessibility tree is already sending.

Audit your codebase for `aria-hidden="true"` on anything that wraps a button or a link. Every one of those is a keyboard trap wearing an accessibility costume, and `inert` fixes it in a character or two.
