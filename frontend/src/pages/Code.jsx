import { useState, useEffect, useContext, useRef } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable.jsx";
import { Button } from "@/components/ui/button.jsx";
import Editor from "@monaco-editor/react";
import { Loader2, Play, Send, Upload } from "lucide-react";
import axios from "axios";
import AuthContext from "@/context/auth-provider.jsx";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";
import getUserPoints from "@/utils/getUserPoints";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function Code() {
    const problemStatement = useLoaderData();

    if (problemStatement == null) {
        return (
            <div className="w-screen h-full-w-nav flex justify-center align-middle items-center">
                Could not find this problem statement
            </div>
        );
    }

    const [submitting, setSubmitting] = useState(false);
    const [running, setRunning] = useState(false);
    const { id } = useParams();
    const { user, setUser } = useContext(AuthContext);
    const [language, setLanguage] = useState(
        () => localStorage.getItem("preferredLanguage") || "python",
    );
    const supportedLanguages = {
        Python: "python",
        C: "c",
        "C++": "cpp",
        Java: "java",
    };
    const [submissionResult, setSubmissionResult] = useState({
        title: "",
        description: "",
    });
    const [showDialog, setShowDialog] = useState(false);
    const [output, setOutput] = useState(null);
    const [code, setCode] = useState(
        () =>
            localStorage.getItem(`code-${language}-${problemStatement.id}`) ||
            "",
    );
    const initialCode = {
        c: "// Your code here",
        cpp: "// Your code here",
        python: "# Your code here",
        java: "// Your code here",
    };
    const [chatHistory, setChatHistory] = useState([]);
    const [aiInput, setAiInput] = useState("");
    const [currentResponse, setCurrentResponse] = useState("");

    useEffect(() => {
        if (!Object.values(supportedLanguages).includes(language)) {
            setLanguage("python");
            return;
        }
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

    const run = async (isTempRun = false) => {
        if (submitting || running) {
            return;
        }
        if (isTempRun) {
            setRunning(true);
        } else {
            setSubmitting(true);
        }
        const res = await axios
            .post(
                `${process.env.SERVER_URL}/code/${
                    isTempRun ? "run" : "submit"
                }/${id}/${language}`,
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
                if (isTempRun) {
                    setRunning(false);
                } else {
                    setSubmitting(false);
                }
            });
        if (res.success) {
            await pollForResult(res.data.submissionId, isTempRun);
        } else {
            if (isTempRun) {
                setRunning(false);
            } else {
                setSubmitting(false);
            }
            setSubmissionResult({
                title: "Error",
                description: res.message,
            });
            setShowDialog(true);
        }
    };

    useHotkeys("ctrl+'", () => run(true));
    useHotkeys("ctrl+enter", () => run(false));

    const pollForResult = async (
        submissionId,
        isTempRun = false,
        tryNo = 0,
    ) => {
        const res = await axios
            .get(
                `${process.env.SERVER_URL}/code/${
                    isTempRun ? "checkTemp" : "check"
                }/${submissionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    validateStatus: false,
                },
            )
            .then((res) => res.data);
        if (res.success) {
            if (isTempRun) {
                setRunning(false);
            } else {
                setSubmitting(false);
            }
            if (res.data.success) {
                if (!isTempRun) {
                    setSubmissionResult({
                        title: "Success",
                        description: "All testcases passed",
                    });
                    setShowDialog(true);
                    setTimeout(async () => {
                        const updatedPoints = await getUserPoints(user.token);
                        if (updatedPoints.success) {
                            setUser({
                                ...user,
                                points: updatedPoints.data.points,
                            });
                        }
                    }, 250);
                } else {
                    setOutput(res.data.logs);
                }
            } else {
                if (!isTempRun) {
                    setSubmissionResult({
                        title: "Error",
                        description: "Could not pass some or all test cases",
                    });
                    setShowDialog(true);
                } else {
                    setOutput(res.data.logs);
                }
            }
            return;
        } else if (res.data.status == "Queued") {
            if (tryNo >= 100) {
                setSubmissionResult({
                    title: "Error",
                    description: "Your code could not be executed",
                });
                setShowDialog(true);
                if (isTempRun) {
                    setRunning(false);
                } else {
                    setSubmitting(false);
                }
                return;
            }
            await new Promise((resolve) =>
                setTimeout(async () => {
                    await pollForResult(submissionId, isTempRun, tryNo + 1);
                    resolve();
                }, 400),
            );
        } else {
            if (isTempRun) {
                setRunning(false);
            } else {
                setSubmitting(false);
            }
            setShowDialog(true);
            setSubmissionResult({
                title: "Error",
                description: res.message,
            });
        }
    };

    const setupMonacoTheme = (monaco) => {
        monaco.languages.register({ id: "theme" });

        (async function () {
            const highlighter = await createHighlighter({
                themes: ["vitesse-dark"],
                langs: Object.values(supportedLanguages),
            });

            shikiToMonaco(highlighter, monaco);
        })();
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) {
            return;
        }
        const newMessage = {
            content: aiInput.trim(),
            role: "user",
        };
        setChatHistory([...chatHistory, newMessage]);
        setAiInput("");
        try {
            fetch(`${process.env.SERVER_URL}/code/ai/${id}/${language}`, {
                method: "POST",
                body: JSON.stringify({
                    code,
                    prompt: aiInput,
                    history: chatHistory,
                }),
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    var res = "";

                    function read() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                setChatHistory((currentHistory) => [
                                    ...currentHistory,
                                    {
                                        role: "assistant",
                                        content: res,
                                    },
                                ]);
                                setCurrentResponse("");
                                return;
                            }

                            const chunk = decoder.decode(value);
                            setCurrentResponse((response) => response + chunk);
                            res += chunk;

                            read();
                        });
                    }

                    read(); // Start reading
                })
                .catch((error) => {
                    console.error("Error fetching or reading stream:", error);
                });
        } catch (e) {}
    };

    return (
        <div className="w-screen h-full-w-nav">
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {submissionResult.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {submissionResult.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <ResizablePanelGroup
                direction="horizontal"
                className="border h-full w-full"
            >
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup
                        direction="vertical"
                        className="border h-full w-full"
                    >
                        <ResizablePanel defaultSize={100}>
                            <Tabs defaultValue="problem-statement">
                                <TabsList>
                                    <TabsTrigger
                                        value="problem-statement"
                                        className="m-0.5"
                                    >
                                        Problem Statement
                                    </TabsTrigger>
                                    <TabsTrigger value="ai" className="m-0.5">
                                        Ask AI
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="problem-statement">
                                    <ScrollArea className="flex h-full w-full flex-col gap-5 pb-14">
                                        <Markdown className="prose dark:prose-invert min-w-full p-6">
                                            {problemStatement.description}
                                        </Markdown>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="ai">
                                    <div className="flex h-full-w-nav-w-tab w-full flex-col">
                                        <ScrollArea className="h-full-w-nav-w-tab flex flex-col p-6 py-0 overflow-auto">
                                            {chatHistory.map(
                                                (message, index, row) => (
                                                    <div
                                                        key={() =>
                                                            new Date().toISOString()
                                                        }
                                                        className={`mb-4 p-3 rounded-lg ${
                                                            message.role ===
                                                            "user"
                                                                ? "bg-primary text-primary-foreground ml-auto"
                                                                : "bg-muted mr-auto"
                                                        } max-w-[80%] w-fit text-wrap break-keep`}
                                                    >
                                                        {message.role ==
                                                        "assistant" ? (
                                                            <Markdown className="prose dark:prose-invert min-w-full max-w-full w-full">
                                                                {
                                                                    message.content
                                                                }
                                                            </Markdown>
                                                        ) : (
                                                            <p>
                                                                {
                                                                    message.content
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                            {currentResponse.trim() != "" && (
                                                <div
                                                    key={() => Date()}
                                                    className="mb-4 p-3 rounded-lg bg-muted mr-auto max-w-[80%] w-fit text-wrap break-keep"
                                                >
                                                    <Markdown className="prose dark:prose-invert min-w-full max-w-full w-full">
                                                        {currentResponse}
                                                    </Markdown>
                                                </div>
                                            )}
                                        </ScrollArea>
                                        <form
                                            onSubmit={handleSendMessage}
                                            className="flex w-full items-end space-x-2 p-6 pt-0"
                                        >
                                            <Textarea
                                                value={aiInput}
                                                onChange={(e) =>
                                                    setAiInput(e.target.value)
                                                }
                                                placeholder="Type your message here..."
                                                className="flex-1"
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" &&
                                                        !e.shiftKey
                                                    ) {
                                                        e.preventDefault();
                                                        handleSendMessage(e);
                                                    }
                                                }}
                                            />
                                            <Button type="submit" size="icon">
                                                <Send className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Send message
                                                </span>
                                            </Button>
                                        </form>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </ResizablePanel>
                        <ResizableHandle
                            withHandle
                            className={output == null ? "hidden" : ""}
                        />
                        {output != null ? (
                            <ResizablePanel defaultSize={50}>
                                <ScrollArea className="flex h-full flex-col gap-5">
                                    {running ? (
                                        <div className="flex justify-center w-full min-h-full items-center">
                                            <Loader2 className="mr-2 min-h-full w-4 animate-spin" />
                                            Running
                                        </div>
                                    ) : (
                                        <div className="p-6">
                                            <p className="text-2xl">
                                                Code Output
                                            </p>
                                            {output.map((o, i) => (
                                                <div>
                                                    <p className="mt-3 text-lg">
                                                        Test Case {i + 1}
                                                    </p>
                                                    <div className="bg-code p-2 my-3 rounded font-mono">
                                                        {o
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
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </ResizablePanel>
                        ) : (
                            <div />
                        )}
                    </ResizablePanelGroup>
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
                                            <SelectItem value="java">
                                                Java
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {running ? (
                                        <Button
                                            disabled
                                            className="z-10 self-end"
                                        >
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Running
                                        </Button>
                                    ) : (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button
                                                        onClick={() =>
                                                            run(true)
                                                        }
                                                        className="z-10 self-end"
                                                    >
                                                        <Play className="mr-2 h-4 w-4" />
                                                        Run
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ctrl + '</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                    {submitting ? (
                                        <Button
                                            disabled
                                            className="z-10 self-end"
                                        >
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting
                                        </Button>
                                    ) : (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Button
                                                        onClick={() =>
                                                            run(false)
                                                        }
                                                        className="z-10 self-end"
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Submit
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ctrl + Enter</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                                <div className="h-full">
                                    <Editor
                                        theme="vitesse-dark"
                                        language={language}
                                        defaultValue={initialCode[language]}
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                        beforeMount={setupMonacoTheme}
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
                                                <p className="mt-3 text-lg">
                                                    Test Case {i + 1}
                                                </p>
                                                <div className="my-1">
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
