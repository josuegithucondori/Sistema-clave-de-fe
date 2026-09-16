import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Academia Clave de Fe',
  description: 'Sistema de Administracion Academica',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
