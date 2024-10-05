import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

function Code() {
    const problemStatement = useLoaderData();

    if (problemStatement == null) {
        return (
            <div className="w-screen h-full-w-nav flex justify-center align-middle">
                An error occurred while fetching problem statements
            </div>
        );
    }

    return (
        <div className="h-full-w-nav w-screen flex justify-center items-center">
            Code
        </div>
    );
}

export default Code;
