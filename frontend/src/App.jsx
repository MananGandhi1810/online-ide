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
    return (
        <div className="font-inter">
            <ThemeProvider defaultTheme="dark">
                <RouterProvider router={router} />
            </ThemeProvider>
        </div>
    );
}

export default App;
