<script setup>
import { inject } from "vue";

const navigationItems = inject("navigationItems");
const getNavigationItemClasses = inject("getNavigationItemClasses");
</script>

<template>
  <nav class="-mx-4 flex">
    <a
      :href="item.link"
      v-for="item in navigationItems"
      :key="item.link"
      class="text-white no-fancy-hover text-lg mx-4 no-underline flex items-center"
      :class="getNavigationItemClasses(item.link)"
    >
      <component
        v-if="item.icon"
        :is="item.icon"
        class="w-4 h-4 mr-1"
      ></component>
      {{ item.label }}
    </a>
  </nav>
</template>
