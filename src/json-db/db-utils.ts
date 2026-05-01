import type { Exercise } from "../types";

export function isValidExercise(exercise: Exercise): boolean {
    let isValid = true;
    if (!exercise.name || typeof exercise.name !== 'string') {
        isValid = false;
    }
    if (typeof exercise.sets !== 'number' || exercise.sets <= 0) {
        isValid = false;
    }
    if (typeof exercise.reps !== 'number' || exercise.reps <= 0) {
        isValid = false;
    }
    return isValid;
}