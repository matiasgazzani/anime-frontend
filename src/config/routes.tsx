import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import Series from '../pages/Series'
import Serie from '../pages/Serie'
import { AddSerie } from '../pages/AddSerie'
import { EditSerie } from '../pages/EditSerie'
import { Layout } from '../components/Layout'

export interface AppRoute {
  /** Ruta del path */
  path: string
  /** Elemento React a renderizar */
  element: React.ReactNode
  /** Si true, la ruta requiere autenticación */
  protected?: boolean
  /** Si true, la ruta solo es accesible para usuarios no autenticados */
  publicOnly?: boolean
  /** Título de la página (opcional, para SEO o breadcrumbs) */
  title?: string
  /** Subrutas anidadas (opcional) */
  children?: AppRoute[]
}

/**
 * Configuración centralizada de rutas de la aplicación
 *
 * - protected: true -> Requiere autenticación (Dashboard, Series, etc.)
 * - publicOnly: true -> Solo para usuarios NO autenticados (Login)
 * - Sin flags -> Accesible para todos (Home)
 */
export const appRoutes: AppRoute[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      // ═══════════════════════════════════════════════════════════
      // 🌐 RUTAS PÚBLICAS - Accesibles sin autenticación
      // ═══════════════════════════════════════════════════════════
      {
        path: '/',
        element: <Home />,
        title: 'Inicio'
      },
      {
        path: '/login',
        element: <Login />,
        publicOnly: true, // Redirige al dashboard si ya está autenticado
        title: 'Iniciar Sesión'
      },

      // ═══════════════════════════════════════════════════════════
      // 🔒 RUTAS PROTEGIDAS - Requieren autenticación
      // ═══════════════════════════════════════════════════════════
      {
        path: '/dashboard',
        element: <Dashboard />,
        protected: true,
        title: 'Dashboard'
      },
      {
        path: '/series',
        element: <Series />,
        protected: true,
        title: 'Series'
      },
      {
        path: '/series/add',
        element: <AddSerie />,
        protected: true,
        title: 'Añadir Serie'
      },
      {
        path: '/series/edit/:id',
        element: <EditSerie />,
        protected: true,
        title: 'Editar Serie'
      },
      {
        path: '/series/:id',
        element: <Serie />,
        protected: true,
        title: 'Detalles de Serie'
      }
    ]
  }
]
