import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";
import Home from "../views/Home.vue";

function guardMyroute(to, from, next) {
  const option = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  fetch("http://localhost:3000/api/user/isauth", option)
    .then((response) => response.json())
    .then((data) => {
      next();
      if (data.error) {
        router.push("/");
      }
    });
}

const routes = [
  {
    path: "/",
    name: "Auth",
    component: Auth,
  },
  {
    path: "/home",
    name: "Home",
    beforeEnter: guardMyroute,
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
