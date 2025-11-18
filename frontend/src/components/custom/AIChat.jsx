import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from "react-markdown";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

function AIChat({
    chatHistory,
    currentResponse,
    handleSendMessage,
    aiInput,
    setAiInput,
    isDisabled,
}) {
    return (
        <div className="flex h-full-w-nav-w-tab w-full flex-col">
            <ScrollArea className="h-full-w-nav-w-tab flex flex-col p-6 py-0 overflow-auto">
                {chatHistory.length != 0 ? (
                    chatHistory.map((message) => (
                        <div
                            key={() => new Date().toISOString()}
                            className={`mb-4 p-3 rounded-lg ${
                                message.role === "user"
                                    ? "bg-primary text-primary-foreground ml-auto"
                                    : "bg-muted mr-auto"
                            } max-w-[80%] w-fit text-wrap break-keep`}
                        >
                            {message.role == "assistant" ? (
                                <Markdown className="prose dark:prose-invert min-w-full max-w-full w-full">
                                    {message.content}
                                </Markdown>
                            ) : (
                                <p>{message.content}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="flex justify-center items-center">
                        You can chat with an AI Assistant and get help with your
                        code here!
                    </p>
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
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 resize-none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                />
                <Button type="submit" size="icon" disabled={isDisabled}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                </Button>
            </form>
        </div>
    );
}

export default AIChat;
