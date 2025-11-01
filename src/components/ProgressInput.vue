<script setup lang="ts">
import NumberSelector from './NumberSelector.vue'
import { ref, watch } from 'vue'

const chainActive = ref(false)
const chainVisual = ref('⛓️')

const props = defineProps<{
  unilateral: boolean
}>()

const numberOfRepsDone = ref(8) // reps for left side
const numberOfRepsDoneRight = ref(8) // reps for right side

function toggleChain() {
  chainActive.value = !chainActive.value
  chainVisual.value = chainActive.value ? '🔗' : '⛓️'
}

// watch(numberOfRepsDoneRight, (newRepsRight) => {
//   if (chainActive.value) {
//     numberOfRepsDone.value = newRepsRight;
//     console.log(numberOfRepsDone.value)
//     console.log(numberOfRepsDoneRight.value)
//   }
// });

// watch(numberOfRepsDone, (newReps) => {
//   if (chainActive.value) {
//     numberOfRepsDoneRight.value = newReps;
//     console.log(numberOfRepsDone.value)
//     console.log(numberOfRepsDoneRight.value)
//   }
// });

</script>

<template>
  <div id="progressInputContainer">
    <div id="numberSelectors">
      <NumberSelector :expected-reps="8" v-model="numberOfRepsDone"/>
      <!-- Button should function like the pixel chain button in gimp -->
      <button id="chain-button" v-if="!props.unilateral" @click="toggleChain">{{ chainVisual }}</button>
      <NumberSelector v-if="!props.unilateral" :expected-reps="8" v-model="numberOfRepsDoneRight"/>
    </div>
  </div>
</template>

<style scoped>
#numberSelectors {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

#chain-button {
  font-size: 20px;
  width: 40px;
  height: 40px;
  padding: 0;
  align-self: center;
}
</style>
