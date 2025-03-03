"use client"
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";

export default function BlockNoteEditorClient() {
    const editor = useCreateBlockNote({});

    return <BlockNoteView editor={editor} />
}