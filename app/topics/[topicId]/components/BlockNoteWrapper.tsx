"use client"
import dynamic from "next/dynamic"

type BlockNoteWrapperProps = {
    topicId: string;
    readonly: boolean;
};

const BlockNoteComponent = dynamic(
    () => import('./BlockNoteComponent'),
    { ssr: false }
);

export default function BlockNoteWrapper({ topicId, readonly }: BlockNoteWrapperProps) {
    return (
        <div className="w-full max-w-3xl p-5">
            <BlockNoteComponent topicId={topicId} readonly={readonly} />
        </div>
    )
}