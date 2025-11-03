<script setup lang="ts">
import { computed, ref } from 'vue'
import NotFound from './NotFound.vue'

const routes: { [type: string]: any } = {
  '/': WorkoutSelection,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})

</script>

<template>
  <div>
    <h2>Workout Selection Component</h2>
    <button >Legs</button>
  </div>
</template>

<style scoped>

</style>
