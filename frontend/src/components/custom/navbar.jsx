import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Terminal, ArrowRight } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function NavBar() {
    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background dark:bg-background">
                <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2"
                        prefetch={false}
                    >
                        <Terminal /> <span className="font-medium">Code</span>
                    </Link>
                    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                        <Link
                            to="/"
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            prefetch={false}
                        >
                            Home
                        </Link>
                        <Link
                            to="/problems"
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                            prefetch={false}
                        >
                            Problems
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" asChild>
                            <Link to="/login">Login</Link>
                        </Button>
                        <Button className="group" asChild>
                            <Link to="/register">
                                Register
                                <ArrowRight className="ml-2 z-10 group-hover:ml-3 duration-200" />
                            </Link>
                        </Button>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full md:hidden"
                                >
                                    <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <span className="sr-only">
                                        Toggle navigation menu
                                    </span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="md:hidden">
                                <div className="grid gap-4 p-4">
                                    <Link
                                        to="/"
                                        className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                        prefetch={false}
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        to="/problems"
                                        className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                        prefetch={false}
                                    >
                                        Problems
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
}

function MenuIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}
