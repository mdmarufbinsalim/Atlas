"use client"

import { useRef, useState } from "react"
import { Element, Text } from "slate"
import { useSlate } from "slate-react"

interface Props {
    onClick: () => void
    className?: string
}

export default function BlockSpacerTooltip({ onClick, className }: Props) {
    const editor = useSlate()
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    const lastBlock = editor.children[editor.children.length - 1]
    const canAdd = Element.isElement(lastBlock) && !lastBlock.children.every(c => Text.isText(c) && c.text === '')

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!canAdd) return
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return

        const TOOLTIP_WIDTH = 130
        const TOOLTIP_HEIGHT = 28
        const OFFSET = 20

        const onLeft = e.clientX < window.innerWidth / 2
        const x = onLeft
            ? e.clientX - rect.left + OFFSET
            : e.clientX - rect.left - TOOLTIP_WIDTH - OFFSET

        const y = e.clientY - TOOLTIP_HEIGHT - OFFSET < 0
            ? e.clientY - rect.top + OFFSET
            : e.clientY - rect.top - TOOLTIP_HEIGHT - OFFSET

        setPos({ x, y })
    }

    return (
        <div
            ref={ref}
            className={`flex-1 grow min-h-6 relative ${canAdd ? "cursor-pointer" : ""} ${className ?? ""}`}
            onClick={canAdd ? onClick : undefined}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setPos(null)}
        >
            {canAdd && pos && (
                <span
                    className="absolute z-50 px-2 py-1 text-xs font-mono text-white/60 bg-white/10 border border-white/15 rounded pointer-events-none select-none whitespace-nowrap backdrop-blur-sm"
                    style={{ left: pos.x, top: pos.y }}
                >
                    click to add block
                </span>
            )}
        </div>
    )
}
