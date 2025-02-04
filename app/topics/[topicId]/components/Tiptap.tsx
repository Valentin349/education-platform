"use client"
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function Tiptap() {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
        ],
        content: '<p>Hello World!</p>'
    })

    return (
        <div>
            <EditorContent editor={editor}/>
        </div>
    );
}