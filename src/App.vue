<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.documentElement.classList.add('dark')
})
</script>

<template>
  <router-view />
</template>

<style>
/* Global styles can stay in main.scss */
</style>
