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

  // ログインページにいて認証されている場合、ホームにリダイレクト
  if (to.path === "/login" && isAuthenticated) {
    next("/");
    return;
  }

  // ルートが認証を要求し、認証されていない場合、ログインにリダイレクト
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next("/login");
    return;
  }

  // その他のケースでは次へ進む
  next();
});

export default router;
