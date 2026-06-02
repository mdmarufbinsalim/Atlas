"use client"
import { useLayoutEffect, useRef, useState } from "react"
import { Editor, Range, Text } from "slate"
import { useSlate } from "slate-react"
import { FormattedText, Mode } from "@/types/slate.types"
import { cn } from "@/lib/utils"
import { PiCheck } from "react-icons/pi"

const MODES: { mode: Mode; label: string; icon: string }[] = [
    { mode: 'text',     label: 'Normal Text', icon: 'T'  },
    { mode: 'header_1', label: 'Heading 1',   icon: 'H1' },
    { mode: 'header_2', label: 'Heading 2',   icon: 'H2' },
    { mode: 'header_3', label: 'Heading 3',   icon: 'H3' },
    { mode: 'header_4', label: 'Heading 4',   icon: 'H4' },
]

const GAP = 20

function getUniformValue<K extends keyof FormattedText>(
    editor: Editor,
    key: K
): FormattedText[K] | 'mixed' | undefined {
    let value: FormattedText[K] | undefined
    let initialized = false
    for (const [node] of Editor.nodes(editor, { match: Text.isText, mode: 'lowest' })) {
        const v = (node as FormattedText)[key]
        if (!initialized) { value = v; initialized = true }
        else if (v !== value) return 'mixed'
    }
    return value
}

export default function SelectionToolbar() {
    const editor = useSlate()
    const ref = useRef<HTMLDivElement>(null)
    const [style, setStyle] = useState<React.CSSProperties>({
        visibility: 'hidden', position: 'fixed', top: 0, left: 0,
    })

    const { selection } = editor
    const isOpen = !!selection && !Range.isCollapsed(selection)

    const activeMode = isOpen ? getUniformValue(editor, 'mode')      : undefined
    const bold       = isOpen ? getUniformValue(editor, 'bold')       : undefined
    const striked    = isOpen ? getUniformValue(editor, 'striked')    : undefined
    const underlined = isOpen ? getUniformValue(editor, 'underlined') : undefined

    useLayoutEffect(() => {
        if (!isOpen || !ref.current) {
            setStyle(s => ({ ...s, visibility: 'hidden' }))
            return
        }
        const domSel = window.getSelection()
        if (!domSel?.rangeCount) return

        const selRect = domSel.getRangeAt(0).getBoundingClientRect()
        const tbRect  = ref.current.getBoundingClientRect()
        const vw = window.innerWidth
        const vh = window.innerHeight

        const top  = selRect.top - tbRect.height - GAP > GAP
            ? selRect.top - tbRect.height - GAP
            : selRect.bottom + GAP

        const left = Math.max(GAP, Math.min(selRect.left, vw - tbRect.width - GAP))

        // clamp top to viewport
        const clampedTop = Math.max(GAP, Math.min(top, vh - tbRect.height - GAP))

        setStyle({ visibility: 'visible', position: 'fixed', top: clampedTop, left })
    }, [isOpen, selection])

    const toggleMark = (mark: 'bold' | 'striked' | 'underlined') => {
        if (getUniformValue(editor, mark) === true) Editor.removeMark(editor, mark)
        else Editor.addMark(editor, mark, true)
    }

    return (
        <div
            ref={ref}
            style={style}
            className="z-50 w-56 max-w-[calc(100vw-16px)] rounded-xl border border-white/10 bg-[#252525] shadow-2xl overflow-hidden"
        >
            {/* Mode list */}
            <div className="py-1">
                {MODES.map(({ mode, label, icon }) => (
                    <div
                        key={mode}
                        onMouseDown={e => { e.preventDefault(); Editor.addMark(editor, 'mode', mode) }}
                        className="flex items-center gap-3 px-3 py-1.5 cursor-pointer hover:bg-white/5 transition-colors"
                    >
                        <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/70 font-mono shrink-0">
                            {icon}
                        </div>
                        <span className="flex-1 text-sm text-white/80">{label}</span>
                        {activeMode === mode && (
                            <PiCheck className="text-white/60 shrink-0" />
                        )}
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Formatting row */}
            <div className="flex items-center gap-0.5 px-2 py-2">
                <button
                    onMouseDown={e => { e.preventDefault(); toggleMark('bold') }}
                    title="Bold (⌘B)"
                    className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer transition-colors',
                        bold === true
                            ? 'bg-white/20 text-white'
                            : 'text-white/40 hover:bg-white/10 hover:text-white/80'
                    )}
                >
                    B
                </button>
                <button
                    onMouseDown={e => { e.preventDefault(); toggleMark('striked') }}
                    title="Strikethrough (⌘⇧S)"
                    className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-sm line-through cursor-pointer transition-colors',
                        striked === true
                            ? 'bg-white/20 text-white'
                            : 'text-white/40 hover:bg-white/10 hover:text-white/80'
                    )}
                >
                    S
                </button>
                <button
                    onMouseDown={e => { e.preventDefault(); toggleMark('underlined') }}
                    title="Underline (⌘U)"
                    className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-sm underline cursor-pointer transition-colors',
                        underlined === true
                            ? 'bg-white/20 text-white'
                            : 'text-white/40 hover:bg-white/10 hover:text-white/80'
                    )}
                >
                    U
                </button>
            </div>
        </div>
    )
}
