import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/series')
    } catch (err) {
      setError(`${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center px-6'>
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Animated Background Blobs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 dark:opacity-20 animate-blob' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 dark:opacity-20 animate-blob animation-delay-2000' />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 dark:opacity-20 animate-blob animation-delay-4000' />
      </div>

      <div className='relative z-10 w-full max-w-md'>
        {/* Logo/Title */}
        <div className='text-center mb-8'>
          <h1 className='text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent'>
            Anime DB
          </h1>
          <p className='text-gray-600 dark:text-gray-400 text-lg'>Inicia sesión para continuar</p>
        </div>

        {/* Login Card */}
        <div className='bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email Field */}
            <div>
              <label className='block text-gray-700 dark:text-gray-300 font-semibold mb-2'>
                📧 Email
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300'
                placeholder='tu@email.com'
              />
            </div>

            {/* Password Field */}
            <div>
              <label className='block text-gray-700 dark:text-gray-300 font-semibold mb-2'>
                🔒 Contraseña
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border-2 border-gray-300 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300'
                placeholder='••••••••'
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3'>
                <span className='text-2xl'>⚠️</span>
                <p className='text-red-400 text-sm'>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            >
              {loading
                ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Iniciando sesión...
                  </span>
                  )
                : (
                    'Iniciar Sesión'
                  )}
            </button>
          </form>

          {/* Footer Links */}
          <div className='mt-6 text-center'>
            <button
              onClick={async () => await navigate('/')}
              className='text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 text-sm'
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
