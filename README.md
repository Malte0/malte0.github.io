TODO: Also log durations of workouts


solution for database:?
https://phiresky.github.io/blog/2021/hosting-sqlite-databases-on-github-pages/
https://jlongster.com/future-sql-web

App, die workouts so trackt, dass während einem workout die aktueller Übung angezeigt wird, dazu die Wiederholungen beim jeweiligen Satz I'm zuvorigen Workout und daruntwr einfach nur ein digital es Zahlemrad mir dem man einstellt kann Wie viel/Wie lange man eine Übung gemacht hat, und dann noch weiter dr7cken kann nächsten Satz Oder naechsten übung zu kommen

## Write from static site to Google Sheets

Use a Google Apps Script web app as a tiny backend. The static Vue app posts exercise JSON to that endpoint.

### 1) Create the Google Sheet

Create a sheet with this first row:

timestamp | name | sets | reps | date | weight | time | notes

### 2) Create Apps Script web app

In the sheet, open Extensions > Apps Script and paste this code:

```javascript
const SHEET_NAME = 'Sheet1';

function doPost(e) {
	try {
		const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
		if (!sheet) {
			return jsonResponse({ ok: false, error: 'Sheet not found' }, 500);
		}

		const data = JSON.parse(e.postData.contents || '{}');
		sheet.appendRow([
			new Date(),
			data.name || '',
			data.sets || '',
			data.reps || '',
			data.date || '',
			data.weight || '',
			data.time || '',
			data.notes || '',
		]);

		return jsonResponse({ ok: true });
	} catch (err) {
		return jsonResponse({ ok: false, error: String(err) }, 500);
	}
}

function doGet() {
	return jsonResponse({ ok: true, status: 'alive' });
}

function jsonResponse(obj, statusCode) {
	return ContentService.createTextOutput(JSON.stringify(obj))
		.setMimeType(ContentService.MimeType.JSON);
}
```

Deploy it via Deploy > New deployment > Web app:

- Execute as: Me
- Who has access: Anyone

Copy the web app URL.

### 3) Add endpoint to Vite env

Copy `.env.example` to `.env` and set:

```bash
VITE_GOOGLE_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Then restart the Vite dev server.

### 4) App-side integration

The app now posts from `src/excel-db/writeExercise.ts` to your Apps Script URL.
The form in `src/views/ExerciseInputView.vue` shows success/failure feedback after submit.