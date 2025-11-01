<script setup lang="ts">
import { ref } from 'vue';
import NumberSelector from './components/NumberSelector.vue';
import ProgressInput from './components/ProgressInput.vue';

const test = ref(9);
</script>

<template>
  <div id="app">
    <ProgressInput :unilateral="false" />
    <!-- <NumberSelector :expectedReps="19" v-model="test" /> -->
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: rgb(150, 150, 150);
}
</style>
