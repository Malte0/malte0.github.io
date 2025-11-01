<script setup lang="ts">
import NumberSelector from './NumberSelector.vue'
import { ref } from 'vue'

const props = defineProps<{
  unilateral: boolean
}>()

</script>

<template>
  <div id="progressInputContainer">
    <div id="numberSelectors">
      <NumberSelector/>
      <!-- Button should function like the pixel chain button in gimp -->
      <div id="chain-button" v-if="!props.unilateral"></div>
      <NumberSelector v-if="!props.unilateral"/>
    </div>
  </div>
</template>

<style scoped>
#numberSelectors {
  display: flex;
  flex-direction: row;
  gap: 20px;
}
</style>
