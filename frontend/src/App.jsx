import { ThemeProvider } from "@/components/theme-provider.jsx";
import {
    createBrowserRouter,
    redirect,
    RouterProvider,
} from "react-router-dom";
import Home from "@/pages/Home.jsx";
import Layout from "@/pages/Layout.jsx";
import Login from "@/pages/Login.jsx";
import Register from "@/pages/Register.jsx";
import Code from "@/pages/Code.jsx";
import Problems from "@/pages/Problems.jsx";
import AuthContext from "@/context/auth-provider.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import getUserPoints from "./utils/getUserPoints";
import Leaderboard from "./pages/Leaderboard";
import NoPageFound from "./pages/404";
import UserData from "./pages/UserData";
import { useToast } from "./hooks/use-toast";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import "@fontsource/bricolage-grotesque";
import "@fontsource/cascadia-code";
import Submissions from "./pages/Submissions";

const options = {
    api_host: process.env.POSTHOG_HOST,
};

function App() {
    const initialState = {
        id: null,
        name: null,
        email: null,
        token: null,
        points: 0,
        isAuthenticated: false,
    };
    const { toast } = useToast();
    const [user, setUser] = useState(
        () =>
            JSON.parse(
                localStorage.getItem("user") ?? JSON.stringify(initialState),
            ) || initialState,
    );

    const fetchUserData = async () => {
        if (!user.isAuthenticated) {
            return;
        }
        const res = await axios
            .get(`${process.env.SERVER_URL}/user`, {
                headers: {
                    authorization: `Bearer ${user.token}`,
                },
                validateStatus: false,
            })
            .then((res) => res.data);
        if (!res.success) {
            setUser(initialState);
            return;
        }
        setUser({
            ...user,
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            points: res.data.points,
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const router = createBrowserRouter([
        {
            element: <Layout />,
            errorElement: (
                <p className="w-screen h-full-w-nav flex justify-center align-middle items-center">
                    Something went wrong
                </p>
            ),
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "/login",
                    loader: ({ request }) => {
                        const searchParams = new URL(request.url).searchParams;
                        if (user.isAuthenticated) {
                            return redirect(searchParams.get("next") || "/");
                        }
                        return null;
                    },
                    element: <Login />,
                },
                {
                    path: "/register",
                    loader: ({ request }) => {
                        const searchParams = new URL(request.url).searchParams;
                        if (user.isAuthenticated) {
                            return redirect(searchParams.get("next") || "/");
                        }
                        return null;
                    },
                    element: <Register />,
                },
                {
                    path: "/forgot-password",
                    loader: ({ request }) => {
                        const searchParams = new URL(request.url).searchParams;
                        if (user.isAuthenticated) {
                            return redirect(searchParams.get("next") || "/");
                        }
                        return null;
                    },
                    element: <ForgotPassword />,
                },
                {
                    path: "/verify-otp",
                    loader: ({ request }) => {
                        const searchParams = new URL(request.url).searchParams;
                        if (user.isAuthenticated) {
                            return redirect(searchParams.get("next") || "/");
                        }
                        return null;
                    },
                    element: <VerifyOtp />,
                },
                {
                    path: "/reset-password",
                    loader: ({ request }) => {
                        const searchParams = new URL(request.url).searchParams;
                        if (user.isAuthenticated) {
                            return redirect(searchParams.get("next") || "/");
                        }
                        return null;
                    },
                    element: <ResetPassword />,
                },
                {
                    path: "/problems",
                    loader: async () => {
                        if (!user.isAuthenticated) {
                            return redirect("/login?next=/problems");
                        }
                        var res;
                        try {
                            res = await axios
                                .get(
                                    `${process.env.SERVER_URL}/problem-statement/all`,
                                    {
                                        validateStatus: false,
                                        headers: {
                                            authorization: `Bearer ${user.token}`,
                                        },
                                    },
                                )
                                .then((res) => res.data);
                        } catch (e) {
                            return null;
                        }
                        if (!res.success) {
                            return null;
                        }
                        return res.data.problemStatements;
                    },
                    element: <Problems />,
                },
                {
                    path: "/leaderboard",
                    loader: async () => {
                        var res;
                        try {
                            res = await axios
                                .get(`${process.env.SERVER_URL}/leaderboard`, {
                                    headers: {
                                        Authorization:
                                            user.token != null ||
                                            user.token != undefined
                                                ? `Bearer ${user.token}`
                                                : "",
                                    },
                                    validateStatus: false,
                                })
                                .then((res) => res.data);
                        } catch (e) {
                            return null;
                        }
                        if (!res.success) {
                            return null;
                        }
                        return res.data.leaderboard;
                    },
                    element: <Leaderboard />,
                },
                {
                    path: "/problem/:id",
                    loader: async ({ params: { id } }) => {
                        if (!user.isAuthenticated) {
                            return redirect(`/login?next=/problem/${id}`);
                        }
                        var res;
                        try {
                            res = await axios
                                .get(
                                    `${process.env.SERVER_URL}/problem-statement/${id}`,
                                    {
                                        validateStatus: false,
                                        headers: {
                                            authorization: `Bearer ${user.token}`,
                                        },
                                    },
                                )
                                .then((res) => res.data);
                        } catch (e) {
                            return null;
                        }
                        if (!res.success) {
                            return null;
                        }
                        return res.data.problemStatement;
                    },
                    element: <Code />,
                },
                {
                    path: "/user/:id",
                    loader: async ({ params: { id } }) => {
                        var res;
                        try {
                            res = await axios
                                .get(`${process.env.SERVER_URL}/user/${id}`, {
                                    validateStatus: false,
                                })
                                .then((res) => res.data);
                        } catch (e) {
                            return null;
                        }
                        if (!res.success) {
                            return null;
                        }
                        return res.data.user;
                    },
                    element: <UserData />,
                },
                {
                    path: "/submissions",
                    loader: async ({ request }) => {
                        if (!user.isAuthenticated) {
                            return redirect("/login?next=/submissions");
                        }
                        const page = new URL(request.url).searchParams.get(
                            "page",
                        );
                        var res;
                        try {
                            res = await axios
                                .get(
                                    `${
                                        process.env.SERVER_URL
                                    }/user/submissions${
                                        page ? "?page=" + page : ""
                                    }`,
                                    {
                                        validateStatus: false,
                                        headers: {
                                            authorization: `Bearer ${user.token}`,
                                        },
                                    },
                                )
                                .then((res) => res.data);
                        } catch (e) {
                            return null;
                        }
                        if (!res.success) {
                            return null;
                        }
                        return {
                            page: parseInt(page) ?? 1,
                            submissions: res.data.submissions,
                        };
                    },
                    element: <Submissions />,
                },
                {
                    path: "/gh-callback",
                    loader: async ({ request }) => {
                        var res;
                        const requestToken = new URL(
                            request.url,
                        ).searchParams.get("requestToken");
                        if (!requestToken) {
                            return null;
                        }
                        try {
                            res = await axios
                                .get(
                                    `${process.env.SERVER_URL}/auth/accessToken`,
                                    {
                                        headers: {
                                            authorization: `Bearer ${requestToken}`,
                                        },
                                        validateStatus: false,
                                    },
                                )
                                .then((res) => res.data);
                        } catch (e) {
                            return null;
                        }
                        if (!res.success) {
                            return null;
                        }
                        setUser((prevUser) => {
                            return {
                                ...prevUser,
                                token: res.data.accessToken,
                                isAuthenticated: true,
                            };
                        });
                        return redirect("/");
                    },
                    element: <Home />,
                },
                {
                    path: "gh-callback-error",
                    loader: async ({ request }) => {
                        const error = new URL(request.url).searchParams.get(
                            "error",
                        );
                        toast({
                            title: "An Error Occurred",
                            description: error,
                        });
                        return redirect("/login");
                    },
                    element: <Login />,
                },
                {
                    path: "*",
                    element: <NoPageFound />,
                },
            ],
        },
    ]);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
        if (user.isAuthenticated) {
            posthog.identify(user.id, user);
        } else {
            posthog.reset();
        }
    }, [user]);

    useEffect(() => {
        fetchUserData();
        getUserPoints(user.token).then((res) => {
            if (!res) return;
            setUser({ ...user, points: res.success ? res.data.points : 0 });
        });
    }, [user.isAuthenticated, user.token]);

    useEffect(() => {
        getUserPoints(user.token).then((res) => {
            if (!res) return;
            setUser({ ...user, points: res.success ? res.data.points : 0 });
        });
    }, [user.points]);

    return (
        <div className="overflow-x-hidden">
            <AuthContext.Provider
                value={{
                    user,
                    setUser,
                }}
            >
                <PostHogProvider
                    apiKey={process.env.POSTHOG_KEY}
                    options={options}
                >
                    <ThemeProvider defaultTheme="dark">
                        <RouterProvider router={router} />
                    </ThemeProvider>
                </PostHogProvider>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
