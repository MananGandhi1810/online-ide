import { useState, useEffect, useContext, useRef } from "react";
import { useLoaderData, useLocation, useParams } from "react-router-dom";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable.jsx";
import { Button } from "@/components/ui/button.jsx";
import Editor from "@monaco-editor/react";
import {
    CornerUpRight,
    Edit,
    Loader2,
    Play,
    SendHorizontal,
    X,
} from "lucide-react";
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
import AIChat from "@/components/custom/AIChat";
import Editorials from "@/components/custom/Editorials";
import EditorialEditor from "@/components/custom/EditorialEditor";
import htmlToMarkdown from "@wcj/html-to-markdown";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import posthog from "posthog-js";

function Code() {
    const problemStatement = useLoaderData();

    if (problemStatement == null) {
        return (
            <div className="w-screen h-full-w-nav flex justify-center align-middle items-center">
                Could not find this problem statement
            </div>
        );
    }

    const location = useLocation();
    const { initialCodeState, initialCodeLanguage } = location.state ?? {};
    const [submitting, setSubmitting] = useState(false);
    const [running, setRunning] = useState(false);
    const { id } = useParams();
    const { user, setUser } = useContext(AuthContext);
    const [language, setLanguage] = useState(
        () =>
            initialCodeLanguage ||
            localStorage.getItem("preferredLanguage") ||
            "python",
    );
    const supportedLanguages = {
        Python: "python",
        C: "c",
        "C++": "cpp",
        Java: "java",
    };
    const [dialogData, setDialogData] = useState({
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

    const getStarterCode = (lang) => {
        const starterCodeEntry = problemStatement.starterCode?.find(
            (sc) => sc.language === lang,
        );
        if (starterCodeEntry && starterCodeEntry.code) {
            return starterCodeEntry.code;
        }

        const defaultCode = {
            python: "# Your code here",
            c: "// Your code here",
            cpp: "// Your code here",
            java: "// Your code here",
        };
        return defaultCode[lang] || "// Your code here";
    };

    const [chatHistory, setChatHistory] = useState([]);
    const [aiInput, setAiInput] = useState("");
    const [currentResponse, setCurrentResponse] = useState("");
    const [tabValue, setTabValue] = useState("testcases");
    const [editorials, setEditorials] = useState([]);
    const [selectedEditorial, setSelectedEditorial] = useState({ id: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editorialTitle, setEditorialTitle] = useState("");
    const [editorialContent, setEditorialContent] = useState("");
    const [isSubmittingEditorial, setIsSubmittingEditorial] = useState(false);
    const [customTestcase, setCustomTestcase] = useState("");
    const { toast } = useToast();
    const time = useRef(new Date().getTime());
    const keystrokeTimings = useRef([]);
    const [disableChat, setDisableChat] = useState(false);

    useEffect(() => {
        getEditorials();
        posthog.capture("problem-statement-view", {
            problemStatement: problemStatement.id,
            defaultLanguage: language,
        });
    }, []);

    useEffect(() => {
        if (!Object.values(supportedLanguages).includes(language)) {
            setLanguage("python");
            return;
        }
        localStorage.setItem("preferredLanguage", language);
        setCode(
            () =>
                (initialCodeLanguage == language ? initialCodeState : null) ||
                localStorage.getItem(
                    `code-${language}-${problemStatement.id}`,
                ) ||
                getStarterCode(language),
        );
    }, [language]);

    useEffect(() => {
        localStorage.setItem(`code-${language}-${problemStatement.id}`, code);
        keystrokeTimings.current = [
            ...keystrokeTimings.current,
            new Date().getTime() - time.current,
        ];
        time.current = new Date().getTime();
    }, [code]);

    const run = async (isTempRun = false) => {
        posthog.capture(isTempRun ? "run" : "submit", {
            language,
            problemStatement: problemStatement.id,
        });
        if (submitting || running) {
            return;
        }
        if (isTempRun) {
            setRunning(true);
        } else {
            setSubmitting(true);
        }
        if (isTempRun) {
            toast({
                title: "Running",
                description:
                    isTempRun &&
                    (tabValue == "custom-testcase" || tabValue == "output")
                        ? "Running with custom testcase"
                        : "Running with sample testcase",
            });
        } else {
            toast({
                title: "Submitting",
                description: "Evaluating your code",
            });
        }
        const res = await axios
            .post(
                `${process.env.SERVER_URL}/code/${
                    isTempRun ? "run" : "submit"
                }/${id}/${language}`,
                isTempRun &&
                    (tabValue == "custom-testcase" || tabValue == "output")
                    ? {
                          code,
                          customTestcase,
                          keystrokeTimings: keystrokeTimings.current,
                      }
                    : {
                          code,
                          keystrokeTimings: keystrokeTimings.current,
                      },
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
            setDialogData({
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
                    setDialogData({
                        title: "Success",
                        description: `All testcases passed. Executed in ${res.data.execTime}ms`,
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
                    setDialogData({
                        title: "Error",
                        description: `${res.data.passedTestCases}/${res.data.totalTestCases} test cases passed. Try again!`,
                    });
                    setShowDialog(true);
                } else {
                    setOutput(res.data.logs);
                }
            }
            return;
        } else if (res.data.status == "Queued") {
            if (tryNo >= 100) {
                setDialogData({
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
            setDialogData({
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

    useEffect(() => {
        if (output == "" || output == null) {
            return;
        }
        setTabValue("output");
    }, [output]);

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
        setDisableChat(true);
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
                                posthog.capture("ai-message", {
                                    messages: chatHistory,
                                });
                                setCurrentResponse("");
                                setDisableChat(false);
                                return;
                            }

                            const chunk = decoder.decode(value);
                            setCurrentResponse((response) => response + chunk);
                            res += chunk;

                            read();
                        });
                    }
                    read();
                })
                .catch((error) => {
                    console.error("Error fetching or reading stream:", error);
                });
        } catch (e) {}
    };

    const getEditorials = async () => {
        const res = await axios
            .get(`${process.env.SERVER_URL}/editorial/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                validateStatus: false,
            })
            .then((res) => res.data);
        if (!res.success) {
            return;
        }
        setEditorials(res.data.editorials);
    };

    const submitEditorial = async () => {
        setIsSubmittingEditorial(true);
        const res = await axios
            .post(
                `${process.env.SERVER_URL}/editorial/${id}/new`,
                {
                    title: editorialTitle,
                    content: await htmlToMarkdown({ html: editorialContent }),
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    validateStatus: false,
                },
            )
            .then((res) => res.data);
        setIsSubmittingEditorial(false);
        if (!res.success) {
            toast({
                title: "An error occurred",
                description: res.message,
            });
            return;
        }
        setSelectedEditorial({ id: "" });
        setIsEditing(false);
        setEditorialTitle("");
        setEditorialContent("");
        getEditorials();
    };

    const deleteEditorial = async (editorial) => {
        if (editorial.user.id != user.id) {
            return;
        }
        const res = await axios
            .delete(
                `${process.env.SERVER_URL}/editorial/${id}/${editorial.id}/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    validateStatus: false,
                },
            )
            .then((res) => res.data);
        if (!res.success) {
            toast({
                title: "An error occurred",
                description: res.message,
            });
            return;
        }
        setSelectedEditorial({ id: "" });
        getEditorials();
    };

    return (
        <div className="w-screen h-full-w-nav">
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dialogData.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {dialogData.description}
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
                                    <TabsTrigger
                                        value="editorials"
                                        className="m-0.5"
                                    >
                                        Editorials
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
                                    <AIChat
                                        chatHistory={chatHistory}
                                        currentResponse={currentResponse}
                                        handleSendMessage={handleSendMessage}
                                        aiInput={aiInput}
                                        setAiInput={setAiInput}
                                        isDisabled={disableChat}
                                    />
                                </TabsContent>
                                <TabsContent value="editorials">
                                    <div className="py-2 mx-6 flex flex-row gap-2">
                                        {selectedEditorial.id == "" &&
                                        problemStatement.solved ? (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsEditing(
                                                        (prev) => !prev
                                                    );
                                                }}
                                            >
                                                {isEditing ? (
                                                    <div className="flex flex-row gap-2 justify-center items-center">
                                                        <X />
                                                        Cancel editing
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-row gap-2 justify-center items-center">
                                                        <Edit />
                                                        Compose an editorial
                                                    </div>
                                                )}
                                            </Button>
                                        ) : (
                                            <div />
                                        )}
                                        {isEditing ? (
                                            <Button
                                                className="flex flex-row gap-2 justify-center items-center"
                                                variant="outline"
                                                onClick={submitEditorial}
                                                disabled={
                                                    editorialTitle == "" ||
                                                    editorialContent == ""
                                                }
                                            >
                                                {isSubmittingEditorial ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <SendHorizontal />
                                                )}
                                                Submit Editorial
                                            </Button>
                                        ) : (
                                            <div />
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <EditorialEditor
                                            title={editorialTitle}
                                            setTitle={setEditorialTitle}
                                            content={editorialContent}
                                            setContent={setEditorialContent}
                                        />
                                    ) : (
                                        <Editorials
                                            editorials={editorials}
                                            selectedEditorial={
                                                selectedEditorial
                                            }
                                            setSelectedEditorial={
                                                setSelectedEditorial
                                            }
                                            userId={user.id}
                                            deleteEditorial={deleteEditorial}
                                        />
                                    )}
                                </TabsContent>
                            </Tabs>
                        </ResizablePanel>
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
                                                        <CornerUpRight className="mr-2 h-4 w-4" />
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
                                        language={
                                            initialCodeLanguage || language
                                        }
                                        defaultValue={code}
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                        beforeMount={setupMonacoTheme}
                                        options={{
                                            fontFamily: "Cascadia Code",
                                            fontLigatures: true,
                                            autoIndent: true,
                                            cursorSmoothCaretAnimation: true,
                                            cursorBlinking: "expand",
                                        }}
                                    />
                                </div>
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={50}>
                            <Tabs defaultValue="testcases" value={tabValue}>
                                <TabsList>
                                    <TabsTrigger
                                        className="m-0.5"
                                        value="testcases"
                                        onClick={() => {
                                            setTabValue("testcases");
                                        }}
                                    >
                                        Sample Testcases
                                    </TabsTrigger>
                                    <TabsTrigger
                                        className="m-0.5"
                                        value="custom-testcase"
                                        onClick={() => {
                                            setTabValue("custom-testcase");
                                        }}
                                    >
                                        Custom Testcase
                                    </TabsTrigger>
                                    {output != null ? (
                                        <TabsTrigger
                                            className="m-0.5"
                                            value="output"
                                            onClick={() => {
                                                setTabValue("output");
                                            }}
                                        >
                                            Run Output
                                        </TabsTrigger>
                                    ) : (
                                        <div />
                                    )}
                                </TabsList>
                                <TabsContent value="testcases">
                                    <ScrollArea className="h-full items-center justify-center">
                                        <div className="p-6 pb-14">
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
                                                                    .map(
                                                                        (
                                                                            line
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    line
                                                                                }
                                                                            >
                                                                                <p>
                                                                                    {
                                                                                        line
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>
                                                            Output
                                                            <div className="bg-code p-2 my-2 rounded font-mono">
                                                                {testCase.output
                                                                    .split("\n")
                                                                    .map(
                                                                        (
                                                                            line
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    line
                                                                                }
                                                                            >
                                                                                <p>
                                                                                    {
                                                                                        line
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>
                                                        </div>
                                                        {i !=
                                                        problemStatement
                                                            .testCase.length -
                                                            1 ? (
                                                            <Separator className="mt-6" />
                                                        ) : (
                                                            <div />
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="custom-testcase">
                                    <ScrollArea className="flex h-full flex-col gap-5">
                                        <div className="p-6 pb-14">
                                            <Textarea
                                                value={customTestcase}
                                                onChange={(e) =>
                                                    setCustomTestcase(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Check against your own testcases"
                                                className="flex-1 resize-none"
                                                rows={10}
                                            />
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                                {output != null ? (
                                    <TabsContent value="output">
                                        <ScrollArea className="flex h-full flex-col gap-5">
                                            {running ? (
                                                <div className="flex justify-center w-full min-h-full items-center">
                                                    <Loader2 className="mr-2 min-h-full w-4 animate-spin" />
                                                    Running
                                                </div>
                                            ) : (
                                                <div className="p-6 pb-14">
                                                    <p className="text-2xl">
                                                        Code Output
                                                    </p>
                                                    {output.map((o, i) => (
                                                        <div key={i}>
                                                            <p className="mt-3 text-lg">
                                                                Test Case{" "}
                                                                {i + 1}
                                                            </p>
                                                            <div className="bg-code p-2 my-3 rounded font-mono">
                                                                {o
                                                                    .split("\n")
                                                                    .map(
                                                                        (
                                                                            line
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    line
                                                                                }
                                                                            >
                                                                                <p>
                                                                                    {
                                                                                        line
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </TabsContent>
                                ) : (
                                    <div />
                                )}
                            </Tabs>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

export default Code;
