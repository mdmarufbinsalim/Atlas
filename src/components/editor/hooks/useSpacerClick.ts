"use client"
import { useCallback } from "react"
import { Element, Text, Transforms } from "slate"
import { ReactEditor } from "slate-react"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"

type AtlasEditor = ReturnType<typeof withHistory<ReturnType<typeof withReact>>>

export function useSpacerClick(editor: AtlasEditor) {
    return useCallback(() => {
        const lastIndex = editor.children.length - 1
        const last = editor.children[lastIndex]
        const isEmpty = Element.isElement(last) && last.children.every(c => Text.isText(c) && c.text === '')

        if (isEmpty) {
            Transforms.select(editor, { anchor: { path: [lastIndex, 0], offset: 0 }, focus: { path: [lastIndex, 0], offset: 0 } })
        } else {
            Transforms.insertNodes(editor, { type: 'block', children: [{ text: '', mode: 'text' }] }, { at: [lastIndex + 1] })
            Transforms.select(editor, { anchor: { path: [lastIndex + 1, 0], offset: 0 }, focus: { path: [lastIndex + 1, 0], offset: 0 } })
        }
        ReactEditor.focus(editor)
    }, [editor])
}
