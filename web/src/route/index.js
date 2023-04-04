import { lazy } from "react";

// layout
import DefaultLayout from "/src/component/layout/default_layout";
import Auth from "/src/component/layout/auth";

// pages
const Home = lazy(() => import("/src/page/home"));
const Profile = lazy(() => import("/src/page/profile"));
const Category = lazy(() => import("/src/page/category"));
const CategoryDetail = lazy(() => import("/src/page/category_detail"));
const Error404 = lazy(() => import("/src/page/error_404"));
const Blog = lazy(() => import("/src/page/blog"));
const BlogDetail = lazy(() => import("/src/page/blog_detail"));
const Login = lazy(() => import("/src/page/auth/login"));
const ResetPassword = lazy(() => import("/src/page/auth/reset_password"));
const ForgotPassword = lazy(() => import("/src/page/auth/forgot_password"));
const SendMailResult = lazy(() => import("/src/page/auth/send_mail_result"));

// routes
const publicRoutes = [
  { path: "/", page: Home, layout: null, require_login: false },
  {
    path: "/app/profile",
    page: Profile,
    layout: DefaultLayout,
    require_login: true,
  },
  {
    path: "/app/category/",
    page: Category,
    layout: DefaultLayout,
    require_login: true,
  },
  {
    path: "/app/category/:id",
    page: CategoryDetail,
    layout: DefaultLayout,
    require_login: true,
  },
  {
    path: "/app/blog/:id",
    page: BlogDetail,
    layout: DefaultLayout,
    require_login: true,
  },
  {
    path: "/app/blog/",
    page: Blog,
    layout: DefaultLayout,
    require_login: true,
  },
  { path: "/404", page: Error404, layout: null, require_login: false },
  { path: "/login", page: Login, layout: Auth, require_login: false },
  {
    path: "/forgot-password",
    page: ForgotPassword,
    layout: Auth,
    require_login: false,
  },
  {
    path: "/forgot-password/result",
    page: SendMailResult,
    layout: Auth,
    require_login: false,
  },
  {
    path: "/reset-password",
    page: ResetPassword,
    layout: Auth,
    require_login: false,
  },
];

export { publicRoutes };
