import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config/constants"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
      setIsAuthenticated(true)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      })

      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(user)
      setIsAuthenticated(true)

      return user
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await axios.post(`${API_URL}/api/auth/register`, userData)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
