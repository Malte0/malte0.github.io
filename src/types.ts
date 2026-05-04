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