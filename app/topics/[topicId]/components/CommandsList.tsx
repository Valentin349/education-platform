import { Editor } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";

type CommandListProps = {
    items: CommandItem[];
    command: (props: any) => void;
}

type CommandItem = {
    title: string;
    icon?: React.ReactNode;
    command?: (props: { editor: Editor; range: Range }) => void;
    disabled?: boolean;
}

export default function CommandList({ items, command }: CommandListProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
    const [isKeyboardActive, setIsKeyboardActive] = useState(false);
    const itemsRef = useRef<HTMLDivElement>(null);


    const scrollToItem = useCallback((index: number) => {
        if (itemsRef.current && itemsRef.current.children[index]) {
            (itemsRef.current.children[index] as HTMLElement).scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, []);

    const selectItem = useCallback(
        (index: number) => {
            if (items.length > 0 && items[0].title !== "No results found") {
                setSelectedIndex(index);
                scrollToItem(index);
            }
        },
        [items, scrollToItem]
    );

    const upHandler = useCallback(() => {
        setIsKeyboardActive(true);
        if (selectedIndex !== null) {
            selectItem((selectedIndex - 1 + items.length) % items.length);
        } else if (items.length > 0) {
            selectItem(items.length - 1);
        }
    }, [items, selectedIndex, selectItem]);

    const downHandler = useCallback(() => {
        setIsKeyboardActive(true);
        if (selectedIndex !== null) {
            selectItem((selectedIndex + 1) % items.length);
        } else if (items.length > 0) {
            selectItem(0);
        }
    }, [items, selectedIndex, selectItem]);

    const enterHandler = () => {
        if (selectedIndex !== null) {
            const item = items[selectedIndex];
            if (item && !item.disabled && typeof command === "function") {
                command(item);
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowUp") {
                event.preventDefault();
                upHandler();
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                downHandler();
            } else if (event.key === "Enter") {
                event.preventDefault();
                if (enterHandler()) {
                    event.stopPropagation();
                }
            }
        };

        document.addEventListener("keydown", onKeyDown, true);
        return () => {
            document.removeEventListener("keydown", onKeyDown, true);
        };
    }, [upHandler, downHandler]);



    return (
        <div className="slash-menu" ref={itemsRef}>
            {items.map((item, index) => {
                return (
                    <button
                        className={`slash-menu__item ${isKeyboardActive && index === selectedIndex
                                ? "slash-menu__item--selected"
                                : ""
                            } ${item.disabled ? "slash-menu__item--disabled" : ""}`}
                        key={index}
                        onClick={() => {
                            setIsKeyboardActive(false);
                            command(item);
                        }}
                        onMouseEnter={() => {
                            if (isKeyboardActive) {
                                setIsKeyboardActive(false);
                                setSelectedIndex(null);
                            }
                        }}
                        disabled={item.disabled}
                    >
                        {item.icon && item.icon}
                        <span className="slash-menu__item-title">{item.title}</span>
                    </button>
                );
            })}
        </div>
    );
};
