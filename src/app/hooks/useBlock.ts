import { useDndContext } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { useCallback } from "react"
import { Transforms } from "slate"
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react"
import { useShowSlashMenuPrompt } from "./useShowSlashMenuPrompt"

export function useBlock({ element }: Pick<RenderElementProps, "element">) {
    const editor = useSlateStatic()
    const { showSlashMenuPrompt } = useShowSlashMenuPrompt(element)

    const index = ReactEditor.findPath(editor, element)[0]

    const { setNodeRef, listeners, isDragging } = useSortable({ id: index })

    const { active, over } = useDndContext()

    const isOver = !!over && over.id === index && active?.id !== index

    let dropBefore = false
    if (isOver && active && over) {
        const translated = active.rect.current.translated
        if (translated) {
            const activeCenter = translated.top + translated.height / 2
            const overCenter = over.rect.top + over.rect.height / 2
            dropBefore = activeCenter < overCenter
        }
    }

    const activeIndex = active?.id as number | undefined
    const isNoOp = activeIndex !== undefined && (
        (!dropBefore && index === activeIndex - 1) ||
        (dropBefore && index === activeIndex + 1)
    )

    const isDropTarget = isOver && !isNoOp

    const handleAddBlock = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault()
        Transforms.insertNodes(editor, { type: 'block', children: [{ text: '', mode: 'text' }] }, { at: [index + 1] })
        Transforms.select(editor, { anchor: { path: [index + 1, 0], offset: 0 }, focus: { path: [index + 1, 0], offset: 0 } })
        ReactEditor.focus(editor)
    }, [editor, index])

    return {
        showSlashMenuPrompt,
        isDragging,
        isDropTarget,
        dropBefore,
        setNodeRef,
        listeners,
        handleAddBlock,
    }
}
