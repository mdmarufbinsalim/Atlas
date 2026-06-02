import { useDragContext } from "@/lib/drag-context"
import { findDropTarget } from "@/lib/find-drop-target"
import { useRef } from "react"
import { Transforms } from "slate"
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react"
import { useShowSlashMenuPrompt } from "./useShowSlashMenuPrompt"

const DRAG_THRESHOLD = 5

export function useBlock({ element }: Pick<RenderElementProps, "element">) {
    const editor = useSlateStatic()
    const { showSlashMenuPrompt } = useShowSlashMenuPrompt(element)
    const { dragState, setDragState } = useDragContext()
    const startYRef = useRef(0)

    const index = ReactEditor.findPath(editor, element)[0]

    const isDragging = !!dragState?.active && dragState.draggingIndex === index
    const isTarget   = !!dragState?.active && dragState.targetIndex === index && dragState.draggingIndex !== index
    const dropBefore = isTarget && !!dragState?.before

    const handleAddBlock = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault()
        Transforms.insertNodes(editor, { type: 'block', children: [{ text: '', mode: 'text' }] }, { at: [index + 1] })
        Transforms.select(editor, { anchor: { path: [index + 1, 0], offset: 0 }, focus: { path: [index + 1, 0], offset: 0 } })
        ReactEditor.focus(editor)
    }

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault()
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        startYRef.current = e.clientY
        setDragState({ draggingIndex: index, targetIndex: index, before: false, active: false })
        document.body.style.cursor = 'grabbing'
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragState || dragState.draggingIndex !== index) return
        if (Math.abs(e.clientY - startYRef.current) < DRAG_THRESHOLD && !dragState.active) return

        const target = findDropTarget(editor, e.clientY)
        if (!target) return

        if (!dragState.active || dragState.targetIndex !== target.index || dragState.before !== target.before) {
            setDragState({ draggingIndex: index, targetIndex: target.index, before: target.before, active: true })
        }
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
        document.body.style.cursor = ''

        if (dragState?.active && dragState.draggingIndex !== dragState.targetIndex) {
            const { draggingIndex, targetIndex, before } = dragState
            let to = before ? targetIndex : targetIndex + 1
            if (draggingIndex < targetIndex) to -= 1
            Transforms.moveNodes(editor, { at: [draggingIndex], to: [to] })
        }

        setDragState(null)
    }

    return {
        showSlashMenuPrompt,
        isDragging, isTarget, dropBefore,
        handleAddBlock,
        handlePointerDown, handlePointerMove, handlePointerUp,
    }
}
