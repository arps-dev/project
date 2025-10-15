import React, { createContext, useEffect, useState } from 'react'
import API from '../api/api'

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(()=> { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })
  const [token, setToken] = useState(()=> localStorage.getItem('token'))

  useEffect(()=> {
    if(token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
    if(user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [token, user])

  const login = ({ token, user }) => { setToken(token); setUser(user) }
  const logout = () => { setToken(null); setUser(null) }

  const register = (name,email,password) => API.post('/auth/register', { name, email, password })
  const doLogin = (email,password) => API.post('/auth/login', { email, password })
  const forgot = (email) => API.post('/auth/forgot-password', { email })
  const reset = (token,email,password) => API.post('/auth/reset-password', { token, email, password })

  return <AuthContext.Provider value={{ user, token, login, logout, register, doLogin, forgot, reset }}>{children}</AuthContext.Provider>
}
