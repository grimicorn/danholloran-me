<script setup>
import useNavigation from "@/composables/useNavigation.js";
import TextInput from "@/components/TextInput.vue";
import TextArea from "@/components/TextArea.vue";

const { socialNavigationItems } = useNavigation();
</script>

<template>
  <div class="relative">
    <div class="container z-10 relative pt-16 pb-8">
      <nav class="flex justify-center items-center mb-8">
        <a
          :href="item.link"
          target="_blank"
          v-for="item in socialNavigationItems"
          class="flex items-center text-white no-fancy-hover group mr-6 last:mr-0"
        >
          <component
            :is="item.icon"
            v-if="item.icon"
            class="w-8 h-8 fill-current group-hover:fill-pink-500"
          />
          <span v-text="item.label" class="sr-only" />
        </a>
      </nav>

      <form
        class="-mx-6 text-bold lg:flex lg:flex-wrap justify-center mb-8"
        name="contact"
        method="POST"
        data-netlify="true"
      >
        <TextInput
          name="name"
          placeholder="Name*"
          label="Name*"
          required
          class="lg:w-1/2 px-6 mb-10"
        />
        <TextInput
          name="email"
          placeholder="Email*"
          label="Email*"
          type="email"
          required
          class="lg:w-1/2 px-6 mb-10"
        />
        <TextArea
          name="message"
          placeholder="Message*"
          label="Message*"
          required
          class="w-full px-6 mb-6"
        />

        <div class="w-full px-6 flex justify-center">
          <button
            type="submit"
            class="button-outline-light lg:w-1/2 xl:w-1/3 w-full"
          >
            Submit
          </button>
        </div>
      </form>

      <div class="flex justify-center text-white w-full">
        &copy Dan Holloran, {{ new Date().getFullYear() }} | Made with
        <strong class="text-pink-500 mx-1 shadow-sm animate-pulse">♥</strong>
        in St. Louis, MO
      </div>
    </div>
    <div class="bg-gradient absolute top-0 left-0 right-0 bottom-0 z-0" />
  </div>
</template>
