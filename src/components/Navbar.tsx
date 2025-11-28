import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((menuRef.current != null) && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Series', path: '/series' },
    { name: 'Dashboard', path: '/dashboard' }
  ]

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Left: Logo */}
          <div className='flex-shrink-0'>
            <Link
              to='/'
              className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity'
            >
              AnimeDB
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className='hidden md:block'>
            <div className='flex items-center space-x-4'>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right: User Profile */}
          <div className='flex-shrink-0 relative' ref={menuRef}>
            {(user != null) ? (
              <div>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className='flex items-center space-x-3 focus:outline-none group'
                >
                  <span className='hidden md:block text-sm font-medium text-gray-300 group-hover:text-white transition-colors'>
                    {user.name}
                  </span>
                  <div className='relative'>
                    <img
                      className='h-9 w-9 rounded-full border-2 border-purple-500/30 group-hover:border-purple-500 transition-all object-cover'
                      src={user.profile_img || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={user.name}
                    />
                    <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-gray-900 ${isMenuOpen ? 'bg-green-500' : 'bg-gray-500'}`} />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className='absolute right-0 mt-2 w-48 rounded-xl bg-gray-800 border border-gray-700 shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-200 origin-top-right'>
                    <div className='px-4 py-3 border-b border-gray-700/50'>
                      <p className='text-sm text-white font-medium truncate'>{user.name}</p>
                      <p className='text-xs text-gray-400 truncate'>{user.email}</p>
                    </div>

                    <Link
                      to='/dashboard'
                      className='block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>

                    <Link
                      to='/series'
                      className='block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mis Series
                    </Link>

                    <div className='border-t border-gray-700/50 mt-1'>
                      <button
                        onClick={handleLogout}
                        className='block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors'
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to='/login'
                className='px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20'
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
