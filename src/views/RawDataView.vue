//
<script setup lang="ts">
import { gapiInitialized, isAuthenticated, restoreStoredAuth } from "../excel-db/authentication";
import { ref, onMounted, watch } from "vue";
const SHEET_ID = import.meta.env.VITE_SHEET_ID;

const sheetTitles = ref<string[]>([]);
const selectedSheetTitle = ref("");
const sheetStatus = ref("Checking authentication...");
const sheetContent = ref("");

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
  sheetTitles.value = await getSheetTitles() as string[];
  selectedSheetTitle.value = sheetTitles.value[0] || "";
  sheetStatus.value = "";
}

function refreshSheets() {
  getSheetTitles();
  readSheetContents();
}

async function getSheetTitles() {
  // @ts-ignore
  const spreadsheetResponse = await gapi.client.sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  return spreadsheetResponse.result.sheets?.map((sheet: any) => sheet.properties?.title) ?? [];
}

async function readSheetContents() {
  console.log("Reading contents of sheet:", selectedSheetTitle.value);
  try {
    const sheetTitle = selectedSheetTitle.value;
    console.log("Selected sheet title:", sheetTitle);

    // @ts-ignore
    const valuesResponse = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${sheetTitle}!A:Z`,
    });

    sheetContent.value = JSON.stringify(valuesResponse.result.values ?? [], null, 2);
    if (sheetContent.value === "[]") {
      sheetContent.value = "Sheet is empty.";
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
    <div>
      {{ sheetContent }}
    </div>
    <div v-if="sheetStatus">
      {{ sheetStatus }}
    </div>
  </div>
</template>

<style scoped>
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
