<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { gapiInitialized } from '../excel-db/authentication';
import { getProgressionNames, getSheetNames } from '../excel-db/db-utils';

type exerciseListItem = {
    name: string;
    progressions: string[];
}

const defaultExercise: exerciseListItem = {
    name: "Default Exercise",
    progressions: ["Default Progression 1", "Default Progression 2"]
};

const exerciseList = ref<exerciseListItem[]>([
    defaultExercise
]);

async function updateExerciseList() {
    try {
        const exerciseNames = await getSheetNames(true);

        for (const exerciseName of exerciseNames) {
            const progressions = await getProgressionNames(exerciseName);
            exerciseList.value.push({ name: exerciseName, progressions });
        }
    } catch (error) {
        console.error('Error fetching exercise list:', error);
        exerciseList.value = [defaultExercise]; // Fallback to default exercise in case of error
    }
}


onMounted(async () => {
    await updateExerciseList();
});

watch(gapiInitialized, async () => {
    await updateExerciseList();
});
</script>

<template>
    <div>
        <h2>Exercise List</h2>
        <ul class="exercise-list">
            <li class="exercise-button" v-for="(exercise, index) in exerciseList" :key="index">
                <h3 class="exercise-name">{{ exercise.name }}</h3>
                <ul class="progression-list">
                    <li class="progression-item" v-for="(progression, idx) in exercise.progressions" :key="idx">
                        {{ progression }}
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.exercise-button {
    width: 100%;
    padding: 10px;
    background-color: #444444;
    margin: 5px 0;
    cursor: pointer;
}

.exercise-button:hover {
    background-color: #555555;
}

.exercise-button:active {
    background-color: #666666;
}

.exercise-name {
    font-weight: bold;
    margin: 8px;
    text-align: left;
}

.exercise-list {
    list-style-type: none;
    padding: 0;
}

.progression-list {
    list-style-type: none;
    padding-left: 20px;
}

.progression-item {
    margin: 5px 0;
    text-align: left;
}
</style>
