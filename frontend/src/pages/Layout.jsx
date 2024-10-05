import NavBar from "@/components/custom/NavBar";
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function Layout() {
    return (
        <div className="min-h-screen">
            <NavBar />
            <Outlet />
            <Toaster />
        </div>
    );
}

export default Layout;
