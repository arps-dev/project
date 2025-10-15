import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

export default function Login(){
  const [email,setEmail] = useState(''); const [password,setPassword]=useState('')
  const [err,setErr] = useState('')
  const { doLogin, login } = useContext(AuthContext)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      const res = await doLogin(email, password)
      login({ token: res.data.token, user: res.data.user })
      navigate(res.data.user.isAdmin ? '/admin' : '/dashboard')
    }catch(err){
      setErr(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md w-96 text-black">
        <h2 className="text-2xl mb-4">Login</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <input className="w-full mb-3 p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full mb-3 p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-green-600 py-2 rounded">Login</button>
      </form>
    </div>
  )
}
