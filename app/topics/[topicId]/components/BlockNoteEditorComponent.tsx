"use client"
import dynamic from "next/dynamic"

type BlockNoteEditorComponentProps = {
    topicId: string;
  }

const BlockNoteEditorClient = dynamic(
    () => import('./BlockNoteEditorClient'),
    { ssr: false }
);

export default function BlockNoteEditorComponent({ topicId }: BlockNoteEditorComponentProps) {
    return (
        <div className="w-full max-w-3xl p-5">
            <BlockNoteEditorClient topicId={topicId} />
        </div>
    )
}