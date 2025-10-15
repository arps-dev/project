import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export default function Navbar(){
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const doLogout = () => { logout(); navigate('/login') }
  return (
    <nav className="bg-white/10 backdrop-blur-sm p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-white">PizzaApp</Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/custom-pizza" className="hover:underline">Build</Link>
          {user?.isAdmin && <Link to="/admin" className="hover:underline">Admin</Link>}
          {user ? (
            <>
              <span className="px-3 py-1 bg-white/10 rounded">{user.email}</span>
              <button onClick={doLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 bg-green-500 rounded">Login</Link>
              <Link to="/register" className="px-3 py-1 bg-blue-500 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
