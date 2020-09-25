import React from 'react';
import ReactMarkdown from "react-markdown"
import { BlockMath, InlineMath } from 'react-katex';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export function scrollToElement(el: HTMLElement) {
    el.scrollIntoView({ behavior: "smooth", block: "center" })
}

export const MarkdownRenderers: ReactMarkdown.Renderers = {
    math: ({ value }) => <BlockMath>{value}</BlockMath>,
    inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
    code: ({ language, value }) => <SyntaxHighlighter language={language} style={docco}>{value}</SyntaxHighlighter>
}