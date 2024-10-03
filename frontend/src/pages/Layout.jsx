import NavBar from "@/components/custom/navbar";
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
