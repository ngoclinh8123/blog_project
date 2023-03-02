// layout
import { DefaultLayout } from "../components/layouts";
import Auth from "../components/layouts/auth";

// pages
import Home from "../pages/home";
import Profile from "../pages/profile";
import Category from "../pages/category";
import Blog from "../pages/blog";
import Login from "../pages/auth/login";
import ResetPassword from "../pages/auth/reset_password";
import ForgotPassword from "../pages/auth/forgot_password";
import SendMailResult from "../pages/auth/send_mail_result";

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
