import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { ID, Note } from "../model";
import { scrollToElement } from "../util";
import RemarkMathPlugin from 'remark-math';
import RemarkHighlightPlugin from 'remark-highlight.js';
import { MarkdownRenderers } from "../util";
import { Draggable } from "react-beautiful-dnd";

type Props = {
    card: Note,
    id: ID,
    isFocused: boolean,
    isSelected: boolean,
    position: number,
}

export default React.memo((
    { card, id, isFocused, isSelected, position }: Props
): JSX.Element => {

    const ifFocused = isFocused ? "z-depth-3" : "";
    const ifSelected = isSelected ? "blue lighten-5" : "";
    const className = ["card-panel", ifFocused, ifSelected].join(" ");

    // A reference to this div so that we can scroll to it when focused
    const divRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null)

    useEffect(() => {
        const el = divRef.current
        if (el && isFocused) {
            console.log("Scrolling to", id);

            setTimeout(() => {
                scrollToElement(el)
            }, 20)
        }
    })
    
    // const setRef = (ref: HTMLDivElement | null) => {
    //     divRef.current = ref
    // };

    return (
        <Draggable draggableId={position.toString()} index={position}>
            {provided =>
                <div 
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className={className}>
                    <ReactMarkdown
                        source={card.contents}
                        plugins={[RemarkMathPlugin, RemarkHighlightPlugin]}
                        renderers={MarkdownRenderers as any}
                    />
                </div>
            }
        </Draggable>
    )
})