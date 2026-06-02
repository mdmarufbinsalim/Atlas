import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type BlockElement = { type: 'block'; children: Text[] }
export type Text = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: BlockElement
    Text: Text
  }
}