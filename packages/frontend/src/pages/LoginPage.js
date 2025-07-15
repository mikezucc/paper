import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import styles from '../styles/components.module.css';
export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState('email');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/request-code', { email });
            setStep('code');
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { sessionId } = await api.post('/auth/verify-code', { email, code });
            login(sessionId);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: styles.contentContainer, children: [_jsx("h1", { children: "Login" }), step === 'email' ? (_jsxs("form", { onSubmit: handleRequestCode, className: styles.form, children: [_jsxs("div", { className: styles.formGroup, children: [_jsx("label", { htmlFor: "email", className: styles.label, children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, autoFocus: true })] }), error && _jsx("div", { className: styles.error, children: error }), _jsx("button", { type: "submit", disabled: loading, children: loading ? 'Sending...' : 'Send Code' })] })) : (_jsxs("form", { onSubmit: handleVerifyCode, className: styles.form, children: [_jsxs("p", { children: ["Enter the 6-digit code sent to ", email] }), _jsxs("div", { className: styles.formGroup, children: [_jsx("label", { htmlFor: "code", className: styles.label, children: "Verification Code" }), _jsx("input", { id: "code", type: "text", value: code, onChange: (e) => setCode(e.target.value), pattern: "[0-9]{6}", maxLength: 6, required: true, autoFocus: true })] }), error && _jsx("div", { className: styles.error, children: error }), _jsx("button", { type: "submit", disabled: loading, children: loading ? 'Verifying...' : 'Verify' }), _jsx("button", { type: "button", onClick: () => setStep('email'), children: "Use different email" })] }))] }));
}
