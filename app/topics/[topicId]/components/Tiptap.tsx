"use client"
import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { SlashCommand } from "./SlashCommand";

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
            {editor && <BubbleMenu editor={editor}><div> BUBBLE MENU HERE</div></BubbleMenu>}
            <EditorContent editor={editor} />
            <SlashCommand editor={editor} />
        </div>
    );
}