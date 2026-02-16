import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coriva Core - Sistema POS Multi-Tenant',
  description: 'Sistema POS adaptable para cualquier tipo de negocio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}