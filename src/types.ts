export type Exercise = {
    name: string;
    sets: number;
    reps: number;
    date: string;
    weight?: string;
    time?: number;
    notes?: string;
    targetReps?: number;
}

export type ExerciseData = {
    name: string;
    progression: string;
    repsSet1?: number;
    repsSet2?: number;
    repsSet3?: number;
    repsSet4?: number;
    timeSet1?: number;
    timeSet2?: number;
    timeSet3?: number;
    timeSet4?: number;
    weight?: string;
    breakTime?: number;
    date: string;
    dropset?: string;
    notes?: string;
}

export type Workout = {
    name: string;
    progression: string;
    sets: number;
    weight?: string;
    breakTime?: number;
    dropset?: string;
    dropsetProgression: string;
    dropsetWeight?: string;
    superset?: string;
    supersetProgression: string;
    supersetWeight?: string;
    triset?: string;
    trisetProgression: string;
    trisetWeight?: string;
}