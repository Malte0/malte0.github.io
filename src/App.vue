<script setup lang="ts">
import { computed, ref } from 'vue';
import Workout from './components/Workout.vue';
import WorkoutSelection from './components/WorkoutSelection.vue';
import NotFound from './components/NotFound.vue';

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
  <div id="app">
    <!-- <Workout href="#/" workoutFileNmae="legs" /> -->
    <!-- <a href="#/path">Broken Link</a> -->
    <component :is="currentView" />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: rgb(150, 150, 150);
}
</style>
