<script setup>
import { computed } from "vue";
import { MoonIcon, SunIcon } from "@heroicons/vue/24/outline";
import { useDark } from "@vueuse/core";

const isDark = useDark();
const handleClick = () => {
  isDark.value = !isDark.value;
};
const label = computed(() => (isDark.value ? "Dark" : "Light"));
</script>

<template>
  <button
    type="button"
    class="rounded-full relative h-6 w-12 p-0"
    :class="{
      'bg-gray-600': isDark,
      'bg-gray-300': !isDark,
    }"
    @click="handleClick"
  >
    <span
      class="h-6 w-6 rounded-full mx-0 absolute top-0 transition-all flex items-center justify-center"
      :class="{
        'right-0 bg-gray-900 text-gray-300': isDark,
        'left-0 bg-white text-gray-600': !isDark,
      }"
    >
      <component :is="isDark ? MoonIcon : SunIcon" class="h-4 w-4" />
    </span>
    <span v-text="label" class="sr-only" />
  </button>
</template>
