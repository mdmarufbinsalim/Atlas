"use client"
import { useCallback, useState } from "react"
import { createEditor, Descendant, Editor, Element, Text, Transforms } from "slate"
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react"
import { withHistory } from "slate-history"
import Leaf from "./elements/leaf"
import Block from "./elements/block"
import SlashMenu from "./slash-menu"
import SelectionToolbar from "./selection-toolbar"
import { DragProvider } from "@/lib/drag-context"
import { Mode } from "@/types/slate.types"

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

type SlashState = {
    query: string
    anchor: { top: number; bottom: number; left: number; right: number }
    slashOffset: number
} | null

function withDefaults(editor: ReturnType<typeof withHistory<ReturnType<typeof withReact>>>) {
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

function toggleMark(editor: ReturnType<typeof withHistory<ReturnType<typeof withReact>>>, mark: 'bold' | 'striked' | 'underlined') {
    const isActive = Editor.marks(editor)?.[mark] === true
    if (isActive) Editor.removeMark(editor, mark)
    else Editor.addMark(editor, mark, true)
}

export default function AtlasEditor() {
    const [editor] = useState(() => withDefaults(withHistory(withReact(createEditor()))))
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
        if (mod && !e.shiftKey && e.key.toLowerCase() === 'z') { e.preventDefault(); editor.undo(); return }
        if (mod && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { e.preventDefault(); editor.redo(); return }
        if (mod && e.key.toLowerCase() === 'b') { e.preventDefault(); toggleMark(editor, 'bold'); return }
        if (mod && e.key.toLowerCase() === 'u') { e.preventDefault(); toggleMark(editor, 'underlined'); return }
        if (mod && e.shiftKey && e.key.toLowerCase() === 's') { e.preventDefault(); toggleMark(editor, 'striked'); return }
        if (slashState && (e.key === ' ' || e.key === 'Escape')) { setSlashState(null); return }

        // Markdown heading shortcuts: # → H1, ## → H2, ### → H3, #### → H4
        if (e.key === ' ' && editor.selection) {
            const { focus } = editor.selection
            const [node] = Editor.node(editor, focus.path)
            if (Text.isText(node)) {
                const textBefore = node.text.slice(0, focus.offset)
                const match = textBefore.match(/(?:^| )(#{1,4})$/)
                if (match) {
                    e.preventDefault()
                    const hashes = match[1]
                    const modeMap: Record<number, Mode> = { 1: 'header_1', 2: 'header_2', 3: 'header_3', 4: 'header_4' }
                    Transforms.delete(editor, {
                        at: { anchor: { path: focus.path, offset: focus.offset - hashes.length }, focus: { path: focus.path, offset: focus.offset } }
                    })
                    Editor.addMark(editor, 'mode', modeMap[hashes.length])
                    return
                }
            }
        }
    }, [editor, slashState])

    const handleChange = useCallback((value: Descendant[]) => {
        console.log(value)
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
                        style={{
                            lineHeight: 0,
                            fontSize: 0,
                        }}
                    />
                    <div className="flex-1 grow min-h-6 cursor-text" onClick={handleSpacerClick} />
                </div>
                <SelectionToolbar />
                {slashState && (
                    <SlashMenu
                        anchor={slashState.anchor}
                        query={slashState.query}
                        onSelect={handleSlashSelect}
                        onClose={() => setSlashState(null)}
                    />
                )}
            </Slate>
        </DragProvider>
    )
}
