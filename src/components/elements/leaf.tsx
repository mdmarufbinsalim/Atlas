import { RenderLeafProps } from "slate-react";

export default function Leaf({ attributes, children, leaf }: RenderLeafProps) {

    return (
        <span {...attributes} className="font-mono" >
            {children}
        </span>
    );
}