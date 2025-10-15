import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import API from '../../api/api'

export default function OrderStatus(){
  const params = new URLSearchParams(window.location.search)
  const orderId = params.get('orderId')
  const [status,setStatus] = useState('received')

  useEffect(()=>{
    const socket = io(import.meta.env.VITE_API_BASE ? import.meta.env.VITE_API_BASE.replace('/api','') : 'http://localhost:5000')
    socket.on('order-status-updated', payload => { if(String(payload.orderId) === String(orderId)) setStatus(payload.status) })
    ;(async ()=>{
      try{ const res = await API.get('/orders'); const found = res.data.find(o=>String(o._id)===String(orderId)); if(found) setStatus(found.status) }catch(e){}
    })()
    return ()=> socket.disconnect()
  },[orderId])

  return <div className="card max-w-md mx-auto p-4">Order {orderId} - Status: <strong>{status}</strong></div>
}
