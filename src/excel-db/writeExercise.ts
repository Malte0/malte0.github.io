
import type { Exercise, ExerciseData } from '../types';
import { isValidExercise } from './db-utils';

type WriteExerciseResult = {
    ok: boolean;
    error?: string;
};

export async function writeExercise(exercise: ExerciseData): Promise<WriteExerciseResult> {
    if (!isValidExercise(exercise)) {
        console.error('Invalid exercise data:', exercise);
        return { ok: false, error: 'Invalid exercise data' };
    }

    const endpoint = import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL;
    if (!endpoint) {
        return {
            ok: false,
            error: 'Missing VITE_GOOGLE_SHEETS_WEBAPP_URL environment variable',
        };
    }

    const payload = {
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        date: exercise.date,
        weight: exercise.weight ?? '',
        time: exercise.time ?? '',
        notes: exercise.notes ?? '',
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            return {
                ok: false,
                error: `Request failed: ${response.status} ${response.statusText}`,
            };
        }

        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : 'Unknown network error',
        };
    }
}