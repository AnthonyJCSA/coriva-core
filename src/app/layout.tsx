import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FarmaZi - Sistema de Farmacia',
  description: 'Sistema POS para farmacias',
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