import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/components.module.css';
export function Layout() {
    const { user, logout } = useAuth();
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: styles.header, children: _jsx("div", { className: styles.container, children: _jsxs("nav", { className: styles.nav, children: [_jsx(Link, { to: "/", className: styles.logo, children: "Paper" }), _jsxs("ul", { className: styles.navLinks, children: [_jsx("li", { children: _jsx(Link, { to: "/", children: "Browse" }) }), user ? (_jsxs(_Fragment, { children: [_jsx("li", { children: _jsx(Link, { to: "/dashboard", children: "Dashboard" }) }), _jsx("li", { children: _jsx(Link, { to: "/editor", children: "New Paper" }) }), _jsx("li", { children: _jsx("button", { onClick: logout, children: "Logout" }) })] })) : (_jsx("li", { children: _jsx(Link, { to: "/login", children: "Login" }) }))] })] }) }) }), _jsx("main", { children: _jsx(Outlet, {}) })] }));
}
