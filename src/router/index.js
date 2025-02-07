import Vue from "vue";
import VueRouter from "vue-router";
import ScenarioCreate from "@/views/ScenarioCreate.vue";
import ScenarioUpdate from "@/views/ScenarioUpdate.vue";
import ManualCreate from "@/views/ManualCreate.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/create" },
  { path: "/create", component: ScenarioCreate },
  { path: "/update", component: ScenarioUpdate },
  { path: "/manual", component: ManualCreate },
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("../views/Login.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith("isLoggedIn=true"));

  if (to.path !== "/login" && !isLoggedIn) {
    next("/login");
  } else if (to.path === "/login" && isLoggedIn) {
    next("/");
  } else {
    next();
  }
});

export default router;
