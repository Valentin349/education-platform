"use client"
import dynamic from "next/dynamic"

type BlockNoteWrapperProps = {
    topicId: string;
  }

const BlockNoteEditor = dynamic(
    () => import('./BlockNoteComponent'),
    { ssr: false }
);

export default function BlockNoteWrapper({ topicId }: BlockNoteWrapperProps) {
    return (
        <div className="w-full max-w-3xl p-5">
            <BlockNoteEditor topicId={topicId} />
        </div>
    )
}