import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900'>
      {/* Animated Background Blobs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000' />
      </div>

      <div className='relative z-10 max-w-4xl mx-auto px-6 py-20'>
        {/* Header */}
        <div className='flex justify-between items-center mb-12'>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent'>
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className='px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 font-semibold hover:bg-red-500/30 transition-all duration-300'
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Welcome Card */}
        <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 mb-8'>
          <h2 className='text-3xl font-bold text-white mb-4'>
            ¡Bienvenido, {user?.name}! 👋
          </h2>
          <p className='text-gray-400 mb-2'>
            <strong className='text-gray-300'>Email:</strong> {user?.email}
          </p>
          <p className='text-gray-400 text-sm'>
            Esta es una ruta protegida - solo usuarios autenticados pueden acceder
          </p>
        </div>

        {/* Quick Actions */}
        <div className='grid md:grid-cols-2 gap-6'>
          <button
            onClick={async () => await navigate('/series')}
            className='group p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:scale-105 text-left'
          >
            <div className='text-4xl mb-3'>📺</div>
            <h3 className='text-xl font-semibold text-white mb-2'>
              Ver Mi Colección
            </h3>
            <p className='text-gray-400 text-sm'>
              Explora y gestiona tu biblioteca de anime
            </p>
          </button>

          <button
            onClick={async () => await navigate('/')}
            className='group p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:scale-105 text-left'
          >
            <div className='text-4xl mb-3'>🏠</div>
            <h3 className='text-xl font-semibold text-white mb-2'>
              Ir al Inicio
            </h3>
            <p className='text-gray-400 text-sm'>
              Volver a la página principal
            </p>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}
      </style>
    </main>
  )
}
