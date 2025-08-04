import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { AuthProvider } from './contexts/AuthContext'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { PaperPage } from './pages/PaperPage'
import { EditorPage } from './pages/EditorPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'

interface RenderOptions {
  path: string
  paperData?: any
}

export function render({ path, paperData }: RenderOptions) {
  // For SSR, we'll pass paper data through context to avoid async fetching
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={path}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="paper/:slug" element={<PaperPage />} />
              <Route path="p/:slug" element={<PaperPage />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="editor/:id?"
                element={
                  <ProtectedRoute>
                    <EditorPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </StaticRouter>
    </React.StrictMode>
  )

  return { html, paperData }
}