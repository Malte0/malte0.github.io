<script setup lang="ts">

const props = defineProps<{
  identifier: string // unique identifier for the selector to distinguish multiple instances
  expectedReps?: number // optional prop to set default reps
}>()

const MAX_REPS = 256
const numberOfRepsDone = defineModel({ default: 8 })
numberOfRepsDone.value = props.expectedReps ?? numberOfRepsDone.value

function onScrollEnd() {
  const selector = document.getElementById(`number-selector-${props.identifier}`) as HTMLElement | null
  if (!selector) return
  
  const rect = selector.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const elementAtCenter = document.elementFromPoint(centerX, centerY) as HTMLElement | null
  console.log(elementAtCenter)

  if (!elementAtCenter) {
    console.log('No rep found at center')
    return
  }

  const reps = Array.from(selector.querySelectorAll<HTMLElement>(`.rep-number-${props.identifier}`))
  const index = MAX_REPS - reps.indexOf(elementAtCenter) - 1
  console.log('Center rep index:', index)
  numberOfRepsDone.value = index
}

setTimeout(() => {
  console.log(numberOfRepsDone.value)
  Array.from(document.querySelectorAll<HTMLElement>(`.rep-number-${props.identifier}`)).forEach((el, i) => {
    if (MAX_REPS - i - 1 === numberOfRepsDone.value) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      console.log('Initial scroll to rep:', MAX_REPS - i - 1)
    }
  })
}, 0)
</script>

<template>
  <div>
    <button class="add-button" @click="numberOfRepsDone++">+1</button>
    <div class="selector-container">
      <div class="selector-fade selector-fade-top"></div>
      <ul class="number-selector" :id="`number-selector-${identifier}`" @scrollend="onScrollEnd">
        <li class="rep-number" :class="`rep-number-${identifier}`" v-for="(_, i) in Array.from({ length: MAX_REPS })" :key="i" :ref="(el) => {
          if (MAX_REPS - i - 1 === numberOfRepsDone) {
            (el as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // console.log('Scrolling to rep:', MAX_REPS - i - 1)
          }
        }">
          {{ MAX_REPS - i - 1 }}
        </li>
        <li class="rep-number"></li>
        <li class="rep-number"></li>
      </ul>
      <div class="selector-fade selector-fade-bottom"></div>
    </div>
    <button class="add-button" @click="numberOfRepsDone--">-1</button>
  </div>
</template>

<style scoped>
.add-button {
  font-size: 20px;
  width: 60px;
  padding: 10px 0;
  margin: 10px 0;
}

.selector-container {
  border-radius: 10px;
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

.selector-fade-top {
  top: 0;
  background: linear-gradient(to bottom, white, rgba(255, 255, 255, 0));
}

.selector-fade-bottom {
  bottom: 0;
  background: linear-gradient(to top, white, rgba(255, 255, 255, 0));
}

.number-selector {
  scroll-snap-type: block mandatory;
  transition: 0.5s ease;
  height: 200px;
  width: 60px;
  overflow-y: scroll;
  scrollbar-width: none;
  border: 1px solid black;
  padding: 0;
  margin: 0;
}

.rep-number {
  background-color: transparent;
  scroll-snap-align: center;
  list-style: none;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
</style>
