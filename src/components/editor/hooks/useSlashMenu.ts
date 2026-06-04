"use client"
import { useCallback, useState } from "react"
import { Editor, Text, Transforms } from "slate"
import { ReactEditor } from "slate-react"
import { Mode } from "@/types/slate.types"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"

type AtlasEditor = ReturnType<typeof withHistory<ReturnType<typeof withReact>>>

type SlashState = {
    query: string
    anchor: { top: number; bottom: number; left: number; right: number }
    slashOffset: number
} | null

export function useSlashMenu(editor: AtlasEditor) {
    const [slashState, setSlashState] = useState<SlashState>(null)

    const handleChange = useCallback(() => {
        const { selection } = editor
        if (!selection) { setSlashState(null); return }

        const [node] = Editor.node(editor, selection.focus.path)
        if (!Text.isText(node)) { setSlashState(null); return }

        const textBefore = node.text.slice(0, selection.focus.offset)
        const slashIdx = textBefore.lastIndexOf('/')

        if (slashIdx !== -1) {
            const query = textBefore.slice(slashIdx + 1)
            if (!query.includes(' ')) {
                const domSel = window.getSelection()
                if (domSel?.rangeCount) {
                    const rect = domSel.getRangeAt(0).getBoundingClientRect()
                    setSlashState({ query, anchor: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right }, slashOffset: slashIdx })
                    return
                }
            }
        }

        setSlashState(null)
    }, [editor])

    const handleSlashSelect = useCallback((mode: Mode) => {
        if (!slashState || !editor.selection) return

        const path = [...editor.selection.focus.path]
        const currentOffset = editor.selection.focus.offset

        Transforms.delete(editor, {
            at: { anchor: { path, offset: slashState.slashOffset }, focus: { path, offset: currentOffset } }
        })

        Editor.addMark(editor, 'mode', mode)
        setSlashState(null)
        ReactEditor.focus(editor)
    }, [editor, slashState])

    const closeSlash = useCallback(() => setSlashState(null), [])

    return { slashState, handleChange, handleSlashSelect, closeSlash }
}
