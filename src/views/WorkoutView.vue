<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { gapiInitialized, isAuthenticated, restoreStoredAuth } from "../excel-db/authentication";

const SHEET_ID = "1lY4UddBpoSP9QQ4UXA9tfwbl5pRMvZbMSuiamklBRO8";

const sheetTitles = ref<string[]>([]);
const selectedSheetTitle = ref("");
const sheetStatus = ref("Checking authentication...");
const sheetContent = ref<string[][]>([[]]);

const isDevelopment = import.meta.env.DEV;

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

async function readSheetContents() {
	try {
		const sheetTitle = selectedSheetTitle.value;

		if (!sheetTitle) {
			sheetContent.value = [["No sheet selected."]];
			return;
		}

		// @ts-ignore
		const valuesResponse = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: SHEET_ID,
			range: `${sheetTitle}!A:Z`,
		});

		sheetContent.value = (valuesResponse.result.values ?? []) as string[][];
		if (sheetContent.value.length === 0) {
			sheetContent.value = [["Sheet is empty."]] as string[][];
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
		<div v-for="(row, rowIndex) in sheetContent.slice(1)" :key="rowIndex" class="workout-exercise">
			<div class="workout-exercise-header">
				<div class="workout-exercise-name">
					{{ row[0] }}
				</div>
				<div class="workout-exercise-progression">
					{{ row[1] }}
				</div>
				<div class="workout-exercise-weight">
					Weight: {{ row[3] || 0 }}
				</div>
			</div>
			<div class="workout-exercise-header" v-if="row[5] || row[6]">
				<div class="workout-exercise-name">
					{{ row[5] }}
				</div>
				<div class="workout-exercise-progression">
					{{ row[6] }}
				</div>
				<div class="workout-exercise-weight">
					Weight: {{ row[7] || 0 }}
				</div>
			</div>
			<div class="workout-exercise-header" v-if="row[7] || row[8]">
				<div class="workout-exercise-name">
					{{ row[8] }}
				</div>
				<div class="workout-exercise-progression">
					{{ row[9] }}
				</div>
				<div class="workout-exercise-weight">
					Weight: {{ row[10] || 0 }}
				</div>
			</div>
			<div class="workout-exercise-header" v-if="row[7] || row[8]">
				<div class="workout-exercise-name">
					{{ row[11] }}
				</div>
				<div class="workout-exercise-progression">
					{{ row[12] }}
				</div>
				<div class="workout-exercise-weight">
					Weight: {{ row[13] || 0 }}
				</div>
			</div>
			<div class="workout-exercise-sets">
				Sets: {{ row[2] }}
			</div>
			<div class="workout-exercise-time">
				Break Time: {{ row[4] || 0 }}min
			</div>
		</div>
		<div v-if="isDevelopment">
			<table>
				<tbody>
					<tr v-for="(row, rowIndex) in sheetContent" :key="rowIndex">
						<td v-for="(cell, cellIndex) in row" :key="cellIndex">
							{{ cell }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div v-if="sheetStatus">
			{{ sheetStatus }}
		</div>
	</div>
</template>

<style scoped>
.workout-exercise-body {
	display: flex;
	gap: 1rem;
	margin-top: 0.5rem;
}

.workout-exercise-header {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 0.5rem;
}

.workout-exercise-name {
	font-weight: 600;
	font-size: 1.1rem;
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
