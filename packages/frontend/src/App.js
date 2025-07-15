import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { PaperPage } from './pages/PaperPage';
import { EditorPage } from './pages/EditorPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
export function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(HomePage, {}) }), _jsx(Route, { path: "login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "paper/:slug", element: _jsx(PaperPage, {}) }), _jsx(Route, { path: "dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "editor/:id?", element: _jsx(ProtectedRoute, { children: _jsx(EditorPage, {}) }) })] }) }) }) }));
}
