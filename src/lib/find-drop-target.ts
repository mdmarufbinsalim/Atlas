import { ReactEditor } from "slate-react"

export function findDropTarget(
    editor: ReactEditor,
    clientY: number
): { index: number; before: boolean } | null {
    const els = Array.from(
        document.querySelectorAll('[data-slate-node="element"]')
    ) as HTMLElement[]

    for (const el of els) {
        const rect = el.getBoundingClientRect()
        if (clientY >= rect.top && clientY <= rect.bottom) {
            try {
                const node = ReactEditor.toSlateNode(editor, el)
                const path = ReactEditor.findPath(editor, node)
                return { index: path[0], before: clientY < rect.top + rect.height / 2 }
            } catch { return null }
        }
    }

    const last = els[els.length - 1]
    if (last && clientY > last.getBoundingClientRect().bottom) {
        try {
            const node = ReactEditor.toSlateNode(editor, last)
            const path = ReactEditor.findPath(editor, node)
            return { index: path[0], before: false }
        } catch { return null }
    }

    return null
}
