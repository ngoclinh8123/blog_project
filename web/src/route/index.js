import { lazy } from "react";

// layout
import { DefaultLayout } from "../component/layout";
import Auth from "../component/layout/auth";

// pages
const Home = lazy(() => import("../page/home"));
const Profile = lazy(() => import("../page/profile"));
const Category = lazy(() => import("../page/category"));
const Blog = lazy(() => import("../page/blog"));
const Login = lazy(() => import("../page/auth/login"));
const ResetPassword = lazy(() => import("../page/auth/reset_password"));
const ForgotPassword = lazy(() => import("../page/auth/forgot_password"));
const SendMailResult = lazy(() => import("../page/auth/send_mail_result"));

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
