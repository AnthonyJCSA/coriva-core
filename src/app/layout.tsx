import type { Metadata } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Coriva Core - Sistema POS Multi-Tenant',
  description: 'Sistema POS adaptable para cualquier tipo de negocio',
  metadataBase: new URL('https://coriva-core.vercel.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  )
}