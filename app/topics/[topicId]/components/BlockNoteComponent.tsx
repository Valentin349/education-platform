"use client"
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { useEffect, useState } from "react";
import { getNotesFromTopic, updateTopicNotes } from "@/lib/topics.client";
import "@blocknote/mantine/style.css";

type BlockNoteComponentProps = {
    topicId: string;
    readonly: boolean;
};

const getCustomSlashMenuItems = (editor: BlockNoteEditor): DefaultReactSuggestionItem[] => {
    return getDefaultReactSlashMenuItems(editor).filter(
        (item) => !['Image', 'Video', 'Table', 'File', 'Embed', 'Audio', 'Emoji'].includes(item.title)
    );
};

export default function BlockNoteComponent({ topicId, readonly }: BlockNoteComponentProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [htmlContent, setHtmlContent] = useState<string>("");
    const editor = useCreateBlockNote({});

    const loadContent = async () => {
        setLoading(true);
        try {
            const data = await getNotesFromTopic(topicId);
            const notes = data?.notes ?? [];

            editor.replaceBlocks(editor.document, notes);

            if (readonly) {
                const html = await editor.blocksToFullHTML(editor.document);
                setHtmlContent(html);
            }
        } catch (error: any) {
            console.error(error.message);
        }

        setLoading(false);
    }

    const saveContent = () => {
        const notes = editor.document;
        try {
            updateTopicNotes(topicId, notes);
            alert('successfully saved notes');
        } catch (error: any) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        loadContent();
    }, []);

    if (readonly) {
        return (
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          );
    }

    return (
        <div>
            <BlockNoteView editor={editor} slashMenu={false} >
                <SuggestionMenuController
                    triggerCharacter={"/"}
                    getItems={async (query) =>
                        filterSuggestionItems(getCustomSlashMenuItems(editor), query)
                    }
                />
            </BlockNoteView>

            <button onClick={saveContent} disabled={loading}>
                Save Notes
            </button>
        </div>
    );
}