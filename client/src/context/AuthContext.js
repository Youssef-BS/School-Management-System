"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      })

      const { token, user } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)
      setError(null)
      return user
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await axios.post("http://localhost:3000/api/auth/register", userData)
      setError(null)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
