"use client"
import { BlockNoteView } from "@blocknote/mantine";
import { DefaultReactSuggestionItem, getDefaultReactSlashMenuItems, SuggestionMenuController, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { useEffect, useState } from "react";
import { getNotesFromTopic, updateTopicNotes } from "@/lib/topics.client";
import "@blocknote/mantine/style.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
            <Card className="w-full border shadow-sm">
                <CardContent className="p-6">
                    <div
                        className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic prose-img:rounded-md prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-md prose-code:text-pink-500 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full border shadow-sm">
            <CardContent className="p-0">
                <div className="min-h-64 p-4">
                    <BlockNoteView editor={editor} slashMenu={false} theme={'light'}>
                        <SuggestionMenuController
                            triggerCharacter={"/"}
                            getItems={async (query) =>
                                filterSuggestionItems(getCustomSlashMenuItems(editor), query)
                            }
                        />
                    </BlockNoteView>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end bg-gray-50 p-3 border-t">
                <Button
                    onClick={saveContent}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    {loading ? "Saving..." : "Save Notes"}
                    {loading && <span className="animate-spin">⟳</span>}
                </Button>
            </CardFooter>
        </Card>
    );
}