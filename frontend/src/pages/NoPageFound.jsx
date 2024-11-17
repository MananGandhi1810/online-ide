import { CircleX } from "lucide-react";

function NoPageFound() {
    return (
        <div className="h-full-w-nav w-screen flex justify-center items-center flex-col">
            <div className="flex flex-col items-center gap-6">
                <CircleX className="size-[50px]" />
                <span className="self-center text-xl">
                    Error 404 - Page not found
                </span>
            </div>
        </div>
    );
}

export default NoPageFound;
