# 📍 Sistema de Routing Dinámico

## 🚀 Características

Este sistema de routing mejora significativamente la gestión de rutas en la aplicación:

✅ **Configuración Centralizada** - Todas las rutas en un solo lugar  
✅ **Declarativo y Tipo-Seguro** - TypeScript garantiza rutas correctas  
✅ **Protección Automática** - Sin wrapper manual de componentes  
✅ **Fácil de Mantener** - Agregar rutas es muy simple  
✅ **Escalable** - Soporta rutas anidadas y metadata

## 📁 Estructura de Archivos

```
src/
├── config/
│   └── routes.tsx          # ⭐ Configuración de rutas
├── utils/
│   └── routeBuilder.tsx    # 🔧 Constructor automático de rutas
└── main.tsx                # 🎯 Punto de entrada simplificado
```

## 📝 Cómo Agregar una Nueva Ruta

### 1️⃣ Ruta Pública (Accesible para todos)

```tsx
// En src/config/routes.tsx
{
  path: "/about",
  element: <About />,
  title: "Acerca de",
}
```

### 2️⃣ Ruta Protegida (Solo usuarios autenticados)

```tsx
// En src/config/routes.tsx
{
  path: "/profile",
  element: <Profile />,
  protected: true,  // 🔒 Requiere login
  title: "Mi Perfil",
}
```

### 3️⃣ Ruta Solo para Invitados (Usuarios NO autenticados)

```tsx
// En src/config/routes.tsx
{
  path: "/register",
  element: <Register />,
  publicOnly: true,  // ⛔ Redirige si ya está logueado
  title: "Registro",
}
```

## 🔧 Tipos de Rutas

| Propiedad    | Tipo      | Descripción                                              |
|------------- |---------- |--------------------------------------------------------- |
| `path`       | `string`  | Ruta URL (ej: `/dashboard`, `/series/:id`)              |
| `element`    | `JSX`     | Componente React a renderizar                            |
| `protected`  | `boolean` | `true` si requiere autenticación                         |
| `publicOnly` | `boolean` | `true` si solo es accesible sin autenticación            |
| `title`      | `string`  | Título de la página (opcional, para SEO/breadcrumbs)     |
| `children`   | `array`   | Rutas anidadas (opcional)                                |

## 🎯 Beneficios vs Sistema Anterior

### ❌ **Antes** (Sistema Manual)

```tsx
// main.tsx - Muy repetitivo y difícil de mantener
const protectedRoutes = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/series",
    element: (
      <ProtectedRoute>
        <Series />
      </ProtectedRoute>
    ),
  },
  // ... más rutas con el mismo wrapper repetido
];
```

### ✅ **Ahora** (Sistema Dinámico)

```tsx
// config/routes.tsx - Simple y declarativo
export const appRoutes: AppRoute[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    protected: true,
    title: "Dashboard",
  },
  {
    path: "/series",
    element: <Series />,
    protected: true,
    title: "Series",
  },
  // ... agregar más rutas es tan fácil como copiar y pegar
];
```

## 🔐 Lógica de Protección

El sistema maneja **automáticamente** tres escenarios:

1. **Rutas Protegidas** (`protected: true`)
   - Usuario autenticado → ✅ Accede normalmente
   - Usuario NO autenticado → 🔀 Redirige a `/login`

2. **Rutas Solo Públicas** (`publicOnly: true`)
   - Usuario autenticado → 🔀 Redirige a `/dashboard`
   - Usuario NO autenticado → ✅ Accede normalmente

3. **Rutas Públicas** (sin flags)
   - Cualquier usuario → ✅ Accede normalmente

## 🛠️ Mantenimiento Futuro

### Agregar una nueva página

1. Crea el componente en `src/pages/`
2. Importa el componente en `src/config/routes.tsx`
3. Agrega la configuración al array `appRoutes`

¡Eso es todo! No necesitas tocar `main.tsx` ni ningún otro archivo.

### Modificar comportamiento de protección

Edita `src/utils/routeBuilder.tsx` para cambiar cómo se envuelven las rutas.

## 💡 Ejemplo Completo

```tsx
// src/config/routes.tsx
import { Profile } from "../pages/Profile";

export const appRoutes: AppRoute[] = [
  // ... rutas existentes
  
  {
    path: "/profile",
    element: <Profile />,
    protected: true,
    title: "Mi Perfil",
  },
];
```

**¡Listo!** La ruta automáticamente:
- ✅ Se envuelve con `<ProtectedRoute>`
- ✅ Redirige a login si no hay autenticación
- ✅ Se integra con el router de React
