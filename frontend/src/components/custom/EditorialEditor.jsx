import React from "react";
import { Textarea } from "../ui/textarea";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ScrollArea } from "../ui/scroll-area";

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote", "link", "code"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["code-block"],
    ["clean"],
];

function EditorialEditor({ title, setTitle, content, setContent }) {
    return (
        <div className="flex h-full-w-nav-w-tab w-full flex-col">
            <ScrollArea className="h-full-w-nav-w-tab flex flex-col p-6 py-1 gap-2 overflow-auto">
                <Textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="resize-none text-md [field-sizing:content]"
                />
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={(e) => setContent(e)}
                    className="invert rounded-md text-black pt-3 flex-1 mb-10"
                    modules={{
                        toolbar: {
                            container: TOOLBAR_OPTIONS,
                        },
                    }}
                />
            </ScrollArea>
        </div>
    );
}

export default EditorialEditor;
