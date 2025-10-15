import { useEffect, useState } from 'react'
import API from '../../api/api'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const [items,setItems] = useState([])
  useEffect(()=>{ API.get('/ingredients').then(r=>setItems(r.data)).catch(()=>{}) },[])

  const grouped = items.reduce((acc,i)=>{ acc[i.category]=acc[i.category]||[]; acc[i.category].push(i); return acc }, {})

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Available Ingredients</h1>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(grouped).map(cat=>(
          <div key={cat} className="card">
            <h3 className="text-xl capitalize">{cat}</h3>
            <ul>
              {grouped[cat].map(it=> <li key={it._id}>{it.name} — stock: {it.stock}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <Link to="/custom-pizza"><button className="mt-4 bg-green-600 px-4 py-2 rounded">Build Pizza</button></Link>
    </div>
  )
}
