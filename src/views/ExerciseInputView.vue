//
<script setup lang="ts">
import type { ExerciseData } from "../types";
import { onMounted, ref, watch } from "vue";
import { gapiInitialized } from "../excel-db/authentication";
const SHEET_ID = import.meta.env.VITE_SHEET_ID;

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
  weight: 0,
  breakTime: 0,
  date: today,
  notes: "",
});
const submitStatus = ref("");

async function submitExercise() {
  try {
    // Get all values to find the first empty row
    // @ts-ignore
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${exercise.value.name}!A:A`,
    });

    const rows = response.result.values ?? [];
    const firstEmptyRow = rows.length + 1;

    // Prepare the data row to write
    const dataRow = [
      exercise.value.date,
      exercise.value.progression,
      exercise.value.repsSet1 || "",
      exercise.value.repsSet2 || "",
      exercise.value.repsSet3 || "",
      exercise.value.repsSet4 || "",
      exercise.value.timeSet1 || "",
      exercise.value.timeSet2 || "",
      exercise.value.timeSet3 || "",
      exercise.value.timeSet4 || "",
      exercise.value.weight || "",
      exercise.value.breakTime || "",
      exercise.value.notes,
    ];

    // @ts-ignore
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${exercise.value.name}!A${firstEmptyRow}`,
      valueInputOption: "RAW",
      resource: {
        values: [dataRow],
      },
    });

    submitStatus.value = "Saved to Google Sheet.";
  } catch (err: any) {
    submitStatus.value = `Save failed: ${err.message ?? "Unknown error"}`;
  }
}

async function getSheetTitles() {
  // @ts-ignore
  const spreadsheetResponse = await gapi.client.sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  return spreadsheetResponse.result.sheets?.map((sheet: any) => sheet.properties?.title) ?? [];
}

async function getSheetNames() {
  sheetNames.value = await getSheetTitles();
  if (!exercise.value.name && sheetNames.value.length > 0) {
    exercise.value.name = sheetNames.value[0]!;
  }

  await onExerciseNameChange();
}

async function getProgressionNames(sheetName: string) {
  // @ts-ignore
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!B2:B`,
  });

  return response.result.values?.flat() ?? [];
}

async function onExerciseNameChange() {
  const selectedSheetName = exercise.value.name;
  if (selectedSheetName) {
    progressionNames.value = await getProgressionNames(selectedSheetName);
  }
}

onMounted(async () => {
  if (gapiInitialized.value) {
    await getSheetNames();
  }
});

watch(gapiInitialized, async (isLoaded) => {
  if (isLoaded) {
    await getSheetNames();
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
        <select id="sets" v-model="exercise.progression">
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
        <label for="notes">Notes:</label>
        <textarea id="notes" v-model="exercise.notes"></textarea>
      </div>
    </div>
    <button id="exercise-input-submit-button" @click="submitExercise">Submit</button>
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
