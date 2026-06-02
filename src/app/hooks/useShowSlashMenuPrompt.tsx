import { BlockElement } from "@/types/slate.types"
import { useMemo } from "react"
import { Range } from "slate"
import { useSelected, useSlate } from "slate-react"

export function useShowSlashMenuPrompt(element: BlockElement) {
    const selected = useSelected()
    const editor = useSlate()

    return useMemo(() => {
        const isEmpty = element.children.every(c => c.text === '')

        return (
            {
                showSlashMenuPrompt: selected &&
                    isEmpty &&
                    editor.selection &&
                    Range.isCollapsed(editor.selection)
            }
        )
    }, [selected, editor.selection, element])
}