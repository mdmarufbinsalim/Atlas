import { useShowSlashMenuPrompt } from "@/app/hooks/useShowSlashMenuPrompt";
import { PiDotsSixVerticalBold, PiPlus } from "react-icons/pi";
import { RenderElementProps } from "slate-react";

export default function Block({ attributes, children, element }: RenderElementProps) {
    const { showSlashMenuPrompt } = useShowSlashMenuPrompt(element)
    return (
        <div {...attributes} className="group flex items-center gap-2 selection:bg-editor-text-selection">
            <div className="min-h-6 flex items-center gap-1">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-grab" contentEditable={false}>
                    <PiPlus className="text-editor-text" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-grab" contentEditable={false}>
                    <PiDotsSixVerticalBold className="text-editor-text" />
                </div>
            </div>
            <div className="relative flex-1 min-w-0">
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
        </div>
    );
}
