"use client"
import dynamic from "next/dynamic"


const BlockNoteEditorClient = dynamic(
    () => import('./BlockNoteEditorClient'),
    { ssr: false }
);

export default function BlockNoteEditorComponent() {
    return (
        <div className="w-full max-w-3xl p-5">
            <BlockNoteEditorClient />
        </div>
    )
}