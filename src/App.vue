<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { appendScript } from "./functions/utils";
import { gapiInitialized, initializeGapiClient, restoreStoredAuth } from "./excel-db/authentication";

function gapiLoaded() {
  const apiKey = import.meta.env.VITE_API_KEY;
  // @ts-ignore
  gapi.load("client", async () => {
    gapiInitialized.value = gapiInitialized.value || await initializeGapiClient(apiKey.trim());
    if (gapiInitialized.value) {
      restoreStoredAuth();
    }
  });
}

onMounted(() => {
  appendScript("https://apis.google.com/js/api.js", { async: true, defer: true }, gapiLoaded);
  appendScript("https://accounts.google.com/gsi/client", { async: true, defer: true });
});
</script>

<template>
  <RouterView />
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: rgb(150, 150, 150);
}
</style>
