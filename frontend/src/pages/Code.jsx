import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

function Code() {
    const problemStatement = useLoaderData();

    console.log(problemStatement);

    return (
        <div className="h-full-w-nav w-screen flex justify-center items-center">
            Code
        </div>
    );
}

export default Code;
