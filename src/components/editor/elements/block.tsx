import { useBlock } from "@/app/hooks/useBlock"
import { cn } from "@/lib/utils"
import { PiDotsSixVerticalBold, PiPlus } from "react-icons/pi"
import { RenderElementProps } from "slate-react"

function DropIndicator({ position }: { position: "top" | "bottom" }) {
    return (
        <div
            contentEditable={false}
            className={cn(
                "pointer-events-none absolute left-0 right-0 z-20",
                "flex items-center",
                position === "top" ? "-top-px" : "-bottom-px"
            )}
        >
            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 shadow-[0_0_6px_2px_rgba(96,165,250,0.8)]" />
            <div className="flex-1 h-0.5 bg-linear-to-r from-blue-400 via-blue-400/70 to-transparent shadow-[0_0_8px_2px_rgba(96,165,250,0.5)]" />
        </div>
    )
}

export default function Block({
    attributes,
    children,
    element,
}: RenderElementProps) {
    const {
        showSlashMenuPrompt,
        isDragging,
        isDropTarget,
        dropBefore,
        setNodeRef,
        listeners,
        handleAddBlock,
    } = useBlock({ element })

    const composedRef = (node: HTMLElement | null) => {
        setNodeRef(node)
        const slateRef = attributes.ref
        if (typeof slateRef === "function") slateRef(node)
    }

    return (
        <div
            {...attributes}
            ref={composedRef}
            className={cn(
                "group relative flex gap-2 selection:bg-editor-text-selection transition-opacity duration-150",
                isDragging ? "opacity-25" : "opacity-100"
            )}
        >
            {isDropTarget && dropBefore && <DropIndicator position="top" />}

            <div
                contentEditable={false}
                className="h-12 flex items-center gap-0.5 shrink-0"
            >
                <div
                    className="p-2 rounded opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-white/10 active:bg-white/15"
                    onMouseDown={handleAddBlock}
                    onTouchEnd={handleAddBlock}
                >
                    <PiPlus className="text-editor-text size-4" />
                </div>

                <div
                    {...listeners}
                    className="p-2 rounded opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300 cursor-grab active:cursor-grabbing hover:bg-white/10 active:bg-white/15"
                    contentEditable={false}
                    style={{ touchAction: "none" }}
                >
                    <PiDotsSixVerticalBold className="text-editor-text size-4" />
                </div>
            </div>

            <div
                className="relative flex-1 min-w-0 min-h-12"
                style={{ lineHeight: 0, fontSize: 0 }}
            >
                {showSlashMenuPrompt && (
                    <span
                        contentEditable={false}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none select-none font-mono text-sm"
                    >
                        use &apos;/&apos; for commands
                    </span>
                )}
                {children}
            </div>

            {isDropTarget && !dropBefore && <DropIndicator position="bottom" />}
        </div>
    )
}
