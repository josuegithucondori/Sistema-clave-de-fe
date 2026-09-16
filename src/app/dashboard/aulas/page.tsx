'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Aula {
  id: string
  nombre: string
  ubicacion: string
  capacidad: number
  estado: 'Disponible' | 'Ocupada' | 'Mantenimiento'
}

export default function AulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    nombre: '', ubicacion: '', capacidad: '', estado: 'Disponible' as 'Disponible' | 'Ocupada' | 'Mantenimiento'
  })

  useEffect(() => { fetchAulas() }, [])

  const fetchAulas = async () => {
    const { data } = await supabase.from('aulas').select('*').order('created_at', { ascending: false })
    setAulas(data || [])
  }

  const filtered = aulas.filter(a =>
    `${a.nombre} ${a.ubicacion}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  const openModal = (aula?: Aula) => {
    if (aula) {
      setEditingId(aula.id)
      setForm({ nombre: aula.nombre, ubicacion: aula.ubicacion, capacidad: String(aula.capacidad), estado: aula.estado })
    } else {
      setEditingId(null)
      setForm({ nombre: '', ubicacion: '', capacidad: '', estado: 'Disponible' })
    }
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.nombre) return alert('El nombre del aula es obligatorio')
    const payload = { ...form, capacidad: parseInt(form.capacidad) || 0 }

    if (editingId) {
      await supabase.from('aulas').update(payload).eq('id', editingId)
    } else {
      await supabase.from('aulas').insert(payload)
    }
    setModalOpen(false)
    fetchAulas()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Esta seguro de eliminar esta aula?')) return
    await supabase.from('aulas').delete().eq('id', id)
    fetchAulas()
  }

  const estadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      'Disponible': 'bg-green-100 text-green-700',
      'Ocupada': 'bg-red-100 text-red-700',
      'Mantenimiento': 'bg-amber-100 text-amber-700',
    }
    return styles[estado] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-700">Gestion de Aulas</h1>
          <p className="text-gray-500 text-sm">Administra las aulas y espacios de la academia</p>
        </div>
        <button onClick={() => openModal()} className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 px-5 rounded-lg transition">
          + Nueva Aula
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-primary-700">Lista de Aulas</h2>
          <input
            type="text"
            placeholder="Buscar aula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary-400 focus:outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-500 text-white text-xs uppercase">
                <th className="px-5 py-3 text-left">ID</th>
                <th className="px-5 py-3 text-left">Nombre</th>
                <th className="px-5 py-3 text-left">Ubicacion</th>
                <th className="px-5 py-3 text-left">Capacidad</th>
                <th className="px-5 py-3 text-left">Estado</th>
                <th className="px-5 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm">{a.id.slice(0, 8)}...</td>
                  <td className="px-5 py-3 text-sm font-medium">{a.nombre}</td>
                  <td className="px-5 py-3 text-sm">{a.ubicacion}</td>
                  <td className="px-5 py-3 text-sm">{a.capacidad} alumnos</td>
                  <td className="px-5 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoBadge(a.estado)}`}>
                      {a.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => openModal(a)} className="text-amber-600 hover:text-amber-800 text-sm font-semibold mr-3">Editar</button>
                    <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800 text-sm font-semibold">Eliminar</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No hay aulas registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-primary-700">{editingId ? 'Editar Aula' : 'Nueva Aula'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Aula *</label>
                <input value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" placeholder="Ej: Aula 1, Sala de Musica..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicacion</label>
                <input value={form.ubicacion} onChange={(e) => setForm({...form, ubicacion: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" placeholder="Ej: Planta Alta, Edificio A..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Capacidad</label>
                <input type="number" value={form.capacidad} onChange={(e) => setForm({...form, capacidad: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" min="1" placeholder="Numero de alumnos" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                <select value={form.estado} onChange={(e) => setForm({...form, estado: e.target.value as any})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none">
                  <option value="Disponible">Disponible</option>
                  <option value="Ocupada">Ocupada</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
