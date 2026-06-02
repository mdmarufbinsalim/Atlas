import { useBlock } from "@/app/hooks/useBlock"
import { cn } from "@/lib/utils"
import { PiDotsSixVerticalBold, PiPlus } from "react-icons/pi"
import { RenderElementProps } from "slate-react"

export default function Block({
    attributes,
    children,
    element,
}: RenderElementProps) {
    const {
        showSlashMenuPrompt,
        isDragging,
        isTarget,
        dropBefore,
        handleAddBlock,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
    } = useBlock({ element })

    return (
        <div
            {...attributes}
            className={cn(
                "group relative flex gap-2 selection:bg-editor-text-selection transition-opacity duration-100",
                isDragging && "opacity-30"
            )}
        >
            {isTarget && dropBefore && (
                <div
                    contentEditable={false}
                    className="pointer-events-none absolute -top-px left-8 right-0 h-0.5 rounded-full bg-blue-400 z-10"
                />
            )}

            <div
                contentEditable={false}
                className="h-13.5 flex items-center gap-0.5 shrink-0"
            >
                <div
                    className="p-2 rounded opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-white/10 active:bg-white/15"
                    onMouseDown={handleAddBlock}
                    onTouchEnd={handleAddBlock}
                >
                    <PiPlus className="text-editor-text size-4" />
                </div>

                <div
                    className="p-2 rounded opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300 cursor-grab active:cursor-grabbing hover:bg-white/10 active:bg-white/15"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    contentEditable={false}
                    style={{ touchAction: "none" }}
                >
                    <PiDotsSixVerticalBold className="text-editor-text size-4" />
                </div>
            </div>

            <div className="relative flex-1 min-w-0 min-h-12">
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

            {isTarget && !dropBefore && (
                <div
                    contentEditable={false}
                    className="pointer-events-none absolute -bottom-px left-8 right-0 h-0.5 rounded-full bg-blue-400 z-10"
                />
            )}
        </div>
    )
}