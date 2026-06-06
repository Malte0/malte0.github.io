<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const CLIENT_ID = "";
const API_KEY = "";
// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4";
// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

const content = ref("");

let tokenClient: any = null;

async function initializeGapiClient() {
  try {
    // initialize the gapi client if you plan to use Google APIs (Sheets, etc.)
    // keep this minimal; expand as you need
    // @ts-ignore
    await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] });
  } catch (err: any) {
    content.value = err?.message || String(err);
  }
}

function gapiLoaded() {
  // @ts-ignore
  gapi.load("client", initializeGapiClient);
}

function gisLoaded() {
  // initialize token client from Google Identity Services
  // (window as any).google is available after loading the GSI script
  tokenClient = (window as any).google?.accounts?.oauth2?.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "",
  });
}

async function handleAuthClick() {
  console.log("handleAuthClick called");
  if (!tokenClient) return;
  tokenClient.callback = async (resp: any) => {
    if (resp.error !== undefined) {
      content.value = JSON.stringify(resp);
      return;
    }
    // call any API you need here, e.g. listMajors()
  };

  // request token; choose prompt depending on existing token
  // @ts-ignore
  if (gapi?.client?.getToken() == null) tokenClient.requestAccessToken({ prompt: "consent" });
  else tokenClient.requestAccessToken({ prompt: "" });
}

function handleSignoutClick() {
    console.log("handleSignoutClick called");
  // @ts-ignore
  const token = gapi?.client?.getToken?.();
  if (token !== null && token !== undefined) {
    // revoke and clear
    (window as any).google?.accounts?.oauth2?.revoke(token.access_token);
    // @ts-ignore
    gapi.client.setToken("");
    content.value = "";
    authorizeVisible.value = true;
    signoutVisible.value = false;
  }
}

function appendScript(
  src: string,
  opts: { async?: boolean; defer?: boolean } = {},
  onload?: () => void,
) {
  const s = document.createElement("script");
  s.src = src;
  if (opts.async) s.async = true;
  if (opts.defer) s.defer = true;
  if (onload) s.onload = onload;
  document.head.appendChild(s);
  return s;
}

onMounted(() => {
  appendScript("https://apis.google.com/js/api.js", { async: true, defer: true }, gapiLoaded);
  appendScript("https://accounts.google.com/gsi/client", { async: true, defer: true }, gisLoaded);
});

onBeforeUnmount(() => {
  // Optional: remove appended scripts or listeners if needed
});
</script>

<template>
  <div>
    <h1>Login</h1>
    <div class="login-view-input-container">
      <input type="text" placeholder="Client ID" v-model="CLIENT_ID" />
      <input type="text" placeholder="API Key" v-model="API_KEY" />
      <button @click="handleAuthClick">Log in</button>
      <!-- <button @click="handleSignoutClick">Sign Out</button> -->
    </div>
    <pre>{{ content }}</pre>
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
