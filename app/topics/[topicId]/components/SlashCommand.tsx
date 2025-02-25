import { Editor, Extension, Range } from "@tiptap/react";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import RenderSuggestions from "./RenderSuggestions";

type CommandProps = {
    editor: Editor;
    range: Range;
    props: any;
}

type CommandItem = {
    title: string;
    icon?: React.ReactNode;
    command?: (props: { editor: Editor; range: Range }) => void;
    disabled?: boolean;
  }
export default Extension.create({
    name: 'slash-command',

    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({ editor, range, props }: CommandProps) => {
                    props.command({ editor, range });
                },
                items: ({ query }: { query: string }) => {
                    return [
                        {
                            title: 'Heading 1',
                            command: ({ editor, range }: CommandProps) => {
                                editor
                                    .chain()
                                    .focus()
                                    .deleteRange(range)
                                    .setNode('heading', { level: 1 })
                                    .run()
                            },
                        },
                        {
                            title: 'Heading 2',
                            command: ({ editor, range }: CommandProps) => {
                                editor
                                    .chain()
                                    .focus()
                                    .deleteRange(range)
                                    .setNode('heading', { level: 2 })
                                    .run()
                            },
                        },
                        {
                            title: 'Bold',
                            command: ({ editor, range }: CommandProps) => {
                                editor
                                    .chain()
                                    .focus()
                                    .deleteRange(range)
                                    .setMark('bold')
                                    .run()
                            },
                        },
                        {
                            title: 'Italic',
                            command: ({ editor, range }: CommandProps) => {
                                editor
                                    .chain()
                                    .focus()
                                    .deleteRange(range)
                                    .setMark('italic')
                                    .run()
                            },
                        },
                    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10)
                },
            },
            commandItems: [] as CommandItem[],
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
                render: RenderSuggestions,
            } as SuggestionOptions),
        ];
    },
})