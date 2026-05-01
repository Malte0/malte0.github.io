
import type { Exercise } from '../types';
import { isValidExercise } from './db-utils';

export function writeExercise(exercise: Exercise) {
    if (!isValidExercise(exercise)) {
        console.error('Invalid exercise data:', exercise);
        return;
    }
    // TODO: Push this to google sheets
}