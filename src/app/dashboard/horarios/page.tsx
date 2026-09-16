'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Horario {
  id: string
  materia: string
  docente_id: string
  aula_id: string
  dia: string
  hora_inicio: string
  hora_fin: string
  grupo: string
  docentes: { nombre: string; apellido: string } | null
  aulas: { nombre: string; ubicacion: string } | null
}

const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [docentes, setDocentes] = useState<any[]>([])
  const [aulas, setAulas] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    materia: '', docente_id: '', aula_id: '', dia: 'Lunes', hora_inicio: '', hora_fin: '', grupo: ''
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const [horariosRes, docentesRes, aulasRes] = await Promise.all([
      supabase.from('horarios').select('*, docentes(nombre, apellido), aulas(nombre, ubicacion)').order('dia'),
      supabase.from('docentes').select('*').eq('estado', 'Activo'),
      supabase.from('aulas').select('*').eq('estado', 'Disponible'),
    ])
    setHorarios(horariosRes.data || [])
    setDocentes(docentesRes.data || [])
    setAulas(aulasRes.data || [])
  }

  const filtered = horarios.filter(h =>
    `${h.materia} ${h.dia} ${h.grupo}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  const openModal = (horario?: Horario) => {
    if (horario) {
      setEditingId(horario.id)
      setForm({
        materia: horario.materia, docente_id: horario.docente_id, aula_id: horario.aula_id,
        dia: horario.dia, hora_inicio: horario.hora_inicio, hora_fin: horario.hora_fin, grupo: horario.grupo
      })
    } else {
      setEditingId(null)
      setForm({ materia: '', docente_id: '', aula_id: '', dia: 'Lunes', hora_inicio: '', hora_fin: '', grupo: '' })
    }
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.materia || !form.docente_id || !form.aula_id || !form.hora_inicio || !form.hora_fin) {
      return alert('Todos los campos marcados son obligatorios')
    }
    if (form.hora_inicio >= form.hora_fin) {
      return alert('La hora de inicio debe ser menor a la hora de fin')
    }

    const payload = {
      materia: form.materia, docente_id: form.docente_id, aula_id: form.aula_id,
      dia: form.dia, hora_inicio: form.hora_inicio, hora_fin: form.hora_fin, grupo: form.grupo
    }

    if (editingId) {
      await supabase.from('horarios').update(payload).eq('id', editingId)
    } else {
      await supabase.from('horarios').insert(payload)
    }
    setModalOpen(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Esta seguro de eliminar este horario?')) return
    await supabase.from('horarios').delete().eq('id', id)
    fetchData()
  }

  const horariosPorDia = dias.map(dia => ({
    dia,
    items: filtered.filter(h => h.dia === dia)
  }))

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-700">Gestion de Horarios</h1>
          <p className="text-gray-500 text-sm">Administra los horarios de clases de la academia</p>
        </div>
        <button onClick={() => openModal()} className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 px-5 rounded-lg transition">
          + Nuevo Horario
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-primary-700">Horarios Registrados</h2>
          <input
            type="text"
            placeholder="Buscar horario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-primary-400 focus:outline-none"
          />
        </div>
        <div className="p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🕐</div>
              <p>No hay horarios registrados</p>
            </div>
          ) : (
            <div className="space-y-6">
              {horariosPorDia.filter(d => d.items.length > 0).map(({ dia, items }) => (
                <div key={dia}>
                  <h3 className="font-semibold text-primary-600 mb-3 border-b-2 border-amber-400 inline-block pb-1">{dia}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((h) => (
                      <div key={h.id} className="border-l-4 border-primary-500 rounded-lg p-4 bg-gray-50 hover:shadow-md transition">
                        <h4 className="font-semibold text-primary-700 mb-2">{h.materia}</h4>
                        <p className="text-sm text-gray-500">👨‍🏫 {h.docentes ? `${h.docentes.nombre} ${h.docentes.apellido}` : 'Sin asignar'}</p>
                        <p className="text-sm text-gray-500">🏫 {h.aulas ? `${h.aulas.nombre} (${h.aulas.ubicacion})` : 'Sin asignar'}</p>
                        <p className="text-sm text-gray-500">🕐 {h.hora_inicio} - {h.hora_fin}</p>
                        {h.grupo && <p className="text-sm text-gray-500">📋 {h.grupo}</p>}
                        <div className="mt-3 flex gap-3">
                          <button onClick={() => openModal(h)} className="text-amber-600 hover:text-amber-800 text-sm font-semibold">Editar</button>
                          <button onClick={() => handleDelete(h.id)} className="text-red-600 hover:text-red-800 text-sm font-semibold">Eliminar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-primary-700">{editingId ? 'Editar Horario' : 'Nuevo Horario'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Materia / Curso *</label>
                <input value={form.materia} onChange={(e) => setForm({...form, materia: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" placeholder="Ej: Biblia, Matematicas..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Docente *</label>
                  <select value={form.docente_id} onChange={(e) => setForm({...form, docente_id: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none">
                    <option value="">Seleccionar docente</option>
                    {docentes.map(d => (
                      <option key={d.id} value={d.id}>{d.nombre} {d.apellido} - {d.especialidad}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Aula *</label>
                  <select value={form.aula_id} onChange={(e) => setForm({...form, aula_id: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none">
                    <option value="">Seleccionar aula</option>
                    {aulas.map(a => (
                      <option key={a.id} value={a.id}>{a.nombre} ({a.ubicacion})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Dia</label>
                <select value={form.dia} onChange={(e) => setForm({...form, dia: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none">
                  {dias.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hora Inicio *</label>
                  <input type="time" value={form.hora_inicio} onChange={(e) => setForm({...form, hora_inicio: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hora Fin *</label>
                  <input type="time" value={form.hora_fin} onChange={(e) => setForm({...form, hora_fin: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Grupo / Nivel</label>
                <input value={form.grupo} onChange={(e) => setForm({...form, grupo: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none" placeholder="Ej: Principiantes, Avanzado..." />
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