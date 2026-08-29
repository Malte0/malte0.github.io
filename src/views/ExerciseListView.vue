<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { gapiInitialized } from '../excel-db/authentication';
import { getProgressionNames, getSheetNames } from '../excel-db/db-utils';

type exerciseListItem = {
    name: string;
    progressions: string[];
}

const router = useRouter();
const exerciseList = ref<exerciseListItem[]>([]);
const searchQuery = ref<string>('');

const filteredExerciseList = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();

    if (!query) {
        return exerciseList.value;
    }

    return exerciseList.value.filter(({ name, progressions }) => {
        const searchableText = [name, ...progressions].join(' ').toLowerCase();
        return searchableText.includes(query);
    });
});

async function updateExerciseList() {
    exerciseList.value = [];

    try {
        const exerciseNames = await getSheetNames(true);

        for (const exerciseName of exerciseNames) {
            const progressions = await getProgressionNames(exerciseName);
            exerciseList.value.push({ name: exerciseName, progressions });
        }
    } catch (error) {
        console.error('Error fetching exercise list:', error);
        exerciseList.value = []; // Fallback to default exercise in case of error
    }
}

function onExerciseClick(exercise: exerciseListItem, progression?: string) {
    const targetExercise = encodeURIComponent(exercise.name);
    const targetProgression = encodeURIComponent(progression ?? exercise.progressions[0] ?? 'none');
    router.push(`/input/${targetExercise}/${targetProgression}`);
}

onMounted(async () => {
    await updateExerciseList();
});

watch(gapiInitialized, async () => {
    await updateExerciseList();
});
</script>

<template>
    <div class="exercise-list-container">
        <div class="search-container">
            <input type="text" v-model="searchQuery" placeholder="Search exercises..." class="search-input" />
        </div>
        <ul class="exercise-list">
            <li class="exercise-button" v-for="(exercise, index) in filteredExerciseList" :key="index">
                <h3 class="exercise-name" @click="onExerciseClick(exercise)">
                    {{ exercise.name }}
                </h3>
                <ul class="progression-list">
                    <li class="progression-item" v-for="(progression, idx) in exercise.progressions" :key="idx" @click.stop="onExerciseClick(exercise, progression)" @click="onExerciseClick(exercise, progression)">
                        {{ progression }}
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.exercise-list-container {
    max-width: 400px;
    width: 400px;
}

.search-container {
    width: calc(100% - 2rem);
    padding: 1rem 1rem 0 1rem;
}

.search-input {
    width: calc(100% - 1rem);
    padding: 0.5rem;
}

.exercise-button {
    width: calc(100% - 2rem);
    padding: 0.5rem;
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
    background-color: hsl(0, 0%, 33%);
}

.exercise-list {
    list-style-type: none;
    padding: 0 1rem;
    width: calc(100% - 2rem);
}

.progression-list {
    list-style-type: none;
    padding-left: 20px;
}

.progression-item {
    margin: 5px 0;
    text-align: left;
    background-color: hsl(0, 0%, 33%);
}
</style>
