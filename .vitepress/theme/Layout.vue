<script setup>
import TheFooter from "@/components/TheFooter/TheFooter.vue";
import TheHeader from "@/components/TheHeader/TheHeader.vue";
// import { useData } from 'vitepress'
</script>

<template>
  <div
    class="flex flex-col h-full bg-topographic text-gray-800 dark:bg-gray-800 dark:text-white"
  >
    <TheHeader class="mb-8" />
    <div class="flex-1 container">
      <Content />
    </div>
    <TheFooter />
  </div>
</template>
