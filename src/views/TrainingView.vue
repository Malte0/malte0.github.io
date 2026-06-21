// Always shows the first exercise in the workout that has not yet been completed on the current day
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchCurrentWorkoutExercises } from '../excel-db/db-utils';


const date = new Date();
// formatted as yyyy-mm-dd
const formattedDate = date.toISOString().slice(0, 10);
const currentExercise = ref<string>('');

onMounted(async () => {
  setTimeout(async () => {
    currentExercise.value = await fetchCurrentWorkoutExercises("2026-06-11", "Pull"); 
  }, 1000);
});
</script>

<template>
  <div>
    <h1>training view</h1>
    <p>Today's date: {{ formattedDate }}</p>
    <p>Current exercise: {{ currentExercise }}</p>
  </div>
</template>

<style scoped>
</style>
