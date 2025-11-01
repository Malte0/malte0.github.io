<script setup lang="ts">
import { ref } from 'vue'

const MAX_REPS = 200
const numberOfRepsDone = ref(8)

function onScrollEnd() {
  const selector = document.getElementById('numberSelector') as HTMLElement | null
  if (!selector) return

  const rect = selector.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const elementAtCenter = document.elementFromPoint(centerX, centerY) as HTMLElement | null
  const rep = elementAtCenter?.closest('.repNumber') as HTMLElement | null

  if (!rep) {
    console.log('No rep found at center')
    return
  }

  const reps = Array.from(selector.querySelectorAll<HTMLElement>('.repNumber'))
  const index = reps.indexOf(rep)
  console.log('Center rep index:', index + 1)
  numberOfRepsDone.value = index + 1
}
</script>

<template>
  <div>
    <div id="selector-container">
      <div class="selector-fade" id="selector-fade-top"></div>
      <ul id="numberSelector" @scrollend="onScrollEnd">
        <li class="repNumber" v-for="(_, i) in Array.from({ length: MAX_REPS })" :key="i">{{ i + 1 }}</li>
      </ul>
      <div class="selector-fade" id="selector-fade-bottom"></div>
    </div>
  </div>
</template>

<style scoped>
#selector-container {
  background-color: white;
  color: black;
  position: relative;
  height: 200px;
  width: 60px;
  overflow: hidden;
}

.selector-fade {
  background-color: white;
  pointer-events: none;
  position: absolute;
  height: 50%;
  width: 100%;
  pointer-events: none;
}

#selector-fade-top {
  top: 0;
  background: linear-gradient(to bottom, white, rgba(255, 255, 255, 0));
}

#selector-fade-bottom {
  bottom: 0;
  background: linear-gradient(to top, white, rgba(255, 255, 255, 0));
}

#numberSelector {
  scroll-snap-type: block mandatory;
  transition: 0.1s ease;
  height: 200px;
  width: 60px;
  overflow-y: scroll;
  scrollbar-width: none;
  border: 1px solid black;
  padding: 0;
  margin: 0;
}

.repNumber {
  scroll-snap-align: center;
  list-style: none;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
</style>
