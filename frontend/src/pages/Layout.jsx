import NavBar from "@/components/custom/NavBar";
import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div className="min-h-screen">
            <NavBar />
            <Outlet />
        </div>
    );
}

export default Layout;
