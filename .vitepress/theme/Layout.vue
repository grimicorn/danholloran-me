<script setup>
import TheFooter from "@/components/TheFooter.vue";
import TheHeader from "@/components/TheHeader/TheHeader.vue";
import { useData } from "vitepress";
import NotFound from "@/components/NotFound.vue";

const { page } = useData();
</script>

<template>
  <div
    class="flex flex-col h-full bg-topographic text-gray-800 dark:bg-gray-800 dark:text-white"
  >
    <TheHeader />
    <div class="flex-1 container py-12">
      <transition name="fade">
        <Content v-if="!page.isNotFound" />
        <NotFound v-else />
      </transition>
    </div>
    <TheFooter />
  </div>
</template>
