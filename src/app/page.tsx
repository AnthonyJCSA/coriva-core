import Hero from '@/components/marketing/Hero'
import Benefits from '@/components/marketing/Benefits'
import SocialProof from '@/components/marketing/SocialProof'
import Comparison from '@/components/marketing/Comparison'
import UseCases from '@/components/marketing/UseCases'
import Pricing from '@/components/marketing/Pricing'
import FAQ from '@/components/marketing/FAQ'
import FinalCTA from '@/components/marketing/FinalCTA'
import WhatsAppWidget from '@/components/WhatsAppWidget'

export const metadata = {
  title: 'Coriva Core - Vende más, pierde menos. Tu negocio en piloto automático',
  description: 'Sistema POS con IA que controla tu inventario, caja y ventas. WhatsApp automático, alertas inteligentes y reportes claros. Prueba gratis 30 días.',
  keywords: 'pos peru, punto de venta, inventario, caja, ventas, ia, whatsapp, sistema pos, pos para negocios, treinta alternativa',
  authors: [{ name: 'Coriva Core' }],
  creator: 'Coriva Core',
  publisher: 'Coriva Core',
  robots: 'index, follow',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Coriva Core - Tu negocio en piloto automático',
    description: 'Vende más, pierde menos con IA y WhatsApp automático. Sistema POS completo para cualquier negocio.',
    type: 'website',
    locale: 'es_PE',
    url: 'https://coriva-core.vercel.app',
    siteName: 'Coriva Core',
    images: [{
      url: 'https://coriva-core.vercel.app/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Coriva Core - Sistema POS'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coriva Core - Tu negocio en piloto automático',
    description: 'Sistema POS con IA y WhatsApp automático',
    images: ['https://coriva-core.vercel.app/og-image.png']
  },
  alternates: {
    canonical: 'https://coriva-core.vercel.app'
  },
  verification: {
    google: 'google-site-verification-code',
  }
}

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Coriva Core",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "PEN",
              "priceValidUntil": "2025-12-31"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "127"
            },
            "description": "Sistema POS con IA para control de inventario, caja y ventas"
          })
        }}
      />
      <main className="min-h-screen">
        <Hero />
        <Benefits />
        <SocialProof />
        <Comparison />
        <UseCases />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <WhatsAppWidget />
    </>
  )
}
