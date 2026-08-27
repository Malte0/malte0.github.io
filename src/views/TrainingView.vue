// Always shows the first exercise in the workout that has not yet been completed on the current day
<script setup lang="ts">
import type { ExerciseData } from "../types";
import { onMounted, ref, watch } from 'vue';
import { fetchCurrentWorkoutExercise, getExpectedReps, getSetsDone, getSetsPlanned, writeExerciseData } from '../excel-db/db-utils';
import type { Workout } from '../types';
import { gapiInitialized } from '../excel-db/authentication';
import ProgressInput from '../components/ProgressInput.vue';
const SHEET_ID = import.meta.env.VITE_EXERCISE_SHEET_ID;

const date = new Date();
// formatted as yyyy-mm-dd
const formattedDate = date.toISOString().slice(0, 10);
const currentExercise = ref<string>('');
const currentProgression = ref<string>('');
const setsDone = ref<number>(0);
const setsLeft = ref<number>(0);
const expectedReps = ref<number>(8);
const repsDone = ref<number>(0);
const workoutName = new URLSearchParams(window.location.search).get('workout') || '';
const workout = ref<Workout>()

const dataLoaded = ref<boolean>(false);

async function updateData() {
  if (dataLoaded.value) return;
  const { exercise, progression } = await fetchCurrentWorkoutExercise(formattedDate, workoutName);
  currentExercise.value = exercise;
  currentProgression.value = progression;
  setsDone.value = await getSetsDone(currentExercise.value, formattedDate);
  const setsPlanned = await getSetsPlanned(workoutName, currentExercise.value);
  setsLeft.value = Math.max(0, setsPlanned - setsDone.value);
  expectedReps.value = await getExpectedReps(currentExercise.value, currentProgression.value, setsDone.value + 1);
  if (setsLeft.value === 0) {
    console.log("NEXT EXERCISE")
  }
  dataLoaded.value = true;
}

watch(gapiInitialized, async () => {
  await updateData();
});

onMounted(async () => {
  await updateData();
});

function onSubmit() {
  // how to write only the reps?
  const exercise: ExerciseData = {
    name: currentExercise.value,
    progression: currentProgression.value,
    date: formattedDate,
    repsSet1: repsDone.value,
    repsSet2: 0,
    repsSet3: 0,
    repsSet4: 0,
    timeSet1: 0,
    timeSet2: 0,
    timeSet3: 0,
    timeSet4: 0,
    weight: "0",
    breakTime: 0,
    notes: ""
  };
  writeExerciseData(SHEET_ID, exercise);
}
</script>

<template>
  <div>
    <h1>{{ currentExercise }} - {{ currentProgression }}: {{ setsDone }} / {{ setsLeft }}</h1>
    <ProgressInput :unilateral="false" :expected-reps="expectedReps"
      :reps-change-callback="(reps) => repsDone = reps" />
    <button @click="onSubmit">Submit</button>
  </div>
</template>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
