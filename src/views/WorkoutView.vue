<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { gapiInitialized, isAuthenticated, restoreStoredAuth } from "../excel-db/authentication";
import { getSheetNames } from "../excel-db/db-utils";
import type { Workout } from "../types";
import { useRouter } from "vue-router";

const router = useRouter();
const SHEET_ID = import.meta.env.VITE_WORKOUT_SHEET_ID;
const sheetTitles = ref<string[]>([]);
const selectedSheetTitle = ref("");
const sheetStatus = ref("Checking authentication...");

const exerciseNames = ref<string[]>([]);

const workoutInGoogleSheet = ref<Workout[]>([]);
const updatedWorkout = ref<Workout[]>([]);

async function initializeSheetView() {
	if (!gapiInitialized.value) {
		sheetStatus.value = "Checking authentication...";
		return;
	}

	if (!isAuthenticated()) {
		sheetStatus.value = "Not authenticated.";
		return;
	}

	restoreStoredAuth();
	sheetTitles.value = (await getSheetTitles()) as string[];
	selectedSheetTitle.value = sheetTitles.value[0] || "";
	sheetStatus.value = "";

	if (selectedSheetTitle.value) {
		await readSheetContents();
	}
}

async function refreshSheets() {
	await initializeSheetView();
}

async function getSheetTitles() {
	// @ts-ignore
	const spreadsheetResponse = await gapi.client.sheets.spreadsheets.get({
		spreadsheetId: SHEET_ID,
	});

	return spreadsheetResponse.result.sheets?.map((sheet: any) => sheet.properties?.title) ?? [];
}

// Parse string[][] into Workout[] using index assignment
function sheetsFormat2Dictionary(sheetsFormat: string[][]): Workout[] {
	const workout: Workout[] = [];
	for (const row of sheetsFormat) {
		workout.push({
			name: row[0] ?? "",
			progression: row[1] ?? "",
			sets: Number(row[2]) || 0,
			weight: row[3] || "",
			breakTime: Number(row[4]) || 0,
			dropset: row[5] || "",
			dropsetProgression: row[6] || "",
			dropsetWeight: row[7] || "",
			superset: row[8] || "",
			supersetProgression: row[9] || "",
			supersetWeight: row[10] || "",
			triset: row[11] || "",
			trisetProgression: row[12] || "",
			trisetWeight: row[13] || "",
		});
	}
	return workout;
}

async function readSheetContents() {
	sheetTitles.value = await getSheetNames(false);
	exerciseNames.value = await getSheetNames(true);
	try {
		const sheetTitle = selectedSheetTitle.value;

		if (!sheetTitle) {
			workoutInGoogleSheet.value = [];
			updatedWorkout.value = [];
			return;
		}

		// @ts-ignore
		const valuesResponse = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: SHEET_ID,
			range: `${sheetTitle}!A:Z`,
		});

		workoutInGoogleSheet.value = sheetsFormat2Dictionary(valuesResponse.result.values ?? []);
		updatedWorkout.value = JSON.parse(JSON.stringify(workoutInGoogleSheet.value)); // Deep copy for change tracking
		console.log(updatedWorkout.value);
		if (workoutInGoogleSheet.value.length === 0) {
			workoutInGoogleSheet.value = [];
			updatedWorkout.value = [];
		}
	} catch (err: any) {
		sheetStatus.value = err?.result?.error?.message || err?.message || String(err);
	}
}

onMounted(async () => {
	await initializeSheetView();
});

watch(gapiInitialized, async () => {
	await initializeSheetView();
});

function hasChanges(): boolean {
	return JSON.stringify(workoutInGoogleSheet.value) !== JSON.stringify(updatedWorkout.value);
}

function startWorkout() {
	if (hasChanges() && !confirm("Unsaved changes. Save changes?")) {
		return;
	}
	router.push("/training");
}

function resetWorkout() {
	updatedWorkout.value = JSON.parse(JSON.stringify(workoutInGoogleSheet.value));
}
</script>

<template>
	<div>
		<div class="toolbar">
			<select v-model="selectedSheetTitle" @change="readSheetContents">
				<option v-for="title in sheetTitles" :key="title" :value="title">
					{{ title }}
				</option>
			</select>
			<button @click="refreshSheets">Refresh</button>
		</div>
		<div v-for="(row, rowIndex) in updatedWorkout.slice(1)" :key="rowIndex" class="workout-exercise">
			<div class="workout-exercise-header">
				<div class="workout-exercise-sets">
					Sets: {{ row.sets }}
				</div>
				<div class="workout-exercise-time">
					Break Time: {{ row.breakTime || 0 }}min
				</div>
			</div>
			<div class="workout-exercise-body">
				<div class="workout-exercise-row">
					<div class="workout-exercise-name">
						<select v-model="updatedWorkout[rowIndex + 1]!.name">
							<option v-for="name in exerciseNames" :key="name" :value="name">
								{{ name }}
							</option>
						</select>
					</div>
					<div class="workout-exercise-progression">
						{{ row.progression }}
					</div>
					<div class="workout-exercise-weight">
						Weight: {{ row.weight || 0 }}{{ Number.isNaN(row.weight) ? '' : 'kg' }}
					</div>
				</div>
				<div v-if="row.dropset" class="workout-exercise-row">
					<div class="workout-exercise-name">
						Dropset: {{ row.dropset }}
					</div>
					<div class="workout-exercise-progression">
						{{ row.dropsetProgression }}
					</div>
					<div class="workout-exercise-weight">
						Weight: {{ row.dropsetWeight || 0 }}{{ Number.isNaN(row.dropsetWeight) ? '' : 'kg' }}
					</div>
				</div>
				<div v-if="row.superset" class="workout-exercise-row">
					<div class="workout-exercise-name">
						Superset: {{ row.superset }}
					</div>
					<div class="workout-exercise-progression">
						{{ row.supersetProgression }}
					</div>
					<div class="workout-exercise-weight">
						Weight: {{ row.supersetWeight || 0 }}{{ Number.isNaN(row.supersetWeight) ? '' : 'kg' }}
					</div>
				</div>
				<div v-if="row.triset" class="workout-exercise-row">
					<div class="workout-exercise-name">
						Triset: {{ row.triset }}
					</div>
					<div class="workout-exercise-progression">
						{{ row.trisetProgression }}
					</div>
					<div class="workout-exercise-weight">
						Weight: {{ row.trisetWeight || 0 }}{{ Number.isNaN(row.trisetWeight) ? '' : 'kg' }}
					</div>
				</div>
			</div>
		</div>
		<div class="workout-buttons">
			<button :disabled="!hasChanges()" @click="resetWorkout">Reset</button>
			<button :disabled="!hasChanges()" @click="() => console.log('Save clicked')">Save</button>
			<button @click="startWorkout">Start Workout</button>
		</div>
		<div v-if="sheetStatus">
			{{ sheetStatus }}
		</div>
	</div>
</template>

<style scoped>
.workout-buttons {
	display: flex;
	gap: 0.75rem;
	margin-top: 1rem;
}

.workout-exercise-body {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 0.5rem;
}

.workout-exercise-row {
	display: flex;
	gap: 1rem;
}

.workout-exercise-header {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1rem;
	padding: 0.5rem;
	border-bottom: 1px solid #d0d7de;
	background: hsl(210, 24%, 83%);
	border-radius: 10px 10px 0 0;
}

.workout-exercise {
	display: flex;
	flex-direction: column;
	padding: 0.75rem;
	border: 1px solid #d0d7de;
	border-radius: 10px;
	background: #f6f8fa;
	color: #24292f;
	margin-bottom: 1rem;
}

.toolbar {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 1rem;
}

select {
	min-width: 240px;
	padding: 0.65rem 0.9rem;
	border: 1px solid #d0d7de;
	border-radius: 10px;
	background: #fff;
	color: #24292f;
	font-size: 0.95rem;
	line-height: 1.2;
	box-shadow: 0 1px 2px rgba(27, 31, 36, 0.08);
	appearance: none;
}

select:hover {
	border-color: #8c959f;
}

select:focus {
	outline: none;
	border-color: #0969da;
	box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.15);
}

button {
	padding: 0.65rem 1rem;
	border: 1px solid #d0d7de;
	border-radius: 10px;
	background: #f6f8fa;
	color: #24292f;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.15s ease, border-color 0.15s ease;
}

button:hover {
	background: #eef1f4;
	border-color: #8c959f;
}

button:active {
	background: #eaeef2;
}
</style>
