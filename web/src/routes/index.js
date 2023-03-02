import { lazy } from "react";

// layout
import { DefaultLayout } from "../components/layouts";
import Auth from "../components/layouts/auth";

// pages
const Home = lazy(() => import("../pages/home"));
const Profile = lazy(() => import("../pages/profile"));
const Category = lazy(() => import("../pages/category"));
const Blog = lazy(() => import("../pages/blog"));
const Login = lazy(() => import("../pages/auth/login"));
const ResetPassword = lazy(() => import("../pages/auth/reset_password"));
const ForgotPassword = lazy(() => import("../pages/auth/forgot_password"));
const SendMailResult = lazy(() => import("../pages/auth/send_mail_result"));

// routes
const publicRoutes = [
  { path: "/", page: Home, layout: DefaultLayout },
  { path: "/profile", page: Profile, layout: DefaultLayout },
  { path: "/category", page: Category, layout: DefaultLayout },
  { path: "/blog", page: Blog, layout: DefaultLayout },
  { path: "/login", page: Login, layout: Auth },
  { path: "/forgot-password", page: ForgotPassword, layout: Auth },
  { path: "/forgot-password/result", page: SendMailResult, layout: Auth },
  { path: "/reset-password", page: ResetPassword, layout: Auth },
];

export { publicRoutes };
