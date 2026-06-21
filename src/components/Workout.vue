<script setup lang="ts">

const props = defineProps<{ workoutFileName: string }>()

import { onMounted, ref, type Ref } from 'vue'
import type { Exercise } from '../types';
const workoutData: Ref<Exercise[] | null> = ref(null);

onMounted(async () => {
    try {
        const response = await fetch(`/workouts/${props.workoutFileName}.json`)
        workoutData.value = await response.json() as Exercise[]
        console.log(workoutData.value)
    } catch (error) {
        console.error('Error loading workout data:', error)
    }
})

function startWorkout() {
    console.log("Start workout")
}

</script>

<template>
  <div>
    <h2>Workout: {{ props.workoutFileName }}</h2>
    <div v-if="workoutData">
        <div v-for="(exercise, index) in workoutData" :key="index" style="margin-bottom: 20px;">
            <h3>{{ exercise.name }}</h3>
            <p>Sets: {{ exercise.sets }}, Target Reps: {{ exercise.targetReps }}</p>
        </div>
    </div>
    <div v-else>
        <p>Loading workout data...</p>
    </div>
    <button @click="startWorkout">Start Workout</button>
  </div>
</template>

<style scoped>

</style>
