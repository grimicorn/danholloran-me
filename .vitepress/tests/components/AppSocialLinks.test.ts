import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { mockSocialLinks } from "../__fixtures__/mockData";

vi.mock("@data/socialLinks", () => ({ default: mockSocialLinks }));

import AppSocialLinks from "@components/AppSocialLinks.vue";

describe("AppSocialLinks", () => {
  it("renders the social links list", () => {
    const wrapper = mount(AppSocialLinks);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders one link per social platform", () => {
    const wrapper = mount(AppSocialLinks);
    const links = wrapper.findAll("li a");

    expect(links).toHaveLength(Object.keys(mockSocialLinks).length);
    expect(links.map((link) => link.attributes("href"))).toEqual(
      Object.values(mockSocialLinks),
    );
  });

  it("opens each link safely in a new tab", () => {
    const wrapper = mount(AppSocialLinks);

    wrapper.findAll("li a").forEach((link) => {
      expect(link.attributes("target")).toBe("_blank");
      expect(link.attributes("rel")).toBe("noopener");
      expect(link.attributes("aria-label")).toBeTruthy();
    });
  });

  it("keeps links visible on mobile by default", () => {
    const wrapper = mount(AppSocialLinks);

    wrapper.findAll("li a").forEach((link) => {
      expect(link.classes()).not.toContain("max-md:hidden");
    });
  });

  it("hides links below the md breakpoint when hideOnMobile is set", () => {
    const wrapper = mount(AppSocialLinks, { props: { hideOnMobile: true } });

    wrapper.findAll("li a").forEach((link) => {
      expect(link.classes()).toContain("max-md:hidden");
    });
  });
});
