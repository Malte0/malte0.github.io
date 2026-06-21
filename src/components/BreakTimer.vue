<script setup lang="ts">
import { ref } from 'vue'

const time = ref('00:00')

const props = defineProps<{
  breakDuration: number,
  nextExercise: string
}>()

function startNextExercise() {
  // Logic to start the next exercise
  console.log(`Starting next exercise: ${props.nextExercise}`)
}

// Simple countdown timer logic
function countDown(remainingTime: number) {
  const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0')
  const seconds = (remainingTime % 60).toString().padStart(2, '0')
  time.value = `${minutes}:${seconds}`
  return remainingTime - 1
}

let remaining = props.breakDuration
remaining = countDown(remaining)
const interval = setInterval(() => {
  if (remaining <= 0) {
    clearInterval(interval)
    time.value = 'Time\'s up!'
    startNextExercise()
    return
  }
  remaining = countDown(remaining)
}, 1000)

</script>

<template>
  <div>
    <h1>{{ time }}</h1>
    <div id="progressBar" style="width: 100%; background-color: lightgray; height: 20px; margin-bottom: 10px;">
      <div :style="{ width: ((remaining / props.breakDuration) * 100) + '%', backgroundColor: 'green', height: '100%' }"></div>
    </div>
    <h2>Next exercise: {{ nextExercise }}</h2>
  </div>
</template>

<style scoped>
</style>
