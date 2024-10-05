import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import {
    BrowserRouter,
    createBrowserRouter,
    Outlet,
    RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Problems from "./pages/problems";
import AuthContext from "./context/auth-provider";
import { useEffect, useState } from "react";

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
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/problems",
                element: <Problems />,
            },
        ],
    },
]);

function App() {
    const [user, setUser] = useState({
        name: undefined,
        email: undefined,
        token: undefined,
        isAuthenticated: false,
    });

    useEffect(() => {
        console.log(user, "updated");
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
