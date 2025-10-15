import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import API from '../../api/api'

export default function VerifyEmail(){
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(()=>{
    const token = params.get('token'); const email = params.get('email')
    if(token && email){
      API.get('/auth/verify?token=' + token + '&email=' + encodeURIComponent(email))
        .then(()=>{ alert('Email verified. Login now.'); navigate('/login') })
        .catch(()=>{ alert('Verification failed'); navigate('/register') })
    }else{
      navigate('/register')
    }
  },[])

  return <div className="card max-w-md mx-auto p-4">Verifying...</div>
}
