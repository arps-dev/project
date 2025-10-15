import { useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { useContext } from 'react'

export default function ForgotPassword(){
  const [email,setEmail] = useState('')
  const [msg,setMsg] = useState('')
  const { forgot } = useContext(AuthContext)

  const submit = async (e) => {
    e.preventDefault()
    try{
      await forgot(email)
      setMsg('If account exists, check email for reset link.')
    }catch(e){ setMsg('Error') }
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-md w-96 text-black">
        <h2 className="text-2xl mb-4">Forgot Password</h2>
        <input className="w-full mb-3 p-2 border rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="w-full bg-yellow-500 py-2 rounded">Send Reset Link</button>
        {msg && <p className="mt-2 text-sm">{msg}</p>}
      </form>
    </div>
  )
}
