"use client"
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "@blocknote/mantine/style.css";

type BlockNoteComponentProps = {
    topicId: string;
};

const getCustomSlashMenuItems = (editor: BlockNoteEditor): DefaultReactSuggestionItem[] => {
    return getDefaultReactSlashMenuItems(editor).filter(
        (item) => !['Image', 'Video', 'Table', 'File', 'Embed', 'Audio', 'Emoji'].includes(item.title)
    );
};

const supabase = createClient();

export default function BlockNoteComponent({ topicId }: BlockNoteComponentProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const editor = useCreateBlockNote({});

    const loadContent = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('topics')
            .select('notes')
            .eq('id', topicId)
            .single();

        if (error) {
            console.error('Error loading editor content:', error);
        } else {
            const notes = data?.notes ?? [];

            editor.replaceBlocks(editor.document, notes);
        }

        setLoading(false);
    }

    const saveContent = async () => {
        const notes = editor.document;

        const { error } = await supabase
            .from('topics')
            .update({ notes })
            .eq('id', topicId);

        if (error) {
            console.error('Error saving editor content:', error);
        } else {
            alert('successfully saved notes');
        }
    }

    useEffect(() => {
        loadContent();
    }, []);

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