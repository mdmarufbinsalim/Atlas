"use client"
import { useCallback, useState } from "react"
import { createEditor, Descendant, Element, Text, Transforms } from "slate"
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react"
import { withHistory } from "slate-history"
import Leaf from "./elements/leaf"
import Block from "./elements/block"
import SlashMenu from "../slash-menu"
import SelectionToolbar from "../selection-toolbar"
import { DragProvider } from "@/lib/drag-context"
import BlockSpacerTooltip from "./composition/block-spacer"
import { withDefaults } from "./editor-plugins"
import { useSlashMenu } from "./hooks/useSlashMenu"
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts"

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

    const renderElement = useCallback((props: RenderElementProps) => {
        switch (props.element.type) {
            case 'block': return <Block {...props} />
            default: return <div />
        }
    }, [])

    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

    const handleSpacerClick = useCallback(() => {
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

    return (
        <DragProvider>
            <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
                <div className="flex flex-col flex-1 border w-full overflow-y-auto bg-editor-background">
                    <Editable
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        onKeyDown={handleKeyDown}
                        className="flex flex-col outline-0 text-editor-text gap-1 px-2 py-3 sm:px-6 sm:py-6"
                        style={{ lineHeight: 0, fontSize: 0 }}
                    />
                    <BlockSpacerTooltip onClick={handleSpacerClick} />
                </div>
                <SelectionToolbar />
                {slashState && (
                    <SlashMenu
                        anchor={slashState.anchor}
                        query={slashState.query}
                        onSelect={handleSlashSelect}
                        onClose={closeSlash}
                    />
                )}
            </Slate>
        </DragProvider>
    )
}
