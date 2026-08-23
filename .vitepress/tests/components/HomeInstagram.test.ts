import { describe, it, expect, vi, afterEach } from "vitest";
import { shallowMount, mount } from "@vue/test-utils";
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

describe("HomeInstagram", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correctly", () => {
    const wrapper = shallowMount(HomeInstagram);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("picks each post's image deterministically from its permalink seed", () => {
    // Both mock permalinks hash to index 1, so the pick lands on the -b image
    // rather than the index-0 default — proving the seed, not position, drives it.
    const wrapper = mount(HomeInstagram);

    expect(wrapper.html()).toContain("/images/instagram/photo1-b.jpg");
    expect(wrapper.html()).not.toContain("/images/instagram/photo1-a.jpg");
    expect(wrapper.html()).toContain("/images/instagram/photo2-b.jpg");
    expect(wrapper.html()).not.toContain("/images/instagram/photo2-a.jpg");
  });

  it("renders the identical image on the server and client with no swap", async () => {
    const serverHtml = await renderToString(createSSRApp(HomeInstagram));

    // Every image the server rendered must survive to the client unchanged; a
    // post-hydration swap would drop one of these from the mounted markup.
    for (const image of [
      "/images/instagram/photo1-b.jpg",
      "/images/instagram/photo2-b.jpg",
    ]) {
      expect(serverHtml).toContain(image);
    }

    const wrapper = mount(HomeInstagram);
    await nextTick();

    for (const image of [
      "/images/instagram/photo1-b.jpg",
      "/images/instagram/photo2-b.jpg",
    ]) {
      expect(wrapper.html()).toContain(image);
    }
  });

  it("hydrates the server markup without a mismatch warning", async () => {
    const container = document.createElement("div");
    container.innerHTML = await renderToString(createSSRApp(HomeInstagram));

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    createSSRApp(HomeInstagram).mount(container);
    await nextTick();

    // Assert on message content so an unrelated Vue dev warning doesn't fail this.
    const logged = [...errorSpy.mock.calls, ...warnSpy.mock.calls]
      .flat()
      .join(" ");
    expect(logged).not.toContain("Hydration");
  });
});
