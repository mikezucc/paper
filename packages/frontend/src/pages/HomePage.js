import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import styles from '../styles/components.module.css';
export function HomePage() {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get('/papers')
            .then(({ papers }) => setPapers(papers))
            .finally(() => setLoading(false));
    }, []);
    if (loading) {
        return _jsx("div", { className: styles.container, children: "Loading..." });
    }
    return (_jsxs("div", { className: styles.container, children: [_jsx("h1", { children: "Browse Papers" }), papers.length === 0 ? (_jsx("p", { children: "No papers published yet." })) : (_jsx("div", { className: styles.paperGrid, children: papers.map((paper) => (_jsxs(Link, { to: `/paper/${paper.slug}`, className: styles.paperCard, children: [_jsx("h2", { className: styles.paperTitle, children: paper.title }), _jsx("div", { className: styles.paperMeta, children: new Date(paper.createdAt).toLocaleDateString() }), _jsx("p", { className: styles.paperAbstract, children: paper.abstract }), paper.tags.length > 0 && (_jsx("div", { className: styles.tags, children: paper.tags.map((tag) => (_jsx("span", { className: styles.tag, children: tag }, tag))) }))] }, paper.id))) }))] }));
}
