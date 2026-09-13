<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { gapiInitialized } from '../excel-db/authentication';
import { getExerciseProgressions, getSheetNames } from '../excel-db/db-utils';

type exerciseListItem = {
    name: string;
    progressions: string[];
}

const router = useRouter();
const exerciseList = ref<exerciseListItem[]>([]);
const searchQuery = ref<string>('');
// Only show exercises and progressions that match search query, case insensitive
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

const removeExerciseFromList = (exerciseName: string) => exerciseList.value = exerciseList.value.filter(e => e.name !== exerciseName);

async function updateExerciseList() {
    exerciseList.value = [];

    try {
        const exerciseNames = await getSheetNames(true);
        const progressions = await getExerciseProgressions(exerciseNames);
        for (const [exerciseName, progressionNames] of Object.entries(progressions)) {
            removeExerciseFromList(exerciseName);
            exerciseList.value.push({ name: exerciseName, progressions: progressionNames });
        }
    } catch (error) {
        console.error('Error fetching exercise list:', error);
        exerciseList.value = [];
    }
}

function onExerciseClick(exercise: exerciseListItem, progression?: string) {
    const targetExercise = encodeURIComponent(exercise.name);
    const targetProgression = encodeURIComponent(progression ?? exercise.progressions[0] ?? 'none');
    router.push(`/input/${targetExercise}/${targetProgression}`);
}

onMounted(async () => {
    if (gapiInitialized.value) {
        await updateExerciseList();
    }
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
                <ul v-if="!!exercise.progressions[0]" class="progression-list">
                    <li class="progression-item" v-for="(progression, idx) in exercise.progressions" :key="idx"
                        @click.stop="onExerciseClick(exercise, progression)"
                        @click="onExerciseClick(exercise, progression)">
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
    width: 100%;
}

.search-container {
    width: calc(100% - 2rem);
    padding: 1rem 1rem 0 1rem;
}

.search-input {
    width: calc(100% - 1rem);
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 0;
}

.exercise-button {
    width: calc(100% - 1rem);
    padding: 0.25rem 0.25rem 0.5rem 0.25rem;
    background-color: #444444;
    border-radius: 0.25rem;
    margin: 0.5rem 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.exercise-name {
    font-weight: bold;
    margin: 0;
    padding: 4px 8px;
    font-size: 1rem;
    text-align: left;
    border-radius: 0.25rem;
}

.exercise-name:hover,
.progression-item:hover {
    background-color: hsl(0, 0%, 34%);
}

.exercise-list {
    list-style-type: none;
    padding: 0 1rem;
    width: calc(100% - 2rem);
}

.progression-list {
    list-style-type: none;
    padding-left: 1rem;
}

.progression-item {
    padding: 0px 8px;
    text-align: left;
    border-radius: 0.25rem;
}
</style>
