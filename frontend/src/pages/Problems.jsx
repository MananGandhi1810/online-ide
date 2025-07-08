import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge.jsx";
import { Check } from "lucide-react";

function Problems() {
    const problemStatements = useLoaderData();
    const navigate = useNavigate();

    if (problemStatements == null) {
        return (
            <div className="w-screen h-full-w-nav flex justify-center align-middle items-center">
                An error occurred while fetching problem statements
            </div>
        );
    }

    return (
        <div className="w-screen flex justify-center">
            <div className="text-2xl w-[1152px] max-w-6xl flex items-center justify-center py-5 flex-col gap-5">
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
                                    key={problemStatement.id}
                                    onClick={() => {
                                        navigate(
                                            `/problem/${problemStatement.id}`,
                                        );
                                    }}
                                    className="group hover:cursor-pointer"
                                >
                                    <TableCell className="group-hover:underline underline-offset-2 decoration-green-500 overflow-ellipsis w-full max-w-[90%] flex flex-row gap-2 items-center">
                                        {problemStatement.title}
                                        {problemStatement.solved ? (
                                            <Check className="text-green-500" />
                                        ) : (
                                            <></>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                d == "Easy"
                                                    ? "bg-green-500 text-white"
                                                    : d == "Medium"
                                                      ? "bg-yellow-500 text-black"
                                                      : "bg-red-500 text-white"
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
