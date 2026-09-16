'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Alumno {
  id: string
  nombre: string
  apellido: string
  edad: number
  telefono: string
  padre: string
  direccion: string
  estado: 'Activo' | 'Inactivo'
}

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    nombre: '', apellido: '', edad: '', telefono: '', padre: '', direccion: '', estado: 'Activo' as 'Activo' | 'Inactivo'
  })

  useEffect(() => { fetchAlumnos() }, [])

  const fetchAlumnos = async () => {
    const { data } = await supabase.from('alumnos').select('*').order('created_at', { ascending: false })
    setAlumnos(data || [])
  }

  const filtered = alumnos.filter(a =>
    `${a.nombre} ${a.apellido} ${a.padre}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  const openModal = (alumno?: Alumno) => {
    if (alumno) {
      setEditingId(alumno.id)
      setForm({ nombre: alumno.nombre, apellido: alumno.apellido, edad: String(alumno.edad), telefono: alumno.telefono, padre: alumno.padre, direccion: alumno.direccion, estado: alumno.estado })
    } else {
      setEditingId(null)
      setForm({ nombre: '', apellido: '', edad: '', telefono: '', padre: '', direccion: '', estado: 'Activo' })
    }
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.nombre || !form.apellido) return alert('Nombre y apellido son obligatorios')
    const payload = { ...form, edad: parseInt(form.edad) || 0 }

    if (editingId) {
      await supabase.from('alumnos').update(payload).eq('id', editingId)
    } else {
      await supabase.from('alumnos').insert(payload)
    }
    setModalOpen(false)
    fetchAlumnos()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Esta seguro de eliminar este alumno?')) return
    await supabase.from('alumnos').delete().eq('id', id)
    fetchAlumnos()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-700">Gestion de Alumnos</h1>
          <p className="text-gray-500 text-sm">Administra los alumnos inscritos en la academia</p>
        </div>
        <button onClick={() => openModal()} className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 px-5 rounded-lg transition">
          + Nuevo Alumno
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-primary-700">Lista de Alumnos</h2>
          <input
            type="text"
            placeholder="Buscar alumno..."
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
                <th className="px-5 py-3 text-left">Apellido</th>
                <th className="px-5 py-3 text-left">Edad</th>
                <th className="px-5 py-3 text-left">Telefono</th>
                <th className="px-5 py-3 text-left">Padre/Madre</th>
                <th className="px-5 py-3 text-left">Estado</th>
                <th className="px-5 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm">{a.id.slice(0, 8)}...</td>
                  <td className="px-5 py-3 text-sm">{a.nombre}</td>
                  <td className="px-5 py-3 text-sm">{a.apellido}</td>
                  <td className="px-5 py-3 text-sm">{a.edad}</td>
                  <td className="px-5 py-3 text-sm">{a.telefono}</td>
                  <td className="px-5 py-3 text-sm">{a.padre}</td>
                  <td className="px-5 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${a.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No hay alumnos registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-primary-700">{editingId ? 'Editar Alumno' : 'Nuevo Alumno'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
                  <input value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido *</label>
                  <input value={form.apellido} onChange={(e) => setForm({...form, apellido: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Edad</label>
                  <input type="number" value={form.edad} onChange={(e) => setForm({...form, edad: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" min="3" max="100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Telefono</label>
                  <input value={form.telefono} onChange={(e) => setForm({...form, telefono: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Padre/Madre/Encargado</label>
                <input value={form.padre} onChange={(e) => setForm({...form, padre: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Direccion</label>
                <input value={form.direccion} onChange={(e) => setForm({...form, direccion: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                <select value={form.estado} onChange={(e) => setForm({...form, estado: e.target.value as 'Activo' | 'Inactivo'})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
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
