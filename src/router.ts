import { createWebHistory, createRouter } from "vue-router";

import ExerciseInput from "./views/ExerciseInputView.vue";

const routes = [
  { path: "/", component: ExerciseInput },
  { path: "/input", component: ExerciseInput },
  // { TODO: put in seperate view for tidyness
  //   path: "material-editor/:pathMatch(.*)",
  //   component: CaseView,
  // },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
