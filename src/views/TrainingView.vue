// Always shows the first exercise in the workout that has not yet been completed on the current day
<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchCurrentWorkoutExercise, getExpectedReps, getSetsDone, getSetsPlanned } from '../excel-db/db-utils';
import type { Workout } from '../types';
import { gapiInitialized } from '../excel-db/authentication';
import ProgressInput from '../components/ProgressInput.vue';


const date = new Date();
// formatted as yyyy-mm-dd
const formattedDate = date.toISOString().slice(0, 10);
const currentExercise = ref<string>('');
const currentProgression = ref<string>('');
const setsDone = ref<number>(0);
const setsLeft = ref<number>(-1);
const expectedReps = ref<number>(8);
const repsDone = ref<number>(0);
const workoutName = new URLSearchParams(window.location.search).get('workout') || '';
const workout = ref<Workout>()

watch(gapiInitialized, async () => {
  setTimeout(async () => {
    const { exercise, progression } = await fetchCurrentWorkoutExercise(formattedDate, workoutName);
    currentExercise.value = exercise;
    currentProgression.value = progression;
    console.log("current progression: ", currentProgression.value);
    setsDone.value = await getSetsDone(currentExercise.value, formattedDate);
    console.log("sets done: ", setsDone.value);
    const setsPlanned = await getSetsPlanned(workoutName, currentExercise.value);
    console.log("sets planned: ", setsPlanned);
    setsLeft.value = Math.max(0, setsPlanned - setsDone.value);
    expectedReps.value = await getExpectedReps(currentExercise.value, currentProgression.value, setsDone.value + 1);
    if (setsLeft.value === 0) {
      console.log("NEXT EXERCISE")
    }
  }, 800);
});
</script>

<template>
  <div>
    <h1>{{ currentExercise }} - {{ currentProgression }}: {{ setsDone }} / {{ setsLeft }}</h1>
    <ProgressInput :unilateral="false" :expected-reps="expectedReps"
      :reps-change-callback="(reps) => repsDone = reps" />
      <button @click="repsDone = 0">Submit</button>
  </div>
</template>

<style scoped></style>
