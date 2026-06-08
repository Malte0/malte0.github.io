<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { appendScript } from "./functions/utils";

onMounted(() => {
  appendScript("https://apis.google.com/js/api.js", { async: true, defer: true });
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
