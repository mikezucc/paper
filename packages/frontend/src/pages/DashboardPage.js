import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import styles from '../styles/components.module.css';
export function DashboardPage() {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get('/papers/user/papers')
            .then(({ papers }) => setPapers(papers))
            .finally(() => setLoading(false));
    }, []);
    const handleDelete = async (paperId) => {
        if (confirm('Are you sure you want to delete this paper?')) {
            await api.delete(`/papers/${paperId}`);
            setPapers(papers.filter(p => p.id !== paperId));
        }
    };
    if (loading) {
        return _jsx("div", { className: styles.container, children: "Loading..." });
    }
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h1", { children: "My Papers" }), _jsx(Link, { to: "/editor", children: "New Paper" })] }), papers.length === 0 ? (_jsx("p", { children: "You haven't created any papers yet." })) : (_jsx("div", { style: { marginTop: 'var(--space-lg)' }, children: papers.map((paper) => (_jsx("div", { style: {
                        padding: 'var(--space-md)',
                        border: '1px solid var(--color-border)',
                        marginBottom: 'var(--space-md)',
                    }, children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("h2", { className: styles.paperTitle, children: paper.title }), _jsxs("div", { className: styles.paperMeta, children: [paper.published ? 'Published' : 'Draft', " \u2022 ", new Date(paper.updatedAt).toLocaleDateString()] }), _jsx("p", { className: styles.paperAbstract, children: paper.abstract })] }), _jsxs("div", { style: { display: 'flex', gap: 'var(--space-sm)' }, children: [_jsx(Link, { to: `/editor/${paper.id}`, children: "Edit" }), paper.published && (_jsx(Link, { to: `/paper/${paper.slug}`, children: "View" })), _jsx("button", { onClick: () => handleDelete(paper.id), children: "Delete" })] })] }) }, paper.id))) }))] }));
}
