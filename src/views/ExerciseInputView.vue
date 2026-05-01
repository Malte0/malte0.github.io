//
<script setup lang="ts">
import type { Exercise } from "../types";
import { isValidExercise } from "../json-db/db-utils";
import { ref } from "vue";
import { writeExercise } from "../json-db/writeExercise";

const today: string = new Date().toISOString().split("T")[0] as string; // get today's date in YYYY-MM-DD format
const exercise = ref<Exercise>({
  name: "",
  sets: 0,
  reps: 0,
  date: today,
});

function submitExercise() {
  if (isValidExercise(exercise.value)) {
    console.log("Exercise VALID");
    writeExercise(exercise.value);
  } else {
    console.log("Exercise INVALID");
  }
}
</script>

<template>
  <div>
    <h2>Input Exercise Data</h2>
    <div class="exercise-input-container">
      <div class="exercise-input">
        <label for="exercise-name">Exercise Name:</label>
        <input type="text" id="exercise-name" v-model="exercise.name" />
      </div>
      <div class="exercise-input">
        <label for="sets">Sets:</label>
        <input type="number" id="sets" v-model.number="exercise.sets" />
      </div>
      <div class="exercise-input">
        <label for="reps">Reps:</label>
        <input type="number" id="reps" v-model.number="exercise.reps" />
      </div>
      <div class="exercise-input">
        <label for="weight">Weight (optional):</label>
        <input type="number" id="weight" v-model.number="exercise.weight" />
      </div>
      <div class="exercise-input">
        <label for="time">Time (optional):</label>
        <input type="number" id="time" v-model.number="exercise.time" />
      </div>
      <div class="exercise-input">
        <label for="notes">Notes (optional):</label>
        <textarea id="notes" v-model="exercise.notes"></textarea>
      </div>
      <div class="exercise-input">
        <label for="date">Date:</label>
        <input type="date" id="date" v-model="exercise.date" />
      </div>
    </div>
    <button id="exercise-input-submit-button" @click="submitExercise">Submit</button>
  </div>
</template>

<style scoped>
.exercise-input-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercise-input {
  display: flex;
  flex-direction: row;
}

.exercise-input>input,
.exercise-input>select,
.exercise-input>textarea {
  padding: 0.5rem;
  font-size: 1rem;
  flex: 2;
  box-sizing: border-box; /* ensure padding included in width */
  min-width: 0; /* allow flex items to shrink properly so widths match */
}

.exercise-input>label {
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
}

#listContainer {
  padding: 0;
}

#exercise-input-submit-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
