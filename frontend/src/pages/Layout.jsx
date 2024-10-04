import NavBar from "@/components/custom/NavBar";
import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
}

export default Layout;
