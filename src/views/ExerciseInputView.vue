//
<script setup lang="ts">
import type { ExerciseData } from "../types";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { gapiInitialized } from "../excel-db/authentication";
import { writeExerciseData } from "../excel-db/db-utils";
import { getSheetNames } from "../excel-db/db-utils";
const SHEET_ID = import.meta.env.VITE_EXERCISE_SHEET_ID;

const route = useRoute();

const today: string = new Date().toISOString().split("T")[0] as string; // get today's date in YYYY-MM-DD format
const sheetNames = ref<string[]>([]);
const progressionNames = ref<string[]>([]);
const exercise = ref<ExerciseData>({
  name: "",
  progression: "",
  repsSet1: 0,
  repsSet2: 0,
  repsSet3: 0,
  repsSet4: 0,
  timeSet1: 0,
  timeSet2: 0,
  timeSet3: 0,
  timeSet4: 0,
  weight: "",
  breakTime: 0,
  date: today,
  dropset: "",
  notes: "",
});
const submitStatus = ref("");

async function getSheetNames2() {
  sheetNames.value = await getSheetNames(true);
  const urlExercise = String(route.query.exercise ?? "").trim();
  const urlProgression = String(route.query.progression ?? "").trim();

  if (urlExercise && sheetNames.value.includes(urlExercise)) {
    exercise.value.name = urlExercise;
  } else if (!exercise.value.name && sheetNames.value.length > 0) {
    exercise.value.name = sheetNames.value[0]!;
  }

  await onExerciseNameChange();

  if (urlProgression) {
    exercise.value.progression = urlProgression;
    await onProgressionChange();
  }
}

async function getProgressionNames(sheetName: string) {
  // @ts-ignore
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!B2:B`,
  });
  const raw = response.result.values?.flat() ?? [];
  // normalize, trim, remove empty and make unique preserving order
  const progressionNames: string[] = Array.from(
    new Set(raw.map((v: any) => String(v).trim()).filter((v: string) => v.length > 0))
  );
  return progressionNames;
}

async function onExerciseNameChange() {
  const selectedSheetName = exercise.value.name;
  if (selectedSheetName) {
    progressionNames.value = await getProgressionNames(selectedSheetName);
  }
}

// Reads reptitions from last entry of the selected progression and pre-fills the inputs
async function onProgressionChange() {
  const selectedSheetName = exercise.value.name;
  const selectedProgression = exercise.value.progression;
  if (selectedSheetName && selectedProgression) {
    // @ts-ignore
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${selectedSheetName}!A2:L`,
    });

    const rows = response.result.values ?? [];
    // Find the last row for the selected progression
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i][1] === selectedProgression) {
        exercise.value.repsSet1 = Number(rows[i][2]) || 0;
        exercise.value.repsSet2 = Number(rows[i][3]) || 0;
        exercise.value.repsSet3 = Number(rows[i][4]) || 0;
        exercise.value.repsSet4 = Number(rows[i][5]) || 0;
        exercise.value.timeSet1 = Number(rows[i][6]) || 0;
        exercise.value.timeSet2 = Number(rows[i][7]) || 0;
        exercise.value.timeSet3 = Number(rows[i][8]) || 0;
        exercise.value.timeSet4 = Number(rows[i][9]) || 0;
        exercise.value.weight = rows[i][10] || "";
        exercise.value.dropset = rows[i][11] || "";
        exercise.value.breakTime = Number(rows[i][12]) || 0;
        exercise.value.notes = rows[i][13] || "";
        break;
      }
    }
  }  
}

onMounted(async () => {
  if (gapiInitialized.value) {
    await getSheetNames2();
  }
});

watch(gapiInitialized, async (isLoaded) => {
  if (isLoaded) {
    await getSheetNames2();
  }
});
</script>

<template>
  <div>
    <h2>Input Exercise Data</h2>
    <div class="exercise-input-container">
      <div class="exercise-input">
        <label for="exercise-name">Name:</label>
        <select @change="onExerciseNameChange" id="exercise-name" v-model="exercise.name">
          <option disabled value="">Select an exercise</option>
          <option v-for="sheetName in sheetNames" :key="sheetName" :value="sheetName">
            {{ sheetName }}
          </option>
        </select>
      </div>
      <div class="exercise-input">
        <label for="sets">Progression:</label>
        <select @change="onProgressionChange" id="sets" v-model="exercise.progression">
          <option disabled value="">Select a progression</option>
          <option v-for="progressionName in progressionNames" :key="progressionName" :value="progressionName">
            {{ progressionName }}
          </option>
        </select>
      </div>
      <div class="exercise-input">
        <label for="reps">Reps:</label>
        <input type="number" class="exercise-small-input" id="reps" v-model.number="exercise.repsSet1" />
        <input type="number" class="exercise-small-input" id="reps" v-model.number="exercise.repsSet2" />
        <input type="number" class="exercise-small-input" id="reps" v-model.number="exercise.repsSet3" />
        <input type="number" class="exercise-small-input" id="reps" v-model.number="exercise.repsSet4" />
      </div>
      <div class="exercise-input">
        <label for="time">Times:</label>
        <input type="number" class="exercise-small-input" id="time" v-model.number="exercise.timeSet1" />
        <input type="number" class="exercise-small-input" id="time" v-model.number="exercise.timeSet2" />
        <input type="number" class="exercise-small-input" id="time" v-model.number="exercise.timeSet3" />
        <input type="number" class="exercise-small-input" id="time" v-model.number="exercise.timeSet4" />
      </div>
      <div class="exercise-input">
        <label for="weight">Weight:</label>
        <input type="number" id="weight" v-model.number="exercise.weight" />
      </div>
      <div class="exercise-input">
        <label for="date">Date:</label>
        <input type="date" id="date" v-model="exercise.date" />
      </div>
      <div class="exercise-input">
        <label for="sets">Dropset:</label>
        <select v-model="exercise.dropset">
          <option disabled value="">Select a dropset</option>
          <option v-for="dropsetName in sheetNames" :key="dropsetName" :value="dropsetName">
            {{ dropsetName }}
          </option>
        </select>
      </div>
      <div class="exercise-input">
        <label for="notes">Notes:</label>
        <textarea id="notes" v-model="exercise.notes"></textarea>
      </div>
    </div>
    <button id="exercise-input-submit-button" @click="() => writeExerciseData(SHEET_ID, exercise)">Submit</button>
    <p v-if="submitStatus" class="submit-status">{{ submitStatus }}</p>
  </div>
</template>

<style scoped>
.exercise-small-input {
  width: 1rem;
  flex: 0.3 !important;
  margin-left: 0.5rem;
}

.exercise-input-container {
  display: flex;
  width: 100%;
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
  box-sizing: border-box;
  /* ensure padding included in width */
  min-width: 0;
  /* allow flex items to shrink properly so widths match */
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

.submit-status {
  margin-top: 0.75rem;
}
</style>
