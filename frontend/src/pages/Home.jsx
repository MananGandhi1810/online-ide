import { Button } from "@/components/ui/button.jsx";
import { ArrowRight, SquareArrowOutUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

function Home() {
    return (
        <div className="h-full-w-nav w-screen flex justify-center items-center">
            <DotPattern
                className={cn(
                    "lg:[mask-image:radial-gradient(800px_circle_at_center,white,transparent)] md:[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                )}
            />
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <span className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none type-home-heading" />
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
                    <div className="space-4">
                        <Button className="group" asChild>
                            <Link to="https://git.new/manan-code">
                                <Star className="mr-2 size-[20px] z-10 group-hover:mr-3 duration-200 group-hover:fill-[#000000] group-hover:drop-shadow-sm" />
                                Star on GitHub
                                <SquareArrowOutUpRight className="ml-2 size-[20px] z-10 group-hover:ml-3 duration-200" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
