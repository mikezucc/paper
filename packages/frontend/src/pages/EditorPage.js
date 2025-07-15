import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { api } from '../utils/api';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import styles from '../styles/components.module.css';
export function EditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paper, setPaper] = useState(null);
    const [title, setTitle] = useState('');
    const [abstract, setAbstract] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [published, setPublished] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (id) {
            api.get(`/papers/user/papers`)
                .then(({ papers }) => {
                const paper = papers.find((p) => p.id === id);
                if (paper) {
                    setPaper(paper);
                    setTitle(paper.title);
                    setAbstract(paper.abstract);
                    setContent(paper.content || '');
                    setTags(paper.tags.join(', '));
                    setPublished(paper.published);
                }
            })
                .catch((err) => setError(err.message));
        }
    }, [id]);
    const handleSave = async () => {
        setError('');
        setSaving(true);
        try {
            const paperData = {
                title,
                abstract,
                content,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            };
            if (paper) {
                const updateData = { ...paperData, published };
                const { paper: updated } = await api.put(`/papers/${paper.id}`, updateData);
                setPaper(updated);
            }
            else {
                const createData = paperData;
                const { paper: created } = await api.post('/papers', createData);
                setPaper(created);
                navigate(`/editor/${created.id}`, { replace: true });
            }
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: styles.container, style: { padding: 'var(--space-md) 0' }, children: [_jsx("div", { style: { marginBottom: 'var(--space-md)' }, children: _jsxs("div", { className: styles.form, style: { maxWidth: '100%' }, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }, children: [_jsxs("div", { className: styles.formGroup, children: [_jsx("label", { htmlFor: "title", className: styles.label, children: "Title" }), _jsx("input", { id: "title", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Paper title" })] }), _jsxs("div", { className: styles.formGroup, children: [_jsx("label", { htmlFor: "tags", className: styles.label, children: "Tags (comma-separated)" }), _jsx("input", { id: "tags", value: tags, onChange: (e) => setTags(e.target.value), placeholder: "tag1, tag2, tag3" })] })] }), _jsxs("div", { className: styles.formGroup, children: [_jsx("label", { htmlFor: "abstract", className: styles.label, children: "Abstract" }), _jsx("textarea", { id: "abstract", value: abstract, onChange: (e) => setAbstract(e.target.value), placeholder: "Brief description of your paper", rows: 3 })] }), _jsxs("div", { style: { display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }, children: [_jsx("button", { onClick: handleSave, disabled: saving || !title, children: saving ? 'Saving...' : 'Save' }), paper && (_jsxs("label", { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }, children: [_jsx("input", { type: "checkbox", checked: published, onChange: (e) => setPublished(e.target.checked), style: { width: 'auto' } }), "Published"] })), _jsx(Link, { to: "/dashboard", children: "Back to Dashboard" })] }), error && _jsx("div", { className: styles.error, children: error })] }) }), _jsxs("div", { className: styles.editor, children: [_jsx("div", { className: styles.editorPane, children: _jsx(Editor, { height: "100%", defaultLanguage: "markdown", value: content, onChange: (value) => setContent(value || ''), theme: "vs-light", options: {
                                minimap: { enabled: false },
                                fontSize: 16,
                                fontFamily: 'Golos Text, monospace',
                                lineHeight: 24,
                                padding: { top: 16, bottom: 16 },
                                wordWrap: 'on',
                                lineNumbers: 'off',
                                folding: false,
                                scrollBeyondLastLine: false,
                            } }) }), _jsx("div", { className: styles.editorPane, children: _jsx("div", { className: styles.preview, children: _jsx(MarkdownRenderer, { content: content }) }) })] })] }));
}
