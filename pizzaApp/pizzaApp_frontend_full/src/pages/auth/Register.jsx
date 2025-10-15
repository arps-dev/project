import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  const [msg,setMsg] = useState('')
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      await register(name,email,password)
      alert('Registered. Check email to verify.')
      navigate('/login')
    }catch(err){
      setMsg(err.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md w-96 text-black">
        <h2 className="text-2xl mb-4">Register</h2>
        {msg && <div className="text-red-600 mb-2">{msg}</div>}
        <input className="w-full mb-3 p-2 border rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full mb-3 p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full mb-3 p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 py-2 rounded">Register</button>
      </form>
    </div>
  )
}
