<script setup>
import { provide } from "vue";
import { useMediaQuery } from "@vueuse/core";
import TheMobileNavigation from "@/components/TheHeader/TheMobileNavigation.vue";
import TheDesktopNavigation from "@/components/TheHeader/TheDesktopNavigation.vue";
import TheAppearanceToggle from "@/components/TheHeader/TheAppearanceToggle.vue";
import TheSocialNavigation from "@/components/TheHeader/TheSocialNavigation.vue";
import useNavigation from "@/composables/useNavigation.js";

defineProps({
  overlaysHero: {
    type: Boolean,
    default: false,
  },
});

// == Media Query ==============================
const isLargeScreen = useMediaQuery("(min-width: 1024px)");

// == Navigation Items ==============================
const {
  primaryNavigationItems,
  socialNavigationItems,
  isActiveNavigationItem,
} = useNavigation();

const navigationItemClasses = `pb-1 relative after:content-[''] after:absolute after:h-1 after:w-full after:bg-pink-500 after:bottom-0 after:left-0`;

const getNavigationItemClasses = (link) => {
  return [
    navigationItemClasses,
    isActiveNavigationItem(link)
      ? "after:block font-bold"
      : "after:hidden hover:after:block",
  ];
};
provide("primaryNavigationItems", primaryNavigationItems);
provide("socialNavigationItems", socialNavigationItems);
provide("getNavigationItemClasses", getNavigationItemClasses);
</script>

<template>
  <div class="text-white pt-4 pb-4 relative">
    <div class="container z-10 relative flex justify-between items-center">
      <div>
        <a
          href="/"
          class="no-fancy-hover text-white no-underline group text-2xl hover:bg-2xl"
          :class="getNavigationItemClasses('/')"
        >
          <span class="font-bold">Dan</span>
          <span class="font-light font-mono">Holloran</span>
        </a>
      </div>

      <div v-if="isLargeScreen">
        <div class="flex justify-between mb-4 items-center">
          <TheAppearanceToggle />
          <TheSocialNavigation />
        </div>
        <TheDesktopNavigation />
      </div>
      <TheMobileNavigation v-else />
    </div>
    <div
      v-if="!overlaysHero"
      class="bg-gradient absolute top-0 bottom-0 left-0 right-0 z-0"
    ></div>
  </div>
</template>
