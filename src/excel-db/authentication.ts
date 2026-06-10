import { ref } from "vue";

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4";
// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const AUTH_STORAGE_KEY = "malte0.github.io.googleAuth";

type StoredAuth = {
  access_token: string;
  expires_at: number;
};

export const gapiInitialized = ref(false);

function readStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredAuth;
    if (!parsed.access_token || typeof parsed.expires_at !== "number") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function storeAuth(accessToken: string, expiresInSeconds?: number) {
  const expiresAt = Date.now() + ((expiresInSeconds ?? 3600) * 1000);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ access_token: accessToken, expires_at: expiresAt }));
}

function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function restoreStoredAuth() {
  const storedAuth = readStoredAuth();
  if (!storedAuth || storedAuth.expires_at <= Date.now()) {
    clearStoredAuth();
    return false;
  }

  // @ts-ignore
  gapi.client.setToken({ access_token: storedAuth.access_token });
  return true;
}

export function isAuthenticated() {
  return readStoredAuth() !== null;
}

export async function initializeGapiClient(apiKey: string) {
  if (!apiKey.trim()) {
    return false;
  }

  try {
    // initialize the gapi client if you plan to use Google APIs (Sheets, etc.)
    // @ts-ignore
    await gapi.client.init({ apiKey: apiKey.trim(), discoveryDocs: [DISCOVERY_DOC] });
    console.log("Initializing gapi client2")
    return true;
  } catch (err: any) {
    return false;
  }
}

export let TOKEN_CLIENT = null;

export function initializeTokenClient(clientId: string, callback: () => void) {
  if (TOKEN_CLIENT) {
    return TOKEN_CLIENT;
  }

  console.log("ETS")

  if (!clientId.trim()) {
    return null;
  }
  // (window as any).google is available after loading the GSI script
  TOKEN_CLIENT = (window as any).google?.accounts?.oauth2?.initTokenClient({
    client_id: clientId.trim(),
    scope: SCOPES,
    callback: (resp: any) => {
      if (resp.error !== undefined) {
        clearStoredAuth();
        return;
      }

      // Store the access token on gapi so later API calls use it automatically.
      // @ts-ignore
      gapi.client.setToken({ access_token: resp.access_token });
      storeAuth(resp.access_token, resp.expires_in);
      callback();
    },
  });

  return TOKEN_CLIENT;
}