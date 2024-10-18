import React, { useContext } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import { useLoaderData } from "react-router-dom";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AuthContext from "@/context/auth-provider";

function Leaderboard() {
    const leaderboard = useLoaderData();
    const { user: currentUser } = useContext(AuthContext);
    console.log(currentUser);

    if (leaderboard == null) {
        return (
            <div className="w-screen h-full-w-nav flex justify-center align-middle items-center">
                An error occurred while fetching leaderboard
            </div>
        );
    }

    if (leaderboard.length == 0) {
        return (
            <div className="w-screen h-full-w-nav flex justify-center align-middle items-center">
                No users found
            </div>
        );
    }

    return (
        <div className="w-screen flex justify-center">
            <div className="text-2xl w-[1152] max-w-6xl flex items-center justify-center pt-5 flex-col gap-5">
                <p>Leaderboard</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead className="w-28">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboard.map((user) => {
                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="overflow-ellipsis w-full max-w-[90%] flex flex-row gap-2 items-center">
                                        {user.name}
                                        {user.id == currentUser.id ? (
                                            <Badge>You</Badge>
                                        ) : (
                                            <div />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row gap-1 items-center">
                                            <Zap height={20} />
                                            {user.points}
                                        </div>
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

export default Leaderboard;
