'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Stats {
  docentes: number
  alumnos: number
  aulas: number
  horarios: number
}

interface HorarioHoy {
  id: string
  materia: string
  dia: string
  hora_inicio: string
  hora_fin: string
  grupo: string
  docentes: { nombre: string; apellido: string } | null
  aulas: { nombre: string; ubicacion: string } | null
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ docentes: 0, alumnos: 0, aulas: 0, horarios: 0 })
  const [horariosHoy, setHorariosHoy] = useState<HorarioHoy[]>([])

  useEffect(() => {
    fetchStats()
    fetchHorariosHoy()
  }, [])

  const fetchStats = async () => {
    const [docentes, alumnos, aulas, horarios] = await Promise.all([
      supabase.from('docentes').select('id', { count: 'exact', head: true }),
      supabase.from('alumnos').select('id', { count: 'exact', head: true }),
      supabase.from('aulas').select('id', { count: 'exact', head: true }),
      supabase.from('horarios').select('id', { count: 'exact', head: true }),
    ])

    setStats({
      docentes: docentes.count || 0,
      alumnos: alumnos.count || 0,
      aulas: aulas.count || 0,
      horarios: horarios.count || 0,
    })
  }

  const fetchHorariosHoy = async () => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
    const diaActual = dias[new Date().getDay()]

    const { data } = await supabase
      .from('horarios')
      .select('*, docentes(nombre, apellido), aulas(nombre, ubicacion)')
      .eq('dia', diaActual)
      .order('hora_inicio')

    setHorariosHoy(data || [])
  }

  const statCards = [
    { label: 'Docentes', value: stats.docentes, icon: '👨‍🏫', color: 'bg-gradient-to-br from-blue-600 to-blue-400' },
    { label: 'Alumnos', value: stats.alumnos, icon: '📚', color: 'bg-gradient-to-br from-green-600 to-green-400' },
    { label: 'Aulas', value: stats.aulas, icon: '🏫', color: 'bg-gradient-to-br from-amber-600 to-amber-400' },
    { label: 'Horarios', value: stats.horarios, icon: '🕐', color: 'bg-gradient-to-br from-red-600 to-red-400' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-700">Panel Principal</h1>
        <p className="text-gray-500 text-sm">Bienvenido al sistema de administracion Clave de Fe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center text-2xl text-white`}>
              {card.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{card.value}</div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-primary-700">Horarios de Hoy</h2>
        </div>
        <div className="p-6">
          {horariosHoy.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🕐</div>
              <p>No hay horarios programados para hoy</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {horariosHoy.map((h) => (
                <div key={h.id} className="border-l-4 border-primary-500 rounded-lg p-4 bg-gray-50 hover:shadow-md transition">
                  <h4 className="font-semibold text-primary-700 mb-2">{h.materia}</h4>
                  <p className="text-sm text-gray-500">👨‍🏫 {h.docentes ? `${h.docentes.nombre} ${h.docentes.apellido}` : 'Sin asignar'}</p>
                  <p className="text-sm text-gray-500">🏫 {h.aulas ? h.aulas.nombre : 'Sin asignar'}</p>
                  <p className="text-sm text-gray-500">🕐 {h.hora_inicio} - {h.hora_fin}</p>
                  {h.grupo && <p className="text-sm text-gray-500">📋 {h.grupo}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
