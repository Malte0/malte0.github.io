<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { gapiInitialized, initializeGapiClient, initializeTokenClient, isAuthenticated, restoreStoredAuth } from "../excel-db/authentication";
import { useRouter } from "vue-router";

const router = useRouter();
const clientId = ref("662873548613-9jltvrdctvcv383bu7hvo6h919bidq9a.apps.googleusercontent.com");
const apiKey = ref(import.meta.env.VITE_API_KEY);

const status = ref("Enter credentials.");

function redirectIfAuthenticated() {
  if (gapiInitialized.value && isAuthenticated()) {
    restoreStoredAuth();
    router.push('/rawData');
  }
}

onMounted(() => {
  redirectIfAuthenticated();
});

watch(gapiInitialized, () => {
  redirectIfAuthenticated();
});

async function handleAuthClick() {
  console.log("Auth button clicked with Client ID:", clientId.value, "and API Key:", apiKey.value);
  if (!gapiInitialized.value) {
    gapiInitialized.value = gapiInitialized.value || await initializeGapiClient(apiKey.value);
    if (!gapiInitialized.value) return;
  }

  // initialize token client from Google Identity Services
  const client = initializeTokenClient(clientId.value.trim(), () => router.push('/rawData'));
  if (!client) return;

  console.log("Token client initialized:", client);
  // request token; choose prompt depending on existing token
  // @ts-ignore
  client.requestAccessToken({ prompt: "" });
}

</script>

<template>
  <div>
    <h1>Login</h1>
    <div class="login-view-input-container">
      <input type="text" placeholder="Client ID" v-model="clientId" />
      <input type="text" placeholder="API Key" v-model="apiKey" />
      <button @click="handleAuthClick">Log in</button>
    </div>
    <pre>{{ status }}</pre>
  </div>
</template>

<style scoped>
.login-view-input-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

button {
  margin: 5px;
}
</style>
