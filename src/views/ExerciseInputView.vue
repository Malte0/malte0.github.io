//
<script setup lang="ts">
import type { Exercise } from "../types";
import { isValidExercise } from "../excel-db/db-utils";
import { onMounted, ref } from "vue";
import { writeExercise } from "../excel-db/writeExercise";
const SHEET_ID = import.meta.env.VITE_SHEET_ID;

async function getSheetTitles() {
  // @ts-ignore
  const spreadsheetResponse = await gapi.client.sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  return spreadsheetResponse.result.sheets?.map((sheet: any) => sheet.properties?.title) ?? [];
}

const today: string = new Date().toISOString().split("T")[0] as string; // get today's date in YYYY-MM-DD format
const sheetNames = ref<string[]>([]);
const exercise = ref<Exercise>({
  name: "",
  sets: 0,
  reps: 0,
  date: today,
});
const submitStatus = ref("");

async function submitExercise() {
  if (isValidExercise(exercise.value)) {
    const result = await writeExercise(exercise.value);
    if (result.ok) {
      submitStatus.value = "Saved to Google Sheet.";
    } else {
      submitStatus.value = `Save failed: ${result.error ?? "Unknown error"}`;
    }
  } else {
    submitStatus.value = "Exercise invalid. Please check all required fields.";
  }
}

async function loadSheetNames() {
  sheetNames.value = await getSheetTitles();
  if (!exercise.value.name && sheetNames.value.length > 0) {
    exercise.value.name = sheetNames.value[0]!;
  }
}

setTimeout(() => {
  loadSheetNames();
}, 5000); // delay to allow gapi client to initialize; consider replacing with more robust solution in the future

onMounted(() => {
  loadSheetNames();
});

// async function writeTestToB1() {
//   try {
//     const firstSheetTitle = await getFirstSheetTitle();
//     if (!firstSheetTitle) {
//       sheetStatus.value = "No sheets found in the spreadsheet.";
//       return;
//     }

//     // @ts-ignore
//     await gapi.client.sheets.spreadsheets.values.update({
//       spreadsheetId: SHEET_ID,
//       range: `${firstSheetTitle}!B1`,
//       valueInputOption: "RAW",
//       resource: {
//         values: [[WRITE_TEST]],
//       },
//     });

//     sheetStatus.value = "Wrote WRITE_TEST to B1.";
//   } catch (err: any) {
//     sheetStatus.value = err?.result?.error?.message || err?.message || String(err);
//   }
// }
</script>

<template>
  <div>
    <h2>Input Exercise Data</h2>
    <div class="exercise-input-container">
      <div class="exercise-input">
        <label for="exercise-name">Name:</label>
        <select id="exercise-name" v-model="exercise.name">
          <option disabled value="">Select an exercise</option>
          <option v-for="sheetName in sheetNames" :key="sheetName" :value="sheetName">
            {{ sheetName }}
          </option>
        </select>
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
    <p v-if="submitStatus" class="submit-status">{{ submitStatus }}</p>
  </div>
</template>

<style scoped>
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

.submit-status {
  margin-top: 0.75rem;
}
</style>
