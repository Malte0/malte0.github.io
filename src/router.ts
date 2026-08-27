import { createWebHashHistory, createRouter } from "vue-router";

import ExerciseInput from "./views/ExerciseInputView.vue";
import HomeView from "./views/HomeView.vue";
import LoginView from "./views/LoginView.vue";
import RawDataView from "./views/RawDataView.vue";
import WorkoutView from "./views/WorkoutView.vue";
import TrainingView from "./views/TrainingView.vue";
import ExerciseListView from "./views/ExerciseListView.vue";

const routes = [
  { path: "/", component: LoginView },
  { path: "/home", component: HomeView },
  { path: "/input/:exercise/:progression", component: ExerciseInput },
  { path: "/login", component: LoginView },
  { path: "/rawData", component: RawDataView },
  { path: "/workouts", component: WorkoutView },
  { path: "/training/:pathMatch(.*)*", component: TrainingView },
  { path: "/exerciseList", component: ExerciseListView },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
