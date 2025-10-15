import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }){
  const { user } = useContext(AuthContext)
  if(!user) return <Navigate to="/login" />
  if(adminOnly && !user.isAdmin) return <Navigate to="/dashboard" />
  return children
}
