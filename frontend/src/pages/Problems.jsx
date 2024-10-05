import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

function Problems() {
    const problemStatements = useLoaderData();
    const navigate = useNavigate();

    if (problemStatements == null) {
        return (
            <div className="w-screen h-full-w-nav flex justify-center align-middle">
                An error occurred while fetching problem statements
            </div>
        );
    }

    return (
        <div className="w-screen flex justify-center">
            <div className="text-2xl w-[1152] max-w-6xl flex items-center justify-center pt-5 flex-col gap-5">
                <p>Problem Statements</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Problem</TableHead>
                            <TableHead className="w-28">Difficulty</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {problemStatements.map((problemStatement) => {
                            const d = problemStatement.difficulty;
                            return (
                                <TableRow
                                    onClick={() =>
                                        navigate(
                                            `/problem/${problemStatement.id}`,
                                        )
                                    }
                                    className="group hover:cursor-pointer"
                                >
                                    <TableCell className="group-hover:underline">
                                        {problemStatement.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                d == "Easy"
                                                    ? "bg-green-500"
                                                    : d == "Medium"
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                            }
                                        >
                                            {problemStatement.difficulty}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default Problems;
