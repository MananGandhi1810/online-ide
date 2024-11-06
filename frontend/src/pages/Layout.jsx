import NavBar from "@/components/custom/NavBar.jsx";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster.jsx";
import { ScrollArea } from "@/components/ui/scroll-area";

function Layout() {
    return (
        <ScrollArea className="min-h-full">
            <main>
                <NavBar />
                <Outlet />
            </main>
            <Toaster />
        </ScrollArea>
    );
}

export default Layout;
