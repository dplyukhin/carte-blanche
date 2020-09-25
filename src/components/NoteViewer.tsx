import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { ID, Note } from "../model";
import { scrollToElement } from "../util";
import RemarkMathPlugin from 'remark-math';
import RemarkHighlightPlugin from 'remark-highlight.js';
import { MarkdownRenderers } from "../util";

type Props = { 
    card: Note, 
    id: ID, 
    isFocused: boolean, 
    isSelected: boolean 
}

export default React.memo((
  {card, id, isFocused, isSelected}: Props
): JSX.Element => {

  const ifFocused = isFocused ? "z-depth-3" : "";
  const ifSelected = isSelected ? "blue lighten-5" : "";
  const className = ["card-panel", ifFocused, ifSelected].join(" ");

  const ref: React.MutableRefObject<HTMLDivElement | null> = useRef(null)

  useEffect( () => {
    const el = ref.current
    if (el && isFocused) {
      console.log("Scrolling to", id);

      setTimeout(() => {
        scrollToElement(el)
      }, 20)
    }
  })

  return (
    <div className={className} ref={ref}>
      <ReactMarkdown 
        source={card.contents}
        plugins={[RemarkMathPlugin, RemarkHighlightPlugin]}
        renderers={MarkdownRenderers as any}
      />
    </div>
  )
})