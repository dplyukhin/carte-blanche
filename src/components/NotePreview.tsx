import React from "react";
import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from 'remark-math';
import RemarkHighlightPlugin from 'remark-highlight.js';
import { Card } from "../model";
import { MarkdownRenderers } from "../util";

type Props = {
    card: Card,
}

export default React.memo(({ card }: Props): JSX.Element => {
    if (card.type === 'index') {
        return (
            <div className="card-panel truncate">
                {`Index: (${card.contents.length} cards)`}
            </div>
        )
    }
    else {
        const words = card.contents.split(" ");
        const preview = words.length > 20
            ? words.slice(0, 20).join(" ") + "..."
            : card.contents;

        return (
            <div className="card-panel">
                <ReactMarkdown
                    source={preview}
                    plugins={[RemarkMathPlugin, RemarkHighlightPlugin]}
                    renderers={MarkdownRenderers as any}
                />
            </div>
        )
    }
})