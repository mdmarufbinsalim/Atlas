"use client"
import { useCallback, useState } from "react"
import {
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core"
import { Transforms } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"

type AtlasEditor = ReturnType<typeof withHistory<ReturnType<typeof withReact>>>

export function useDragSort(editor: AtlasEditor) {
    const [activeId, setActiveId] = useState<number | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    )

    const handleDragStart = useCallback(({ active }: DragStartEvent) => {
        setActiveId(active.id as number)
    }, [])

    const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
        setActiveId(null)
        if (!over || active.id === over.id) return

        const from = active.id as number
        const overIndex = over.id as number

        const translated = active.rect.current.translated
        const dropBefore = translated
            ? (translated.top + translated.height / 2) < (over.rect.top + over.rect.height / 2)
            : false

        let to = dropBefore ? overIndex : overIndex + 1
        if (from < overIndex) to -= 1

        Transforms.moveNodes(editor, { at: [from], to: [to] })
    }, [editor])

    return { activeId, sensors, handleDragStart, handleDragEnd }
}
