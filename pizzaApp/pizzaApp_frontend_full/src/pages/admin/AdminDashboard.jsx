import { useEffect, useState } from 'react'
import API from '../../api/api'

export default function AdminDashboard(){
  const [ingredients,setIngredients] = useState([])
  const [orders,setOrders] = useState([])
  const load = async ()=>{
    try{ const ing = await API.get('/ingredients'); setIngredients(ing.data); const ord = await API.get('/orders'); setOrders(ord.data) }catch(e){}
  }
  useEffect(()=>{ load() },[])

  const updateStock = async (id, delta) => {
    try{ const item = ingredients.find(i=>i._id===id); await API.put('/ingredients/' + id, { ...item, stock: item.stock + delta }); load() }catch(e){ console.error(e) }
  }
  const changeStatus = async (id, status) => { try{ await API.put('/orders/' + id + '/status', { status }); load() }catch(e){ console.error(e) } }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <section className="card mb-4 p-4">
        <h2 className="text-xl">Inventory</h2>
        <ul>{ingredients.map(i=>(
          <li key={i._id} className="mb-2">{i.name} ({i.category}) - stock: {i.stock}
            <button onClick={()=>updateStock(i._id,10)} className="ml-2 bg-blue-500 px-2 rounded">+10</button>
            <button onClick={()=>updateStock(i._id,-10)} className="ml-2 bg-red-500 px-2 rounded">-10</button>
          </li>
        ))}</ul>
      </section>
      <section className="card p-4">
        <h2 className="text-xl">Orders</h2>
        <ul>{orders.map(o=>(
          <li key={o._1} className="mb-3">Order: {o._id} | User: {o.user?.email} | Status: {o.status}
            <div className="mt-2">
              <button onClick={()=>changeStatus(o._id,'received')} className="mr-2 bg-indigo-600 px-2 rounded">Received</button>
              <button onClick={()=>changeStatus(o._id,'in_kitchen')} className="mr-2 bg-yellow-500 px-2 rounded">In Kitchen</button>
              <button onClick={()=>changeStatus(o._id,'sent_for_delivery')} className="mr-2 bg-green-600 px-2 rounded">Sent</button>
            </div>
          </li>
        ))}</ul>
      </section>
    </div>
  )
}
