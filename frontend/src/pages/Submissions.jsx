import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import { Badge } from "@/components/ui/badge";
import React from "react";
import {
    Link,
    useLoaderData,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    ArrowLeftIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

function Submissions() {
    const { submissions, page } = useLoaderData();
    const navigate = useNavigate();

    console.log(submissions);
    return (
        <div className="w-screen flex justify-center">
            {submissions.length > 0 ? (
                <div className="text-2xl w-[1152px] max-w-6xl flex items-center justify-center py-5 flex-col gap-5">
                    <p>Your Submissions</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Problem</TableHead>
                                <TableHead className="w-10">Status</TableHead>
                                <TableHead className="w-32">
                                    Execution Time
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map((submission) => {
                                return (
                                    <TableRow
                                        key={submission.id}
                                        onClick={() =>
                                            navigate(
                                                `/problem/${submission.problemStatement.id}`,
                                                {
                                                    state: {
                                                        initialCodeState:
                                                            submission.code,
                                                        initialCodeLanguage:
                                                            submission.language,
                                                    },
                                                },
                                            )
                                        }
                                        className="group hover:cursor-pointer"
                                    >
                                        <TableCell className="group-hover:underline overflow-ellipsis w-full max-w-[90%] flex flex-row gap-2 items-center">
                                            {submission.problemStatement.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    submission.success
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }
                                            >
                                                {submission.success
                                                    ? "Success"
                                                    : "Failure"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {submission.execTime
                                                ? submission.execTime + " ms"
                                                : "Unknown"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <div className="flex flex-row gap-2">
                        <Button
                            disabled={page <= 1}
                            variant="outline"
                            asChild={page > 1}
                        >
                            <Link to={`/submissions?page=${page - 1}`}>
                                <ChevronLeft />
                            </Link>
                        </Button>
                        <Button
                            disabled={submissions.length == 0}
                            variant="outline"
                            asChild={submissions.length > 0}
                        >
                            <Link to={`/submissions?page=${page + 1}`}>
                                <ChevronRight />
                            </Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-2xl py-5">
                    {page == 1
                        ? "Submit your first solution and view it here"
                        : "No submissions here"}
                </p>
            )}
        </div>
    );
}

export default Submissions;
