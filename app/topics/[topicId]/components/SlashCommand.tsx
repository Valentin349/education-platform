import { Editor } from "@tiptap/react";
import { ChangeEvent, useEffect, useState } from "react";

type SlashCommandProps = {
    editor: Editor | null;
}

type Command = {
    name: string;
    action: () => void;
}

export function SlashCommand({ editor }: SlashCommandProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [command, setCommand] = useState('');
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

    if (!editor) return null;

    const commands = [
        { name: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
        { name: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { name: 'Bullet List', action: () => editor.chain().focus().toggleBulletList().run() },
        { name: 'Numbered List', action: () => editor.chain().focus().toggleOrderedList().run() },
        { name: 'Code Block', action: () => editor.chain().focus().toggleCodeBlock().run() },
    ];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!editor) return;
            if (event.key === '/') {
                const { from } = editor.state.selection;
                const coords = editor.view.coordsAtPos(from);
                setPosition({ top: coords.top + 30, left: coords.left });
                setShowMenu(true);
            } else if (event.key === 'Escape') {
                setShowMenu(false);
            }
        };

        editor.view.dom.addEventListener('keydown', handleKeyDown);
        return () => {
            editor.view.dom.removeEventListener('keydown', handleKeyDown);
        };
    }, [editor]);

    const handleCommandClick = (action: () => void) => {
        action();
        setShowMenu(false);
    };


    return showMenu && position ? (
        <div
            className="absolute bg-white border rounded shadow-md p-2"
            style={{ top: position.top, left: position.left }}
        >
            {commands.map((c, index) => (
                <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCommandClick(c.action)}
                >
                    {c.name}
                </div>
            ))}
        </div>
    ) : null;
}