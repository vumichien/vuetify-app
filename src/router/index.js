import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "../views/Home.vue";
import Login from "../views/Login.vue";
import ScenarioCreate from "@/views/ScenarioCreate.vue";
import ScenarioUpdate from "@/views/ScenarioUpdate.vue";
import ManualCreate from "@/views/ManualCreate.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/create",
    name: "Create",
    component: ScenarioCreate,
    meta: { requiresAuth: true },
  },
  {
    path: "/update",
    name: "Update",
    component: ScenarioUpdate,
    meta: { requiresAuth: true },
  },
  {
    path: "/manual",
    name: "Manual",
    component: ManualCreate,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = document.cookie.includes("isLoggedIn=true");

  // Nếu đang ở login page và đã authenticated, chuyển về home
  if (to.path === "/login" && isAuthenticated) {
    next("/");
    return;
  }

  // Nếu route yêu cầu auth và chưa authenticated, chuyển về login
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next("/login");
    return;
  }

  // Các trường hợp còn lại cho phép đi tiếp
  next();
});

export default router;
