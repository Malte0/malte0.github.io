import type { ExerciseData } from "../types";

export function isValidExercise(exercise: ExerciseData): boolean {
    let isValid = true;
    if (!exercise.name || typeof exercise.name !== 'string') {
        isValid = false;
    }
    if (typeof exercise.repsSet1 !== 'number' || exercise.repsSet1 <= 0) {
        isValid = false;
    }
    if (typeof exercise.repsSet2 !== 'number' || exercise.repsSet2 <= 0) {
        isValid = false;
    }
    if (typeof exercise.repsSet3 !== 'number' || exercise.repsSet3 <= 0) {
        isValid = false;
    }
    if (typeof exercise.repsSet4 !== 'number' || exercise.repsSet4 <= 0) {
        isValid = false;
    }
    return isValid;
}