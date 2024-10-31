import React, { useCallback, useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { ArrowLeft, Edit } from "lucide-react";
import Markdown from "react-markdown";
import { Button } from "../ui/button";

function Editorials({
    editorials,
    selectedEditorialId,
    setSelectedEditorialId,
}) {
    if (editorials.length == 0) {
        return (
            <div className="flex h-full-w-nav-w-tab w-full justify-center items-center flex-col gap-2">
                No Editorials Found
            </div>
        );
    }

    const formatter = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    const [selectedEditorial, setSelectedEditorial] = useState(null);

    useEffect(() => {
        setSelectedEditorial(
            editorials.find((editorial) => editorial.id == selectedEditorialId),
        );
    }, [selectedEditorialId]);

    if (selectedEditorialId != "") {
        console.log(selectedEditorial);
        if (selectedEditorial == undefined) {
            return (
                <div className="flex h-full-w-nav-w-tab w-full justify-center items-center flex-col gap-2">
                    Could not load editorial
                    <div
                        className="flex flex-row gap-2 cursor-pointer hover:underline pt-2 w-fit"
                        onClick={() => {
                            setSelectedEditorialId("");
                            setSelectedEditorial(null);
                        }}
                    >
                        <ArrowLeft /> View Other Editorials
                    </div>
                </div>
            );
        }

        return (
            <div className="flex h-full-w-nav-w-tab w-full flex-col">
                <ScrollArea className="h-full-w-nav-w-tab flex flex-col p-6 py-0 overflow-auto">
                    <div
                        className="flex flex-row gap-2 cursor-pointer hover:underline pt-2 w-fit"
                        onClick={() => setSelectedEditorialId("")}
                    >
                        <ArrowLeft /> View Other Editorials
                    </div>
                    <p className="text-2xl font-bold pt-4">
                        {selectedEditorial.title}
                    </p>
                    <Markdown>{selectedEditorial.content}</Markdown>
                </ScrollArea>
            </div>
        );
    }

    return (
        <div className="flex h-full-w-nav-w-tab w-full flex-col">
            <ScrollArea className="h-full-w-nav-w-tab flex flex-col p-6 py-0 overflow-auto">
                <Button
                    variant="outline"
                    className="py-2 flex flex-row gap-2 m-2"
                >
                    <Edit />
                    Write an editorial
                </Button>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Editorial</TableHead>
                            <TableHead className="w-32">Written On</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {editorials.map((editorial) => {
                            const date = new Date(editorial.createdAt);
                            const formattedDate = formatter.format(date);

                            return (
                                <TableRow
                                    key={editorial.id}
                                    className="group hover:cursor-pointer"
                                    onClick={() =>
                                        setSelectedEditorialId(
                                            `${editorial.id}`,
                                        )
                                    }
                                >
                                    <TableCell className="overflow-ellipsis overflow-hidden w-full flex flex-col items-start justify-items-center">
                                        <p className="text-lg group-hover:underline">
                                            {editorial.title}
                                        </p>
                                        <p className="text-md">
                                            By {editorial.user.name}
                                        </p>
                                    </TableCell>
                                    <TableCell>{formattedDate}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}

export default Editorials;
