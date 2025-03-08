"use client"
import dynamic from "next/dynamic"
import { getCurrentUser } from '@/lib/mockUsers';

type BlockNoteWrapperProps = {
    topicId: string;
};

const BlockNoteComponent = dynamic(
    () => import('./BlockNoteComponent'),
    { ssr: false }
);

export default function BlockNoteWrapper({ topicId }: BlockNoteWrapperProps) {
    const currentUser = getCurrentUser();
    return (
        <div className="w-full max-w-3xl p-5">
            {currentUser.role === 'teacher' ?
                <BlockNoteComponent topicId={topicId} readonly={false} />:
                <BlockNoteComponent topicId={topicId} readonly={true} />
            }
        </div>
    )
}