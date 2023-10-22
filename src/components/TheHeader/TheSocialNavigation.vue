<script setup>
import { inject } from "vue";

const socialNavigationItems = inject("socialNavigationItems");
</script>

<template>
  <nav class="flex">
    <a
      :href="item.link"
      v-for="item in socialNavigationItems"
      :key="item.link"
      :title="item.label"
      target="_blank"
      class="mr-2 last:mr-0 h-8 w-8 rounded-full bg-white text-black flex items-center justify-center dark:bg-black dark:text-white"
    >
      @todo Make each icons color the brand color
      <component
        v-if="item.icon"
        :is="item.icon"
        class="w-4 h-4 fill-current"
      ></component>
      <span class="sr-only" v-text="item.label" />
    </a>
  </nav>
</template>
