<script setup>
import { inject } from "vue";

const socialNavigationItems = inject("socialNavigationItems");
</script>
``

<template>
  <nav class="flex h-full">
    <a
      :href="item.link"
      v-for="item in socialNavigationItems"
      :key="item.link"
      :title="item.label"
      target="_blank"
      class="last:mr-0 h-6 w-8 flex rounded-full items-center justify-center no-fancy-hover text-white hover:!text-pink-500"
    >
      <component
        v-if="item.icon"
        :is="item.icon"
        class="w-4 h-4 fill-current"
      ></component>
      <span class="sr-only" v-text="item.label" />
    </a>
  </nav>
</template>
