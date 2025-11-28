import type { RouteObject } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { PublicRoute } from '../components/PublicRoute'
import type { AppRoute } from '../config/routes'

/**
 * Construye las rutas finales envolviendo automáticamente los componentes
 * con ProtectedRoute o PublicRoute según la configuración.
 *
 * @param routes - Array de rutas configuradas con metadata
 * @returns Array de rutas listas para react-router-dom
 */
export function buildRoutes (routes: AppRoute[]): RouteObject[] {
  return routes.map((route) => {
    const { protected: isProtected, publicOnly, element, children, ...routeConfig } = route

    // Procesar hijos recursivamente si existen
    const processedChildren = (children != null) ? buildRoutes(children) : undefined

    // Configuración base con hijos procesados
    const baseRoute = {
      ...routeConfig,
      children: processedChildren
    }

    // Ruta protegida - Solo usuarios autenticados
    if (isProtected) {
      return {
        ...baseRoute,
        element: <ProtectedRoute>{element}</ProtectedRoute>
      }
    }

    // Ruta pública exclusiva - Solo usuarios NO autenticados
    if (publicOnly) {
      return {
        ...baseRoute,
        element: <PublicRoute>{element}</PublicRoute>
      }
    }

    // Ruta pública - Accesible para todos
    return {
      ...baseRoute,
      element
    }
  })
}
