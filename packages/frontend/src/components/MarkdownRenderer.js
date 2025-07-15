import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});
export function MarkdownRenderer({ content }) {
    const html = useMemo(() => md.render(content), [content]);
    return (_jsx("div", { className: "markdown-content", dangerouslySetInnerHTML: { __html: html } }));
}
