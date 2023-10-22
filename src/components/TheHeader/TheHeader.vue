<script setup>
import { provide, computed } from "vue";
import { useMediaQuery } from "@vueuse/core";
import TheMobileNavigation from "@/components/TheHeader/TheMobileNavigation.vue";
import TheDesktopNavigation from "@/components/TheHeader/TheDesktopNavigation.vue";
import TheAppearanceToggle from "@/components/TheHeader/TheAppearanceToggle.vue";
import { useRoute } from "vitepress";
import {
  CodeBracketIcon,
  CameraIcon,
  MegaphoneIcon,
  EnvelopeIcon,
} from "@heroicons/vue/24/outline";
import GithubIcon from "@/assets/images/github-icon.svg";
import TheSocialNavigation from "@/components/TheHeader/TheSocialNavigation.vue";
import LinkedinIcon from "@/assets/images/linkedin-icon.svg";
import SpotifyIcon from "@/assets/images/spotify-icon.svg";
import InstagramIcon from "@/assets/images/instagram-icon.svg";
import XIcon from "@/assets/images/x-icon.svg";
import YoutubeIcon from "@/assets/images/youtube-icon.svg";

defineProps({
  overlaysHero: {
    type: Boolean,
    default: false,
  },
});

// == Media Query ==============================
const isLargeScreen = useMediaQuery("(min-width: 1024px)");

// == Navigation Items ==============================
const navigationItems = computed(() => {
  return [
    {
      label: "Posts",
      link: "/posts",
      icon: MegaphoneIcon,
    },
    {
      label: "Projects",
      link: "/projects",
      icon: CodeBracketIcon,
    },
    {
      label: "Photos",
      link: "/photos",
      icon: CameraIcon,
    },
    {
      label: "Contact",
      link: "/contact",
      icon: EnvelopeIcon,
    },
  ];
});
const socialNavigationItems = computed(() => {
  return [
    {
      label: "LinkedIn",
      link: "https://www.linkedin.com/in/dan-holloran/",
      icon: LinkedinIcon,
    },
    {
      label: "Github",
      link: "https://github.com/DHolloran/",
      icon: GithubIcon,
    },
    {
      label: "X",
      link: "https://twitter.com/DHolloran",
      icon: XIcon,
    },
    {
      label: "Spotify",
      link: "https://open.spotify.com/user/dholloran",
      icon: SpotifyIcon,
    },
    {
      label: "Instagram",
      link: "https://www.instagram.com/dholloran85/",
      icon: InstagramIcon,
    },
    {
      label: "YouTube",
      link: "https://www.youtube.com/DanHolloran",
      icon: YoutubeIcon,
    },
  ];
});
const isActiveNavigationItem = (link) => {
  const route = useRoute();

  if (link === "/") {
    return route.path === link;
  }

  return route.path.includes(link);
};
const navigationItemClasses = `pb-1 relative after:content-[''] after:absolute after:h-1 after:w-full after:bg-pink-500 after:bottom-0 after:left-0`;

const getNavigationItemClasses = (link) => {
  return [
    navigationItemClasses,
    isActiveNavigationItem(link)
      ? "after:block font-bold"
      : "after:hidden hover:after:block",
  ];
};
provide("navigationItems", navigationItems);
provide("socialNavigationItems", socialNavigationItems);
provide("getNavigationItemClasses", getNavigationItemClasses);
</script>

<template>
  <div class="text-white pt-4 pb-8 relative">
    <div class="container z-10 relative flex justify-between items-center">
      <div>
        <a
          href="/"
          class="no-fancy-hover text-white no-underline group text-2xl"
          :class="getNavigationItemClasses('/')"
        >
          <span class="font-bold">Dan</span>
          <span class="font-light font-mono">Holloran</span>
        </a>
      </div>

      <div v-if="isLargeScreen">
        <div class="flex justify-between mb-4">
          <TheAppearanceToggle />
          <TheSocialNavigation />
        </div>
        <TheDesktopNavigation />
      </div>
      <TheMobileNavigation v-else />
    </div>
    <div
      v-if="!overlaysHero"
      class="bg-gradient absolute top-0 bottom-0 left-0 right-0 z-0 opacity-75"
    ></div>
  </div>
</template>
