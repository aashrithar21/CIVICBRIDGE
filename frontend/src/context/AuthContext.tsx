
import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { authAPI } from '../services/api'
import type { User, AuthResponse } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  departmentLogin: (department: string, email: string, password: string) => Promise<User>
  register: (data: {
    name: string
    email: string
    password: string
    phone?: string
  }) => Promise<User>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore the logged-in session when the application opens
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('civicbridge_token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await authAPI.getMe()
        setUser(response.data.user)
      } catch {
        localStorage.removeItem('civicbridge_token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  // Citizen portal login
  const login = useCallback(async (email: string, password: string) => {
    const response = await authAPI.citizenLogin({ email, password })
    const data = response.data as AuthResponse

    localStorage.setItem('civicbridge_token', data.token)
    setUser(data.user)

    return data.user
  }, [])

  // Department portal login (staff and admin)
  const departmentLogin = useCallback(async (department: string, email: string, password: string) => {
    const response = await authAPI.departmentLogin({ department, email, password })
    const data = response.data as AuthResponse

    localStorage.setItem('civicbridge_token', data.token)
    setUser(data.user)

    return data.user
  }, [])

  const register = useCallback(async (details: {
    name: string
    email: string
    password: string
    phone?: string
  }) => {
    const response = await authAPI.register(details)
    const data = response.data as AuthResponse

    localStorage.setItem('civicbridge_token', data.token)
    setUser(data.user)

    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('civicbridge_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        departmentLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
