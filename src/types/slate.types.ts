import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type Mode = 'header_1' | 'header_2' | 'header_3' | 'header_4' | 'text'


export type FormattedText = {
  text: string
  bold?: boolean
  striked?: boolean
  underlined?: boolean
  mode?: Mode
}

export type BlockElement = { type: 'block'; children: FormattedText[] }

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor
        Element: BlockElement
        Text: FormattedText
    }
}
