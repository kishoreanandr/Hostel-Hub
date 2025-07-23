"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()
axios.defaults.baseURL = "http://localhost:8080"; 

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        // Set default authorization header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      })

      const { token, message } = response.data

      if (token) {
        // Decode JWT to get user info (simple base64 decode)
        const payload = JSON.parse(atob(token.split(".")[1]))
        const userData = {
          email: payload.sub,
          role: payload.role,
          name: email.split("@")[0], // Fallback name
        }

        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        setUser(userData)

        return { success: true, message }
      }

      return { success: false, message: message || "Login failed" }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      })

      return { success: true, message: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || "Registration failed",
      }
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
    login,
    signup,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
