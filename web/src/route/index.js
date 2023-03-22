import { lazy } from "react";

// layout
import DefaultLayout from "/src/component/layout/default_layout";
import Auth from "/src/component/layout/auth";

// pages
const Home = lazy(() => import("/src/page/home"));
const Profile = lazy(() => import("/src/page/profile"));
const Category = lazy(() => import("/src/page/category"));
const Blog = lazy(() => import("/src/page/blog"));
const Login = lazy(() => import("/src/page/auth/login"));
const ResetPassword = lazy(() => import("/src/page/auth/reset_password"));
const ForgotPassword = lazy(() => import("/src/page/auth/forgot_password"));
const SendMailResult = lazy(() => import("/src/page/auth/send_mail_result"));

// routes
const publicRoutes = [
  { path: "/", page: Home, layout: DefaultLayout },
  { path: "/profile", page: Profile, layout: DefaultLayout },
  { path: "/category/:id", page: Category, layout: DefaultLayout },
  { path: "/blog/:id", page: Blog, layout: DefaultLayout },
  { path: "/login", page: Login, layout: Auth },
  { path: "/forgot-password", page: ForgotPassword, layout: Auth },
  { path: "/forgot-password/result", page: SendMailResult, layout: Auth },
  { path: "/reset-password", page: ResetPassword, layout: Auth },
];

export { publicRoutes };
