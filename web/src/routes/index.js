// layout
import { DefaultLayout } from "../components/Layouts";
import Auth from "../components/Layouts/Auth";

// pages
import Home from "../pages/Home"
import Profile from "../pages/Profile"
import Category from "../pages/Category"
import Blog from "../pages/Blog"
import Login from "../pages/auth/Login"
import ResetPassword from "../pages/auth/ResetPassword"
import ForgotPassword from "../pages/auth/ForgotPassword";
import SendMailResult from "../pages/auth/SendMailResult";

// routes
const publicRoutes =[
    {path:"/",page:Home,layout:DefaultLayout},
    {path:"/profile",page:Profile,layout:DefaultLayout},
    {path:"/category",page:Category,layout:DefaultLayout},
    {path:"/blog",page:Blog,layout:DefaultLayout},
    {path:"/login",page:Login,layout:Auth},
    {path:"/forgot-password",page:ForgotPassword,layout:Auth},
    {path:"/forgot-password/result",page:SendMailResult,layout:Auth},
    {path:"/reset-password",page:ResetPassword,layout:Auth},
]

export {publicRoutes}