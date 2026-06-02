"use client"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Mode } from "@/types/slate.types"
import { cn } from "@/lib/utils"

type SlashItem = { label: string; mode: Mode; hint: string }

const ITEMS: SlashItem[] = [
    { label: 'Text',     mode: 'text',     hint: 'Plain paragraph'  },
    { label: 'Header 1', mode: 'header_1', hint: 'Large heading'    },
    { label: 'Header 2', mode: 'header_2', hint: 'Medium heading'   },
    { label: 'Header 3', mode: 'header_3', hint: 'Small heading'    },
    { label: 'Header 4', mode: 'header_4', hint: 'Smallest heading' },
]

const GAP = 6

type Props = {
    anchor: { top: number; bottom: number; left: number; right: number }
    query: string
    onSelect: (mode: Mode) => void
    onClose: () => void
}

export default function SlashMenu({ anchor, query, onSelect, onClose }: Props) {
    const menuRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [prevQuery, setPrevQuery] = useState(query)
    const [style, setStyle] = useState<React.CSSProperties>({ visibility: 'hidden', position: 'fixed', top: 0, left: 0 })

    if (prevQuery !== query) {
        setPrevQuery(query)
        setActiveIndex(0)
    }

    const filtered = ITEMS.filter(({ label }) =>
        label.toLowerCase().includes(query.toLowerCase())
    )

    // Recompute position whenever anchor or filtered list changes
    useLayoutEffect(() => {
        const menu = menuRef.current
        if (!menu) return

        const menuRect = menu.getBoundingClientRect()
        const vw = window.innerWidth
        const vh = window.innerHeight

        // Vertical: prefer below cursor, flip above if it would overflow
        const top = anchor.bottom + GAP + menuRect.height > vh
            ? anchor.top - menuRect.height - GAP
            : anchor.bottom + GAP

        // Horizontal: align to cursor left, shift left if it would overflow
        const left = Math.min(anchor.left, vw - menuRect.width - GAP)

        setStyle({ visibility: 'visible', position: 'fixed', top, left })
    }, [anchor, filtered.length])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault(); e.stopPropagation()
                setActiveIndex(i => (i + 1) % filtered.length)
            } else if (e.key === 'ArrowUp') {
                e.preventDefault(); e.stopPropagation()
                setActiveIndex(i => (i - 1 + filtered.length) % filtered.length)
            } else if (e.key === 'Enter') {
                e.preventDefault(); e.stopPropagation()
                if (filtered[activeIndex]) onSelect(filtered[activeIndex].mode)
            } else if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
            }
        }
        window.addEventListener('keydown', handler, true)
        return () => window.removeEventListener('keydown', handler, true)
    }, [filtered, activeIndex, onSelect, onClose])

    if (!filtered.length) return null

    return (
        <div ref={menuRef} style={style} className="z-50 w-52 max-w-[calc(100vw-16px)] rounded-lg border border-white/10 bg-[#252525] shadow-2xl py-1">
            {filtered.map((item, i) => (
                <div
                    key={item.mode}
                    onMouseDown={e => { e.preventDefault(); onSelect(item.mode) }}
                    className={cn(
                        'flex items-center justify-between gap-4 px-3 py-2 cursor-pointer',
                        i === activeIndex ? 'bg-white/10' : 'hover:bg-white/5'
                    )}
                >
                    <span className="text-editor-text text-sm font-mono">{item.label}</span>
                    <span className="text-white/40 text-xs">{item.hint}</span>
                </div>
            ))}
        </div>
    )
}
