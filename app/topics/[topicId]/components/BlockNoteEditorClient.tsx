"use client"
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";

const getCustomSlashMenuItems = (editor: BlockNoteEditor): DefaultReactSuggestionItem[] => {
    return getDefaultReactSlashMenuItems(editor).filter(
        (item) => !["Image", "Video", "Table", "File", "Embed", 'Audio', 'Emoji'].includes(item.title) // Exclude media-related blocks
    );
};

export default function BlockNoteEditorClient() {
    const editor = useCreateBlockNote({});

    return (
        <BlockNoteView editor={editor} slashMenu={false} >
            <SuggestionMenuController
                triggerCharacter={"/"}
                getItems={async (query) =>
                    filterSuggestionItems(getCustomSlashMenuItems(editor), query)
                  }
            />
        </BlockNoteView>
    );
}