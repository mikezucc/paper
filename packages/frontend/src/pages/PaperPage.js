import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import styles from '../styles/components.module.css';
export function PaperPage() {
    const { slug } = useParams();
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!slug)
            return;
        api.get(`/papers/${slug}`)
            .then(({ paper }) => setPaper(paper))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [slug]);
    useEffect(() => {
        const handleScroll = () => {
            const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            const progressBar = document.getElementById('reading-progress');
            if (progressBar) {
                progressBar.style.transform = `scaleX(${progress})`;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    if (loading) {
        return _jsx("div", { className: styles.contentContainer, children: "Loading..." });
    }
    if (error || !paper) {
        return _jsx("div", { className: styles.contentContainer, children: "Paper not found" });
    }
    return (_jsxs(_Fragment, { children: [_jsx("div", { id: "reading-progress", className: styles.readingProgress, style: { transform: 'scaleX(0)' } }), _jsxs("article", { className: styles.contentContainer, children: [_jsxs("header", { style: { marginBottom: 'var(--space-xl)' }, children: [_jsx("h1", { children: paper.title }), _jsxs("div", { className: styles.paperMeta, children: ["By ", paper.user?.email, " \u2022 ", new Date(paper.createdAt).toLocaleDateString()] }), paper.abstract && (_jsx("p", { style: { fontSize: 'var(--size-lg)', fontStyle: 'italic', marginTop: 'var(--space-md)' }, children: paper.abstract })), paper.tags.length > 0 && (_jsx("div", { className: styles.tags, style: { marginTop: 'var(--space-md)' }, children: paper.tags.map((tag) => (_jsx("span", { className: styles.tag, children: tag }, tag))) }))] }), _jsx(MarkdownRenderer, { content: paper.content || '' })] })] }));
}
