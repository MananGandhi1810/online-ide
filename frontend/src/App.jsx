import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import NavBar from "./components/custom/navbar";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
]);

function App() {
    return (
        <ThemeProvider defaultTheme="dark">
            <NavBar />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
