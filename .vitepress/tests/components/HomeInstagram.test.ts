import { describe, it, expect, vi, afterEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createSSRApp, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";
import { mockInstagramPosts, mockSocialLinks } from "../__fixtures__/mockData";

vi.mock("@content/instagram/instagram.data.ts", () => ({
  data: mockInstagramPosts,
}));

vi.mock("@data/socialLinks.ts", () => ({
  default: mockSocialLinks,
}));

vi.mock("@utils/formatDate", () => ({
  formatPostDate: () => "January 1, 2025",
}));

import HomeInstagram from "@components/HomeInstagram.vue";

// The two fixture permalinks straddle buckets: photo1 hashes to index 0 (-a),
// photo2 to index 1 (-b). Asserting that exact split proves the seed drives the
// pick — a "first image" or "last image" shortcut would fail one of these.
const EXPECTED_IMAGES = [
  "/images/instagram/photo1-a.jpg",
  "/images/instagram/photo2-b.jpg",
];
const UNEXPECTED_IMAGES = [
  "/images/instagram/photo1-b.jpg",
  "/images/instagram/photo2-a.jpg",
];

describe("HomeInstagram", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correctly", () => {
    const wrapper = shallowMount(HomeInstagram);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("picks each post's image deterministically from its permalink seed", () => {
    const wrapper = shallowMount(HomeInstagram);

    for (const image of EXPECTED_IMAGES) {
      expect(wrapper.html()).toContain(image);
    }
    for (const image of UNEXPECTED_IMAGES) {
      expect(wrapper.html()).not.toContain(image);
    }
  });

  it("hydrates the server markup with no image swap or mismatch warning", async () => {
    const container = document.createElement("div");
    container.innerHTML = await renderToString(createSSRApp(HomeInstagram));

    for (const image of EXPECTED_IMAGES) {
      expect(container.innerHTML).toContain(image);
    }

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    createSSRApp(HomeInstagram).mount(container);
    await nextTick();

    // The client must keep every server-rendered image and never swap to the
    // other bucket; a post-mount re-pick would surface an unexpected image here.
    for (const image of EXPECTED_IMAGES) {
      expect(container.innerHTML).toContain(image);
    }
    for (const image of UNEXPECTED_IMAGES) {
      expect(container.innerHTML).not.toContain(image);
    }

    // Assert on message content so an unrelated Vue dev warning doesn't fail this.
    const logged = [...errorSpy.mock.calls, ...warnSpy.mock.calls]
      .flat()
      .join(" ");
    expect(logged).not.toContain("Hydration");
  });
});
