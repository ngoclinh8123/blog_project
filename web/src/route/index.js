import { lazy } from "react";

// layout
import defaultLayout from "/src/component/layout/default_layout";
import auth from "/src/component/layout/auth";

// pages
const home = lazy(() => import("/src/page/home"));
const profile = lazy(() => import("/src/page/profile"));
const category = lazy(() => import("/src/page/category"));
const blog = lazy(() => import("/src/page/blog"));
const login = lazy(() => import("/src/page/auth/login"));
const resetPassword = lazy(() => import("/src/page/auth/reset_password"));
const forgotPassword = lazy(() => import("/src/page/auth/forgot_password"));
const sendMailResult = lazy(() => import("/src/page/auth/send_mail_result"));

// routes
const publicRoutes = [
  { path: "/", page: home, layout: defaultLayout },
  { path: "/profile", page: profile, layout: defaultLayout },
  { path: "/category", page: category, layout: defaultLayout },
  { path: "/blog", page: blog, layout: defaultLayout },
  { path: "/login", page: login, layout: auth },
  { path: "/forgot-password", page: forgotPassword, layout: auth },
  { path: "/forgot-password/result", page: sendMailResult, layout: auth },
  { path: "/reset-password", page: resetPassword, layout: auth },
];

export { publicRoutes };
