import { RenderLeafProps } from "slate-react"
import { Mode } from "@/types/slate.types"
import { cn } from "@/lib/utils"

const MODE_CLASSES: Record<Mode, string> = {
    header_1: 'text-4xl font-bold',
    header_2: 'text-3xl font-semibold',
    header_3: 'text-2xl font-semibold',
    header_4: 'text-xl font-medium',
    text: 'text-base',
}

export default function Leaf({ attributes, children, leaf }: RenderLeafProps) {
    const decorations = [
        leaf.underlined && 'underline',
        leaf.striked && 'line-through',
    ].filter(Boolean).join(' ')

    return (
        <span
            {...attributes}
            className={cn(
                'font-mono',
                leaf.mode && MODE_CLASSES[leaf.mode],
                leaf.bold && 'font-extrabold',
            )}
            style={decorations ? { textDecorationLine: decorations } : undefined}
        >
            {children}
        </span>
    )
}
