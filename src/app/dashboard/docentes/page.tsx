'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Docente {
  id: string
  nombre: string
  apellido: string
  especialidad: string
  telefono: string
  email: string
  estado: 'Activo' | 'Inactivo'
}

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    nombre: '', apellido: '', especialidad: '', telefono: '', email: '', estado: 'Activo' as 'Activo' | 'Inactivo'
  })

  useEffect(() => { fetchDocentes() }, [])

  const fetchDocentes = async () => {
    const { data } = await supabase.from('docentes').select('*').order('created_at', { ascending: false })
    setDocentes(data || [])
  }

  const filtered = docentes.filter(d =>
    `${d.nombre} ${d.apellido} ${d.especialidad}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  const openModal = (docente?: Docente) => {
    if (docente) {
      setEditingId(docente.id)
      setForm({ nombre: docente.nombre, apellido: docente.apellido, especialidad: docente.especialidad, telefono: docente.telefono, email: docente.email, estado: docente.estado })
    } else {
      setEditingId(null)
      setForm({ nombre: '', apellido: '', especialidad: '', telefono: '', email: '', estado: 'Activo' })
    }
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.nombre || !form.apellido) return alert('Nombre y apellido son obligatorios')

    if (editingId) {
      await supabase.from('docentes').update(form).eq('id', editingId)
    } else {
      await supabase.from('docentes').insert(form)
    }
    setModalOpen(false)
    fetchDocentes()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Esta seguro de eliminar este docente?')) return
    await supabase.from('docentes').delete().eq('id', id)
    fetchDocentes()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-700">Gestion de Docentes</h1>
          <p className="text-gray-500 text-sm">Administra el personal docente de la academia</p>
        </div>
        <button onClick={() => openModal()} className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 px-5 rounded-lg transition">
          + Nuevo Docente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-primary-700">Lista de Docentes</h2>
          <input
            type="text"
            placeholder="Buscar docente..."
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
                <th className="px-5 py-3 text-left">Especialidad</th>
                <th className="px-5 py-3 text-left">Telefono</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Estado</th>
                <th className="px-5 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm">{d.id.slice(0, 8)}...</td>
                  <td className="px-5 py-3 text-sm">{d.nombre}</td>
                  <td className="px-5 py-3 text-sm">{d.apellido}</td>
                  <td className="px-5 py-3 text-sm">{d.especialidad}</td>
                  <td className="px-5 py-3 text-sm">{d.telefono}</td>
                  <td className="px-5 py-3 text-sm">{d.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${d.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {d.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => openModal(d)} className="text-amber-600 hover:text-amber-800 text-sm font-semibold mr-3">Editar</button>
                    <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-800 text-sm font-semibold">Eliminar</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-8 text-gray-400">No hay docentes registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-primary-700">{editingId ? 'Editar Docente' : 'Nuevo Docente'}</h2>
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Especialidad</label>
                <input value={form.especialidad} onChange={(e) => setForm({...form, especialidad: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" placeholder="Ej: Matematicas, Biblia, Musica..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Telefono</label>
                  <input value={form.telefono} onChange={(e) => setForm({...form, telefono: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" />
                </div>
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
