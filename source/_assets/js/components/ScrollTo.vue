<template>
  <a
    :href="dataSelector"
    class="button button-primary"
    @click.prevent="scroll"
  >
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    dataSelector: {
      type: String,
      required: true
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    scroll() {
      document.querySelector(this.dataSelector).scrollIntoView({
        behavior: "smooth"
      });
    }
  }
};
</script>
