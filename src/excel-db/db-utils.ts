import type { ExerciseData } from "../types";

const EXERCISE_SHEET_ID = import.meta.env.VITE_EXERCISE_SHEET_ID;
const WORKOUT_SHEET_ID = import.meta.env.VITE_WORKOUT_SHEET_ID;

export function isValidExercise(exercise: ExerciseData): boolean {
  let isValid = true;
  if (!exercise.name || typeof exercise.name !== "string") {
    isValid = false;
  }
  if (typeof exercise.repsSet1 !== "number" || exercise.repsSet1 <= 0) {
    isValid = false;
  }
  if (typeof exercise.repsSet2 !== "number" || exercise.repsSet2 <= 0) {
    isValid = false;
  }
  if (typeof exercise.repsSet3 !== "number" || exercise.repsSet3 <= 0) {
    isValid = false;
  }
  if (typeof exercise.repsSet4 !== "number" || exercise.repsSet4 <= 0) {
    isValid = false;
  }
  return isValid;
}

export async function getSheetNames(isExerciseSheet: boolean): Promise<string[]> {
  // @ts-ignore
  const spreadsheetResponse = await gapi.client.sheets.spreadsheets.get({
    spreadsheetId: isExerciseSheet ? EXERCISE_SHEET_ID : WORKOUT_SHEET_ID,
  });

  return spreadsheetResponse.result.sheets?.map((sheet: any) => sheet.properties?.title) ?? [];
}

export async function getProgressionNames(exerciseName: string): Promise<string[]> {
  // @ts-ignore
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: EXERCISE_SHEET_ID,
    range: `${exerciseName}!B2:B`, // Assuming progression names are in column B starting from row 2
  });
  const uniqueNames = new Set<string>();
  response.result.values?.forEach((name: string) => {
    if (name[0]?.trim()) {
      uniqueNames.add(name[0].trim());
    }
  });
  return uniqueNames.size > 0 ? Array.from(uniqueNames) : [""]; // Return [""] if no progression names are found
}
