import { Button } from "@/components/ui/button.jsx";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet.jsx";
import AuthContext from "@/context/auth-provider.jsx";
import { Terminal, ArrowRight, Zap } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { LogOut } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoadingBar from "react-top-loading-bar";
import NumberTicker from "@/components/ui/number-ticker";

export default function NavBar() {
    const { user, setUser } = useContext(AuthContext);
    const { state: navState } = useNavigation();
    const loaderRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (navState == "loading") {
            loaderRef.current.continuousStart();
        } else {
            loaderRef.current.complete();
        }
    }, [navState]);

    const logout = () => {
        setUser({
            id: null,
            email: null,
            name: null,
            token: null,
            isAuthenticated: false,
            point: 0,
        });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background dark:bg-background">
            <LoadingBar color="#ffffff" ref={loaderRef} />
            <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
                <div className="flex-1">
                    <Link
                        to="/"
                        className="flex items-center gap-2 justify-start w-min"
                    >
                        <Terminal /> <span className="font-medium">Code</span>
                    </Link>
                </div>
                <nav className="hidden items-center justify-center gap-6 text-sm font-medium md:flex flex-1">
                    <Link
                        to="/"
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 relative after:bg-white after:absolute after:h-0.5 after:w-0 after:-bottom-1 after:left-0 hover:after:w-full after:transition-all after:duration-300"
                    >
                        Home
                    </Link>
                    <Link
                        to="/problems"
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 relative after:bg-white after:absolute after:h-0.5 after:w-0 after:-bottom-1 after:left-0 hover:after:w-full after:transition-all after:duration-300"
                    >
                        Problems
                    </Link>
                    <Link
                        to="/leaderboard"
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 relative after:bg-white after:absolute after:h-0.5 after:w-0 after:-bottom-1 after:left-0 hover:after:w-full after:transition-all after:duration-300"
                    >
                        Leaderboard
                    </Link>
                </nav>
                <div className="flex items-center justify-end flex-1 gap-4">
                    {!user.isAuthenticated ? (
                        <div className="flex gap-4">
                            <Button variant="outline" asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button className="group" asChild>
                                <Link to="/register">
                                    Register
                                    <ArrowRight className="ml-2 z-10 group-hover:ml-3 duration-200" />
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-row items-center gap-4">
                            <div
                                className="flex flex-row gap-1 items-center group cursor-pointer"
                                onClick={() => navigate("/leaderboard")}
                            >
                                <Zap
                                    className="group-hover:fill-white duration-1000"
                                    height={20}
                                />
                                <NumberTicker value={user.points} />
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <LogOut />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Log Out?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to log out?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={logout}>
                                            Yes, log out
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
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
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/problems"
                                    className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                >
                                    Problems
                                </Link>
                                <Link
                                    to="/leaderboard"
                                    className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                >
                                    Leaderboard
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
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
