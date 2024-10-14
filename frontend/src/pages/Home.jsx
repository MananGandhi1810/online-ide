import { Button } from "@/components/ui/button.jsx";
import TypingAnimation from "@/components/ui/typing-animation";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="h-full-w-nav w-screen flex justify-center items-center">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <TypingAnimation
                            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                            text="Master Coding Challenges"
                            duration={175}
                        />
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                            Sharpen your coding skills with our vast collection
                            of programming challenges. Practice, learn, and
                            excel in your coding journey.
                        </p>
                    </div>
                    <div className="space-4">
                        <Button className="group" asChild>
                            <Link to="/problems">
                                Start Coding
                                <ArrowRight className="ml-2 z-10 group-hover:ml-3 duration-200" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
