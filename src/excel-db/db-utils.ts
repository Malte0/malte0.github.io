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

// Looks at exercises in workout and returns the first exercise that has not yet been completed on the current day
export async function fetchCurrentWorkoutExercises(date: string, workout: string): Promise<string> {
  // First fetch all exercises in the workout (maybe optimize by giving as argument)
  // @ts-ignore
  const responseWorkouts = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: WORKOUT_SHEET_ID,
    range: `${workout}!A2:A`, // Exercise names are in the first column
  });
  const exercises = responseWorkouts.result.values ?? [];
  const exerciseNames = exercises.map((row: any) => row[0]); // Assuming exercise names are in column A
  console.log("Fetched exercises:", exerciseNames);

  // Second, check exercises if they have an entry for that day
  let mostRecentExercise = "";
  for (const exercise of exerciseNames) {
    // @ts-ignore
    const responseProgress = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: EXERCISE_SHEET_ID,
      range: `${exercise}!A2:A`,
    });
    const trainingDates = responseProgress.result.values ?? [];
    console.log("Fetched progress data:", trainingDates);
    for (const trainingDate of trainingDates) {
      if (trainingDate[0] === date) {
        mostRecentExercise = exercise;
        break;
      }
    }
  }
  return mostRecentExercise;
}

export async function getSetsDone(exercise: string, date: string): Promise<number> {
  // @ts-ignore
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: EXERCISE_SHEET_ID,
    range: `${exercise}!C2:J`,
  });
  let trainingDates: string[][] = response.result.values ?? [[]];
  // Filter out empty strings and falsy cells from each row
  trainingDates = trainingDates.map((row) => row.filter((cell) => !!cell));
  console.log(trainingDates);
  return trainingDates[trainingDates.length - 1]?.length ?? 0; 
}

export async function getSetsPlanned(workout: string, exercise: string): Promise<number> {
  // @ts-ignore
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: WORKOUT_SHEET_ID,
    range: `${workout}!A2:C`,
  });
  const workoutRows = response.result.values ?? [[]];
  console.log("Fetched workout data for sets planned:", workoutRows);
  for (const row of workoutRows) {
    if (row[0] === exercise) {
      return parseInt(row[2], 10); // Assuming sets planned are in column C
    }
  }
  return 0;
}