"use client"
import { useCallback, useState } from "react"
import { createEditor, Descendant, Editor, Text, Transforms } from "slate"
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react"
import Leaf from "./elements/leaf"
import Block from "./elements/block"
import SlashMenu from "./slash-menu"
import { Mode } from "@/types/slate.types"

const initialValue: Descendant[] = [
    {
        type: 'block',
        children: [{ text: 'First line of text.' }],
    },
    {
        type: 'block',
        children: [{ text: 'Second line of text.' }],
    },
]

type SlashState = {
    query: string
    anchor: { top: number; bottom: number; left: number; right: number }
    slashOffset: number
} | null

function toggleMark(editor: ReturnType<typeof withReact>, mark: 'bold' | 'striked' | 'underlined') {
    const isActive = Editor.marks(editor)?.[mark] === true
    if (isActive) Editor.removeMark(editor, mark)
    else Editor.addMark(editor, mark, true)
}

export default function AtlasEditor() {
    const [editor] = useState(() => withReact(createEditor()))
    const [slashState, setSlashState] = useState<SlashState>(null)

    const renderElement = useCallback((props: RenderElementProps) => {
        switch (props.element.type) {
            case 'block': return <Block {...props} />
            default: return <div />
        }
    }, [])

    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        const mod = e.metaKey || e.ctrlKey
        if (mod && e.key.toLowerCase() === 'b') { e.preventDefault(); toggleMark(editor, 'bold'); return }
        if (mod && e.key.toLowerCase() === 'u') { e.preventDefault(); toggleMark(editor, 'underlined'); return }
        if (mod && e.shiftKey && e.key.toLowerCase() === 's') { e.preventDefault(); toggleMark(editor, 'striked'); return }
        if (slashState && (e.key === ' ' || e.key === 'Escape')) setSlashState(null)
    }, [editor, slashState])

    const handleChange = useCallback((value: Descendant[]) => {
        void value
        const { selection } = editor
        if (!selection) { setSlashState(null); return }

        const [node] = Editor.node(editor, selection.focus.path)
        if (!Text.isText(node)) { setSlashState(null); return }

        const textBefore = node.text.slice(0, selection.focus.offset)
        const slashIdx = textBefore.lastIndexOf('/')

        if (slashIdx !== -1) {
            const query = textBefore.slice(slashIdx + 1)
            if (!query.includes(' ')) {
                const domSel = window.getSelection()
                if (domSel?.rangeCount) {
                    const rect = domSel.getRangeAt(0).getBoundingClientRect()
                    setSlashState({ query, anchor: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right }, slashOffset: slashIdx })
                    return
                }
            }
        }

        setSlashState(null)
    }, [editor])

    const handleSlashSelect = useCallback((mode: Mode) => {
        if (!slashState || !editor.selection) return

        const path = [...editor.selection.focus.path]
        const currentOffset = editor.selection.focus.offset

        Transforms.delete(editor, {
            at: { anchor: { path, offset: slashState.slashOffset }, focus: { path, offset: currentOffset } }
        })

        Editor.addMark(editor, 'mode', mode)

        setSlashState(null)
    }, [editor, slashState])

    return (
        <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
            <div className="flex flex-col flex-1 border w-full overflow-y-auto bg-editor-background">
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={handleKeyDown}
                    className="flex flex-col outline-0 text-editor-text gap-2"
                />
                <div className="flex-1 grow min-h-6" />
            </div>
            {slashState && (
                <SlashMenu
                    anchor={slashState.anchor}
                    query={slashState.query}
                    onSelect={handleSlashSelect}
                    onClose={() => setSlashState(null)}
                />
            )}
        </Slate>
    )
}
