import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'

export const Layout = () => {
  const location = useLocation()
  // Ocultar navbar en login
  const hideNavbar = location.pathname === '/login'

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {!hideNavbar && <Navbar />}
      {/* Añadir padding-top si hay navbar para evitar que el contenido quede oculto */}
      <div className={!hideNavbar ? 'pt-16' : ''}>
        <Outlet />
      </div>
    </div>
  )
}
