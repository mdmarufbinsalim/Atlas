import { PiDotsSixVerticalBold, PiPlus } from "react-icons/pi";
import { RenderElementProps } from "slate-react";

export default function Block({ attributes, children }: RenderElementProps) {

    return (
        <div {...attributes} className="group flex items-start gap-2 selection:bg-editor-text-selection">
            <div className="min-h-6 flex items-center gap-1">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-grab" contentEditable={false} >
                    <PiPlus className="text-editor-text" />
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-grab" contentEditable={false} >
                    <PiDotsSixVerticalBold className="text-editor-text"/>
                </div>
            </div>
            {children}
        </div>
    );
}

