export type Exercise = {
    name: string;
    sets: number;
    reps: number;
    date: string;
    weight?: number;
    time?: number;
    notes?: string;
    targetReps?: number;
}

export type ExerciseData = {
    name: string;
    Progression: string;
    repsSet1: number;
    repsSet2: number;
    repsSet3: number;
    repsSet4: number;
    date: string;
    weight?: number;
    time?: number;
    notes?: string;
}