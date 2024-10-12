import NavBar from "@/components/custom/NavBar.jsx";
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster.jsx";

function Layout() {
    return (
        <div className="min-h-full">
            <main>
                <NavBar />
                <Outlet />
            </main>
            <Toaster />
        </div>
    );
}

export default Layout;
