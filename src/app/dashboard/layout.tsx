'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Docentes', href: '/dashboard/docentes', icon: '👨‍🏫' },
  { name: 'Alumnos', href: '/dashboard/alumnos', icon: '📚' },
  { name: 'Aulas', href: '/dashboard/aulas', icon: '🏫' },
  { name: 'Horarios', href: '/dashboard/horarios', icon: '🕐' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-500">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-primary-700 to-primary-500 text-white flex flex-col fixed top-0 left-0 bottom-0 z-50">
        <div className="p-6 text-center border-b border-white/10">
          <div className="text-4xl text-accent-500 mb-1">★</div>
          <h2 className="text-xl font-bold">Clave de Fe</h2>
          <p className="text-xs opacity-70">Sistema Academico</p>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3.5 text-sm transition border-l-4 ${
                pathname === item.href
                  ? 'bg-white/15 border-accent-500 text-white'
                  : 'border-transparent hover:bg-white/10 text-white/80'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm truncate">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-white/10 border border-white/20 text-white rounded-lg text-sm hover:bg-red-600 transition"
          >
            Cerrar Sesion
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
