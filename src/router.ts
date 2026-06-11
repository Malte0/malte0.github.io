import { createWebHashHistory, createRouter } from "vue-router";

import ExerciseInput from "./views/ExerciseInputView.vue";
import LoginView from "./views/LoginView.vue";
import RawDataView from "./views/RawDataView.vue";

const routes = [
  { path: "/", component: ExerciseInput },
  { path: "/input", component: ExerciseInput },
  { path: "/login", component: LoginView },
  { path: "/rawData", component: RawDataView },
  // { TODO: put in seperate view for tidyness
  //   path: "material-editor/:pathMatch(.*)",
  //   component: CaseView,
  // },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
