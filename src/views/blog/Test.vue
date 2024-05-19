<template>
  <editor-markdown v-model="markdownContent"></editor-markdown>
  {{ markdownContent }}
</template>

<script setup>
import { ref } from "vue";

const markdownContent = ref("# fd");
</script>

<style lang="scss" scoped>
</style>
