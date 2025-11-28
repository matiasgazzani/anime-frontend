# 🎬 AnimeDB

**AnimeDB** es una aplicación web moderna y elegante diseñada para gestionar tu colección personal de anime. Construida con las últimas tecnologías web, ofrece una experiencia de usuario premium con un diseño "Glassmorphism", animaciones fluidas y una integración robusta con APIs externas.

![AnimeDB Banner](https://via.placeholder.com/1200x400?text=AnimeDB+Dashboard+Preview)

## ✨ Características Principales

*   **🎨 Diseño Premium**: Interfaz de usuario moderna con estética oscura, efectos de vidrio (glassmorphism), gradientes dinámicos y micro-interacciones.
*   **🔐 Autenticación Segura**: Sistema completo de login y gestión de sesiones de usuario.
*   **📚 Gestión de Colección**:
    *   Explora tu biblioteca de anime con filtrado avanzado.
    *   Añade nuevas series a tu colección.
    *   Edita detalles y actualiza tu progreso (episodios vistos, calificación, estado).
*   **📊 Dashboard Personal**: Visualiza estadísticas rápidas sobre tu progreso y actividad.
*   **🔗 Integración con Jikan API**: Obtiene automáticamente sinopsis, trailers y metadatos adicionales desde MyAnimeList.
*   **📱 Totalmente Responsivo**: Experiencia fluida en escritorio, tablets y móviles.

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con un stack moderno y eficiente:

*   **Frontend Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/) (Rápido y ligero)
*   **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) (Utility-first CSS)
*   **Routing**: [React Router v7](https://reactrouter.com/)
*   **Calidad de Código**: [ts-standard](https://github.com/standard/ts-standard) (Linter & Formatter)
*   **Iconos**: SVG nativos y componentes personalizados.

## 🚀 Comenzando

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### Prerrequisitos

*   Node.js (v18 o superior recomendado)
*   npm o pnpm

### Instalación

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/tu-usuario/animedb.git
    cd animedb
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    # o si usas pnpm
    pnpm install
    ```

3.  **Configurar Variables de Entorno**
    Asegúrate de tener el backend corriendo (por defecto en `http://localhost:4000`).

4.  **Iniciar el servidor de desarrollo**
    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:5173`.

## 📂 Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables (Navbar, Card, Modal, etc.)
├── config/          # Configuraciones globales (Rutas, constantes)
├── contexts/        # Contextos de React (AuthContext)
├── pages/           # Vistas principales (Home, Series, Dashboard, Login)
├── services/        # Lógica de comunicación con APIs (series, nexos)
├── utils/           # Utilidades y helpers
└── main.tsx         # Punto de entrada de la aplicación
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar AnimeDB, siéntete libre de abrir un issue o enviar un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

Desarrollado con ❤️ para los amantes del anime.
