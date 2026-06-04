"use client"
import { useCallback } from "react"
import { Editor, Text, Transforms } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { Mode } from "@/types/slate.types"
import { toggleMark } from "../editor-plugins"

type AtlasEditor = ReturnType<typeof withHistory<ReturnType<typeof withReact>>>

export function useKeyboardShortcuts(
    editor: AtlasEditor,
    { slashOpen, closeSlash }: { slashOpen: boolean; closeSlash: () => void }
) {
    return useCallback((e: React.KeyboardEvent) => {
        const mod = e.metaKey || e.ctrlKey

        if (mod && !e.shiftKey && e.key.toLowerCase() === 'z') { e.preventDefault(); editor.undo(); return }
        if (mod && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { e.preventDefault(); editor.redo(); return }
        if (mod && e.key.toLowerCase() === 'b') { e.preventDefault(); toggleMark(editor, 'bold'); return }
        if (mod && e.key.toLowerCase() === 'u') { e.preventDefault(); toggleMark(editor, 'underlined'); return }
        if (mod && e.shiftKey && e.key.toLowerCase() === 's') { e.preventDefault(); toggleMark(editor, 'striked'); return }
        if (slashOpen && (e.key === ' ' || e.key === 'Escape')) { closeSlash(); return }

        if (e.key === ' ' && editor.selection) {
            const { focus } = editor.selection
            const [node] = Editor.node(editor, focus.path)
            if (Text.isText(node)) {
                const textBefore = node.text.slice(0, focus.offset)
                const match = textBefore.match(/(?:^| )(#{1,5})$/)
                if (match) {
                    e.preventDefault()
                    const hashes = match[1]
                    const modeMap: Record<number, Mode> = { 1: 'header_1', 2: 'header_2', 3: 'header_3', 4: 'header_4', 5: 'text' }
                    Transforms.delete(editor, {
                        at: { anchor: { path: focus.path, offset: focus.offset - hashes.length }, focus: { path: focus.path, offset: focus.offset } }
                    })
                    Editor.addMark(editor, 'mode', modeMap[hashes.length])
                    return
                }
            }
        }
    }, [editor, slashOpen, closeSlash])
}
