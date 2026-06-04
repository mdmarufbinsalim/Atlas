import { Editor, Text, Transforms } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"

type EditorType = ReturnType<typeof withHistory<ReturnType<typeof withReact>>>

export function withDefaults(editor: EditorType) {
    const { normalizeNode } = editor
    editor.normalizeNode = ([node, path]) => {
        if (Text.isText(node) && node.mode === undefined) {
            Transforms.setNodes(editor, { mode: 'text' }, { at: path })
            return
        }
        normalizeNode([node, path])
    }
    return editor
}

export function toggleMark(editor: EditorType, mark: 'bold' | 'striked' | 'underlined') {
    const isActive = Editor.marks(editor)?.[mark] === true
    if (isActive) Editor.removeMark(editor, mark)
    else Editor.addMark(editor, mark, true)
}
