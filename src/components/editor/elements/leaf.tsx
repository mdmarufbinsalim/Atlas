import { RenderLeafProps } from "slate-react"
import { Mode } from "@/types/slate.types"
import { cn } from "@/lib/utils"

const MODE_CLASSES: Record<Mode, string> = {
    header_1: "text-[36px] font-bold !leading-[48px] inline",
    header_2: "text-[28px] font-semibold !leading-[48px] inline",
    header_3: "text-[22px] font-semibold !leading-[48px] inline",
    header_4: "text-[19px] font-medium !leading-[48px] inline",
    text: "text-[16px] !leading-[48px] inline",
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
                "font-mono",
                leaf.mode && MODE_CLASSES[leaf.mode] || "text-xs",
                leaf.bold && "font-extrabold",
            )}
            style={{
                verticalAlign: "baseline",
                ...(decorations ? { textDecorationLine: decorations } : {}),
            }}
        >
            {children}
        </span>
    )
}