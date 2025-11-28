import { createContext, useContext, useState, type ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  profile_img?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user')
    const maxAge = localStorage.getItem('max_age') || '0'
    return savedUser && parseInt(maxAge) > Date.now()
      ? JSON.parse(savedUser)
      : null
  })

  const login = async (email: string, password: string) => {
    // Aquí iría tu lógica de autenticación real
    // Por ahora, simulamos un login

    const res = await fetch('http://localhost:4000/api/auth/login', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error('Credenciales Invalidas')
    const data = await res.json()
    const { id, name, profile_img, token, maxAge } = data.user
    localStorage.setItem('id', id)
    localStorage.setItem('name', name)
    localStorage.setItem('profile_img', profile_img)
    localStorage.setItem('auth_token', token)
    localStorage.setItem('max_age', Date.now() + maxAge)

    const mockUser: User = {
      id: '1',
      email,
      name: 'Usuario Demo',
      profile_img: profile_img || 'https://ui-avatars.com/api/?name=Usuario+Demo&background=random'
    }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  const logout = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/logout', {
        credentials: 'include',
        method: 'POST'
      })
      const data = await res.json()
      localStorage.clear()
      setUser(null)
      return data
    } catch (error) {
      // Incluso si falla la petición, limpiamos el estado local
      localStorage.clear()
      setUser(null)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !(user == null),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
