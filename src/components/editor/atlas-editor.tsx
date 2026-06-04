"use client"
import { useCallback, useState } from "react"
import { createEditor, Descendant } from "slate"
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react"
import { withHistory } from "slate-history"
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import Leaf from "./elements/leaf"
import Block from "./elements/block"
import SlashMenu from "../slash-menu"
import SelectionToolbar from "../selection-toolbar"
import BlockSpacerTooltip from "./composition/block-spacer"
import BlockDragOverlay from "./composition/block-drag-overlay"
import { withDefaults } from "./editor-plugins"
import { useSlashMenu } from "./hooks/useSlashMenu"
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts"
import { useDragSort } from "./hooks/useDragSort"
import { useSpacerClick } from "./hooks/useSpacerClick"

const initialValue: Descendant[] = [
    {
        type: 'block',
        children: [{ text: 'First line of text.', mode: 'text' }],
    },
    {
        type: 'block',
        children: [{ text: 'Second line of text.', mode: 'header_4' }, { text: 'Second line of text.', mode: 'text' }],
    },
]

export default function AtlasEditor() {
    const [editor] = useState(() => withDefaults(withHistory(withReact(createEditor()))))
    const { slashState, handleChange, handleSlashSelect, closeSlash } = useSlashMenu(editor)
    const handleKeyDown = useKeyboardShortcuts(editor, { slashOpen: !!slashState, closeSlash })
    const { activeId, sensors, handleDragStart, handleDragEnd } = useDragSort(editor)
    const handleSpacerClick = useSpacerClick(editor)

    const renderElement = useCallback((props: RenderElementProps) => {
        switch (props.element.type) {
            case 'block': return <Block {...props} />
            default: return <div />
        }
    }, [])

    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
                <div className="flex flex-col flex-1 border w-full overflow-y-auto bg-editor-background">
                    <SortableContext items={editor.children.map((_, i) => i)} strategy={verticalListSortingStrategy}>
                        <Editable
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            onKeyDown={handleKeyDown}
                            className="flex flex-col outline-0 text-editor-text gap-1 px-2 py-3 sm:px-6 sm:py-6"
                            style={{ lineHeight: 0, fontSize: 0 }}
                        />
                    </SortableContext>
                    <BlockSpacerTooltip onClick={handleSpacerClick} />
                </div>
                <SelectionToolbar />
                <DragOverlay dropAnimation={{ duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    {activeId !== null && <BlockDragOverlay blockIndex={activeId} />}
                </DragOverlay>
                {slashState && (
                    <SlashMenu
                        anchor={slashState.anchor}
                        query={slashState.query}
                        onSelect={handleSlashSelect}
                        onClose={closeSlash}
                    />
                )}
            </Slate>
        </DndContext>
    )
}
