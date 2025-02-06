import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, SquareArrowOutUpRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

function Home() {
    const codeState1 = `$ python submission.py
    Evaluating Code ......`;
    const codeState2 = `$ python submission.py
    Evaluating Code ......
    ✔ Test 1 passed
    ✔ Test 2 passed
    ✔ Test 3 passed
    ✔ Test 4 passed
    All Test Cases Passed 🎉`;
    return (
        <div className="h-full-w-nav w-full bg-background text-white flex flex-col justify-center items-center px-4">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    >
                        Master Coding Challenges
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-[600px] text-gray-400 md:text-xl"
                    >
                        Sharpen your coding skills with our vast collection of
                        programming challenges. Practice, learn, and excel in
                        your coding journey.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button className="group" asChild>
                            <Link to="/problems">
                                Start Coding
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button className="group" asChild>
                            <Link to="https://github.com/MananGandhi1810/online-ide">
                                <Star className="mr-2 group-hover:fill-black transition-colors" />
                                Star on GitHub
                                <SquareArrowOutUpRight className="ml-2 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
                <div>
                    <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full h-64 overflow-hidden border border-gray-700 group">
                        <div className="flex items-center mb-2">
                            <div className="w-3 h-3 rounded-full bg-gray-500 mr-2 group-hover:bg-red-700"></div>
                            <div className="w-3 h-3 rounded-full bg-gray-500 mr-2 group-hover:bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-gray-500 group-hover:bg-green-500"></div>
                        </div>
                        <pre className="text-green-400 font-mono text-sm">
                            <code>
                                <TypeAnimation
                                    style={{
                                        whiteSpace: "pre-line",
                                        height: "195px",
                                        display: "block",
                                    }}
                                    sequence={[codeState1, 750, codeState2]}
                                    speed={10}
                                />
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
