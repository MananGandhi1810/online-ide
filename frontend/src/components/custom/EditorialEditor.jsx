import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Quote,
    Code,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Link2,
    Undo2,
    Redo2,
    Trash2,
} from "lucide-react";

const lowlight = createLowlight(common);

function EditorialEditor({ title, setTitle, content, setContent }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Link.configure({
                openOnClick: true,
                autolink: true,
            }),
            Underline,
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ icon: Icon, onClick, isActive, title }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded transition-colors ${
                isActive
                    ? "bg-slate-700 text-white"
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title={title}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="flex h-full-w-nav-w-tab w-full flex-col">
            <ScrollArea className="h-full-w-nav-w-tab flex flex-col p-6 py-1 gap-2 overflow-auto">
                <Textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="resize-none text-md [field-sizing:content]"
                />

                <div className="flex flex-wrap gap-1 p-3 rounded-t-md border border-slate-700 border-b-0">
                    <ToolbarButton
                        icon={Heading1}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive("heading", { level: 1 })}
                        title="Heading 1"
                    />
                    <ToolbarButton
                        icon={Heading2}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive("heading", { level: 2 })}
                        title="Heading 2"
                    />
                    <ToolbarButton
                        icon={Heading3}
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive("heading", { level: 3 })}
                        title="Heading 3"
                    />

                    <div className="w-px bg-slate-700 mx-1" />

                    <ToolbarButton
                        icon={Bold}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive("bold")}
                        title="Bold"
                    />
                    <ToolbarButton
                        icon={Italic}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive("italic")}
                        title="Italic"
                    />
                    <ToolbarButton
                        icon={UnderlineIcon}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive("underline")}
                        title="Underline"
                    />
                    <ToolbarButton
                        icon={Code}
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive("code")}
                        title="Inline Code"
                    />

                    <div className="w-px bg-slate-700 mx-1" />

                    <ToolbarButton
                        icon={Quote}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive("blockquote")}
                        title="Quote"
                    />
                    <ToolbarButton
                        icon={Link2}
                        onClick={() => {
                            const url = prompt("Enter URL:");
                            if (url) {
                                editor.chain().focus().setLink({ href: url }).run();
                            }
                        }}
                        isActive={editor.isActive("link")}
                        title="Link"
                    />

                    <div className="w-px bg-slate-700 mx-1" />

                    <ToolbarButton
                        icon={List}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive("bulletList")}
                        title="Bullet List"
                    />
                    <ToolbarButton
                        icon={ListOrdered}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive("orderedList")}
                        title="Ordered List"
                    />

                    <div className="w-px bg-slate-700 mx-1" />

                    <ToolbarButton
                        icon={Undo2}
                        onClick={() => editor.chain().focus().undo().run()}
                        title="Undo"
                    />
                    <ToolbarButton
                        icon={Redo2}
                        onClick={() => editor.chain().focus().redo().run()}
                        title="Redo"
                    />
                    <ToolbarButton
                        icon={Trash2}
                        onClick={() => editor.chain().focus().clearNodes().run()}
                        title="Clear Formatting"
                    />
                </div>

                <div className="border border-slate-700 border-t-0 rounded-b-md overflow-auto flex-1">
                    <EditorContent
                        editor={editor}
                        className="prose prose-invert max-w-none p-4 focus:outline-none"
                    />
                </div>
            </ScrollArea>
        </div>
    );
}

export default EditorialEditor;
