"use client"
import dynamic from "next/dynamic"

type BlockNoteWrapperProps = {
    topicId: string;
    userRole: string;
};

const BlockNoteComponent = dynamic(
    () => import('./BlockNoteComponent'),
    { ssr: false }
);

export default function BlockNoteWrapper({ topicId, userRole }: BlockNoteWrapperProps) {
    return (
        <div className="w-full max-w-3xl p-5">
            {userRole === 'teacher' ?
                <BlockNoteComponent topicId={topicId} readonly={false} />:
                <BlockNoteComponent topicId={topicId} readonly={true} />
            }
        </div>
    )
}