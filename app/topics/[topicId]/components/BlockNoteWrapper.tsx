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
        <div>
            {userRole === 'teacher' ?
                <BlockNoteComponent topicId={topicId} readonly={false} />:
                <BlockNoteComponent topicId={topicId} readonly={true} />
            }
        </div>
    )
}