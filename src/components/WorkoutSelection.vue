<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import NotFound from './NotFound.vue'
import ProgressInput from './ProgressInput.vue'

const splitDays: Ref<string[]> | Ref<null> = ref(null)
  onMounted(async () => {
    try {
      const response = await fetch(`/workouts/split.json`)
      splitDays.value = await response.json()
      console.log(splitDays.value)
    } catch (error) {
      console.error('Error loading workout data:', error)
    }
  })

const routes: { [type: string]: any } = {
  '/': ProgressInput, // somehow get to progress input with the first exercise
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
  <div>
    <h2>Workout Selection Component</h2>
    <ul id="listContainer">
      <li class="workout-button" v-for="(day, index) in splitDays" :key="index">
        <a :href="`${day}`">{{ day }}</a> 
        <!-- Link to each workout day -->
      </li>
    </ul>
  </div>
</template>

<style scoped>
#listContainer {
  padding: 0;
}

.workout-button {
  list-style-type: none;
  margin: 10px 0;
  padding: 10px;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  text-align: center;
  border-radius: 5px;
}
</style>
