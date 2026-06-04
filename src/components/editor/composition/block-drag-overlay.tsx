"use client"
import { Element, Node } from "slate"
import { useSlate } from "slate-react"

export default function BlockDragOverlay({ blockIndex }: { blockIndex: number }) {
    const editor = useSlate()
    const block = editor.children[blockIndex]
    if (!block || !Element.isElement(block)) return null

    const text = Node.string(block)

    return (
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-400/25 bg-editor-background shadow-2xl shadow-black/70 ring-1 ring-blue-400/20 cursor-grabbing select-none opacity-95 backdrop-blur-sm max-w-xs">
            <div className="w-1 self-stretch rounded-full bg-blue-400/40 shrink-0" />
            <span className="text-editor-text/60 font-mono text-sm truncate min-w-0">
                {text || <em className="opacity-40">Empty block</em>}
            </span>
        </div>
    )
}
