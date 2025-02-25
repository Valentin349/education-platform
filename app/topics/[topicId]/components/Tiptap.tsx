"use client"
import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import SlashCommand from "./SlashCommand";

export function Tiptap() {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            SlashCommand
        ],
        content: '<p>Hello World!</p>'
    })

    return (
        <div>
            {editor &&
                <BubbleMenu editor={editor}>
                    <div className="bubble-menu">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'is-active' : ''}
                        >
                            Bold
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'is-active' : ''}
                        >
                            Italic
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={editor.isActive('strike') ? 'is-active' : ''}
                        >
                            Strike
                        </button>
                    </div>
                </BubbleMenu>
            }
            <EditorContent editor={editor} />
        </div>
    );
}