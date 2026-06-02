"use client"
import { createContext, useContext, useState } from "react"

export type DragState = {
    draggingIndex: number
    targetIndex: number
    before: boolean
    active: boolean   // false until pointer moves past threshold
} | null

type DragCtx = {
    dragState: DragState
    setDragState: (s: DragState) => void
}

const DragContext = createContext<DragCtx>({
    dragState: null,
    setDragState: () => {},
})

export function DragProvider({ children }: { children: React.ReactNode }) {
    const [dragState, setDragState] = useState<DragState>(null)
    return (
        <DragContext.Provider value={{ dragState, setDragState }}>
            {children}
        </DragContext.Provider>
    )
}

export function useDragContext() {
    return useContext(DragContext)
}
