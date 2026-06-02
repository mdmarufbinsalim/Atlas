"use client"
import { useCallback, useState } from "react"
import { createEditor, Descendant } from "slate"
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact } from "slate-react"
import Leaf from "./elements/leaf"
import Block from "./elements/block"


const initialValue = [
    {
        type: 'block',
        children: [{ text: 'first line of text in a paragraph.' }],
    },
    {
        type: 'block',
        children: [{ text: 'second line of text in a paragraph.' }],
    },
] as Descendant[]


export default function AtlasEditor() {
    const [editor] = useState(() => withReact(createEditor()))


    const renderElement = useCallback((props: RenderElementProps) => {
        switch (props.element.type) {
            case 'block':
                return <Block {...props} />
            default:
                return <div />;
        }
    }, [])


    const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);


    return (
        <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={(e) => { console.log(e) }}
        >
            <div
                className="flex flex-col flex-1 border w-full overflow-y-auto bg-editor-background"
            >
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    className="flex flex-col outline-0 text-editor-text gap-2"
                />
                <div className="flex-1 grow min-h-6"/>
            </div>
        </Slate>
    )
}