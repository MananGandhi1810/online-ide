import { useState, useEffect, useContext } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable.jsx";
import { Button } from "@/components/ui/button.jsx";
import Editor from "@monaco-editor/react";
import { Loader2, Play } from "lucide-react";
import axios from "axios";
import AuthContext from "@/context/auth-provider.jsx";
import { toast } from "@/hooks/use-toast.js";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";
import { useHotkeys } from "react-hotkeys-hook";
import Markdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { Separator } from "@/components/ui/separator.jsx";

function Code() {
    const problemStatement = useLoaderData();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [language, setLanguage] = useState(
        () => localStorage.getItem("preferredLanguage") || "python",
    );
    const [code, setCode] = useState(
        () =>
            localStorage.getItem(`code-${language}-${problemStatement.id}`) ||
            "",
    );
    const initialCode = {
        c: "// Your code here",
        cpp: "// Your code here",
        python: "# Your code here",
    };

    useEffect(() => {
        console.log(language);
        localStorage.setItem("preferredLanguage", language);
        setCode(
            () =>
                localStorage.getItem(
                    `code-${language}-${problemStatement.id}`,
                ) || initialCode[language],
        );
    }, [language]);

    useEffect(() => {
        localStorage.setItem(`code-${language}-${problemStatement.id}`, code);
    }, [code]);

    const submit = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        const res = await axios
            .post(
                `${process.env.SERVER_URL}/code/submit/${id}/${language}`,
                { code },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    validateStatus: false,
                },
            )
            .then((res) => res.data)
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
        if (res.success) {
            await pollForResult(res.data.submissionId);
        } else {
            setLoading(false);
            toast({
                title: "Error",
                description: res.message,
            });
        }
    };

    useHotkeys("ctrl+enter", submit);

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
                return;
            }
            await new Promise((resolve) =>
                setTimeout(async () => {
                    await pollForResult(submissionId, tryNo + 1);
                    resolve();
                }, 250),
            );
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
        <div className="w-screen h-full-w-nav">
            <ResizablePanelGroup
                direction="horizontal"
                className="rounded-lg border h-full w-full"
            >
                <ResizablePanel defaultSize={50}>
                    <ScrollArea className="flex h-full flex-col gap-5">
                        <Markdown className="prose dark:prose-invert p-6">
                            {problemStatement.description}
                        </Markdown>
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={50}>
                            <div className="z-0 flex flex-col h-full">
                                <div className="flex flex-row gap-2 m-1">
                                    <Select
                                        onValueChange={(e) => setLanguage(e)}
                                        value={language}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="python">
                                                Python
                                            </SelectItem>
                                            <SelectItem value="c">C</SelectItem>
                                            <SelectItem value="cpp">
                                                C++
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {loading ? (
                                        <Button
                                            disabled
                                            className="z-10 self-end"
                                        >
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Running
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={submit}
                                            className="z-10 self-end"
                                        >
                                            <Play className="mr-2 h-4 w-4" />
                                            Run
                                        </Button>
                                    )}
                                </div>
                                <div className="h-full">
                                    <Editor
                                        theme="vs-dark"
                                        language={language}
                                        defaultValue={initialCode[language]}
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                    />
                                </div>
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={50}>
                            <ScrollArea className="h-full items-center justify-center">
                                <div className="p-6">
                                    <p className="text-2xl">
                                        Sample Test Cases
                                    </p>
                                    {problemStatement.testCase.map(
                                        (testCase, i) => (
                                            <div key={testCase.id}>
                                                <div className="my-3">
                                                    Input
                                                    <div className="bg-code p-2 my-2 rounded font-mono">
                                                        {testCase.input
                                                            .split("\n")
                                                            .map((line) => (
                                                                <div key={line}>
                                                                    <p>
                                                                        {line}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                    </div>
                                                    Output
                                                    <div className="bg-code p-2 my-2 rounded font-mono">
                                                        {testCase.output
                                                            .split("\n")
                                                            .map((line) => (
                                                                <div key={line}>
                                                                    <p>
                                                                        {line}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                                {i !=
                                                problemStatement.testCase
                                                    .length -
                                                    1 ? (
                                                    <Separator className="mt-6" />
                                                ) : (
                                                    <div />
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </ScrollArea>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

export default Code;
