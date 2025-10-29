"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface Props {
    value?: string;
    onChange: (value: string) => void;
}


export default function RichTextEditor({ value, onChange }: Readonly<Props>) {
    const editor = useEditor({
        extensions: [StarterKit.configure({
            bulletList: {
                HTMLAttributes:{
                    class: "list-disc ml-3"
                }
            }
        })],
        content: value,
        autofocus: false,
        editable: true,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "border border-gray-300 rounded-md hover:border-[#01959F] focus-within:border-[#01959F] min-h-[150px] p-3"

            }
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "");
        }
    }, [value, editor]);

    return (
        <EditorContent editor={editor} />
    );
}
