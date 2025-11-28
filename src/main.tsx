import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { appRoutes } from './config/routes'
import { buildRoutes } from './utils/routeBuilder'

// Construir rutas automáticamente desde la configuración
const router = createBrowserRouter(buildRoutes(appRoutes))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
