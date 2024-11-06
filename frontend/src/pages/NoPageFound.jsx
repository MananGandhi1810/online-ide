import { CircleX } from "lucide-react";

function NoPageFound() {
    return (
        <div className="h-full-w-nav w-screen flex justify-center items-center flex-col">
            <div className="flex flex-row gap-4">
                <CircleX className="size-[40px]" />
                <span className="self-center text-xl">
                    Error 404 - Page not found
                </span>
            </div>
        </div>
    );
}

export default NoPageFound;
