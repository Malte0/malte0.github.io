


// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4";
// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

export async function initializeGapiClient(apiKey: string) {
  if (!apiKey.trim()) {
    return false;
  }

  try {
    // initialize the gapi client if you plan to use Google APIs (Sheets, etc.)
    // @ts-ignore
    await gapi.client.init({ apiKey: apiKey.trim(), discoveryDocs: [DISCOVERY_DOC] });
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

  if (!clientId.trim()) {
    return null;
  }

  // (window as any).google is available after loading the GSI script
  TOKEN_CLIENT = (window as any).google?.accounts?.oauth2?.initTokenClient({
    client_id: clientId.trim(),
    scope: SCOPES,
    callback: (resp: any) => {
      if (resp.error !== undefined) {
        return;
      }

      // Store the access token on gapi so later API calls use it automatically.
      // @ts-ignore
      gapi.client.setToken({ access_token: resp.access_token });
      callback();
    },
  });

  return TOKEN_CLIENT;
}