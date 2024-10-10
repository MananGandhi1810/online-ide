import "@/App.css";
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

var isAuthenticated = false;

function App() {
    const initialState = {
        name: null,
        email: null,
        token: null,
        isAuthenticated: false,
    };
    const [user, setUser] = useState(
        () =>
            JSON.parse(localStorage.getItem("user") ?? initialState) ||
            initialState,
    );

    const router = createBrowserRouter([
        {
            element: <Layout />,
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
            ],
        },
    ]);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
        isAuthenticated = true;
    }, [user]);

    return (
        <div className="font-inter">
            <AuthContext.Provider
                value={{
                    user,
                    setUser,
                }}
            >
                <ThemeProvider defaultTheme="dark">
                    <RouterProvider router={router} />
                </ThemeProvider>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
