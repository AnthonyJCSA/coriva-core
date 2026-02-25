import type { Metadata } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'
import GoogleTagManager from '@/components/GoogleTagManager'
import MetaPixel from '@/components/MetaPixel'

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
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'} />
        <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID || ''} />
        <Analytics />
        {children}
      </body>
    </html>
  )
}