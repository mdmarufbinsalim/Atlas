import { RenderLeafProps } from "slate-react"
import { Mode } from "@/types/slate.types"
import { cn } from "@/lib/utils"

const MODE_CLASSES: Record<Mode, string> = {
    header_1: "text-3xl font-bold leading-[48px]",
    header_2: "text-2xl font-semibold leading-[48px]",
    header_3: "text-xl font-semibold leading-[48px]",
    header_4: "text-md font-medium leading-[48px]",
    text: "text-xs leading-[48px]",
}

export default function Leaf({ attributes, children, leaf }: RenderLeafProps) {
    const decorations = [
        leaf.underlined && "underline",
        leaf.striked && "line-through",
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <span
            {...attributes}
            className={cn(
                "font-mono min-w-max h-12",
                leaf.mode && MODE_CLASSES[leaf.mode] || "text-xs leading-12",
                leaf.bold && "font-extrabold",
            )}
            style={
                decorations
                    ? { textDecorationLine: decorations }
                    : undefined
            }
        >
            {children}
        </span>
    )
}