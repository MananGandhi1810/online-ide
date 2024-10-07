import { useState, useEffect, useContext } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import AuthContext from "@/context/auth-provider";
import { toast } from "@/hooks/use-toast";

function Code() {
    const problemStatement = useLoaderData();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("# Your Code Goes Here");
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const submit = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        const res = await axios
            .post(
                `${process.env.SERVER_URL}/code/submit/${id}/python`,
                { code },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            )
            .then((res) => res.data)
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
        if (res.success) {
            pollForResult(res.data.submissionId);
        } else {
            setLoading(false);
            toast({
                title: "Error",
                description: res.message,
            });
        }
    };

    const pollForResult = async (submissionId, tryNo = 0) => {
        const res = await axios
            .get(`${process.env.SERVER_URL}/code/check/${submissionId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((res) => res.data);
        if (res.success) {
            setLoading(false);
            if (res.data.success) {
                toast({
                    title: "Success",
                    description: "All testcases passed",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Could not pass some or all test cases",
                });
            }
            return;
        } else if (res.data.status == "Queued") {
            if (tryNo >= 100) {
                toast({
                    title: "Error",
                    description: "Your code could not be executed",
                });
                setLoading(false);
            }
            await new Promise((resolve) => setTimeout(resolve, 150));
            await pollForResult(submissionId, tryNo + 1);
        } else {
            setLoading(false);
            toast({
                title: "Error",
                description: res.message,
            });
        }
    };

    if (problemStatement == null) {
        return (
            <div className="w-screen h-full-w-nav flex justify-center align-middle">
                An error occurred while fetching problem statement
            </div>
        );
    }

    return (
        <div className="w-screen h-full-w-nav ">
            <ResizablePanelGroup
                direction="horizontal"
                className="rounded-lg border h-full w-full"
            >
                <ResizablePanel defaultSize={50}>
                    <div className="flex h-full p-6 flex-col gap-5">
                        <span className="font-semibold text-xl">
                            {problemStatement.title}
                        </span>
                        <span className="font-medium">
                            {problemStatement.description}
                        </span>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={50}>
                            <div className="z-0 relative flex h-full">
                                <Editor
                                    theme="vs-dark"
                                    defaultLanguage="python"
                                    value={code}
                                    onChange={(value) => setCode(value)}
                                />
                                {loading ? (
                                    <Button
                                        disabled
                                        className="z-10 absolute self-end m-2"
                                    >
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Running
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={submit}
                                        className="z-10 absolute self-end m-2"
                                    >
                                        Run
                                    </Button>
                                )}
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={50}>
                            <div className="flex h-full items-center justify-center p-6">
                                <span className="font-semibold">TestCases</span>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

export default Code;
