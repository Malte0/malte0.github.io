// Always shows the first exercise in the workout that has not yet been completed on the current day
<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchCurrentWorkoutExercises, getSetsDone, getSetsPlanned } from '../excel-db/db-utils';
import type { Workout } from '../types';
import { gapiInitialized } from '../excel-db/authentication';


const date = new Date();
// formatted as yyyy-mm-dd
const formattedDate = date.toISOString().slice(0, 10);
const currentExercise = ref<string>('');
const setsDone = ref<number>(0);
const setsLeft = ref<number>(-1);
const workout = ref<Workout>()

watch(gapiInitialized, async () => {
  setTimeout(async () => {
    currentExercise.value = await fetchCurrentWorkoutExercises("2026-06-11", "Pull");
    setsDone.value = await getSetsDone(currentExercise.value, "2026-06-11");
    console.log("sets done: ", setsDone.value);
    const setsPlanned = await getSetsPlanned("Pull", currentExercise.value);
    console.log("sets planned: ", setsPlanned);
    setsLeft.value = Math.max(0, setsPlanned - setsDone.value);
    if (setsLeft.value === 0) {
      console.log("NEXT EXERCISE")
    }
  }, 800);
});
</script>

<template>
  <div>
    <h1>Exercise: {{ currentExercise }}</h1>
    <p>Current Set: {{ setsDone }} / {{ setsLeft }}</p>
  </div>
</template>

<style scoped>
</style>
