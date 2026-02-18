import Hero from '@/components/marketing/Hero'
import Benefits from '@/components/marketing/Benefits'
import SocialProof from '@/components/marketing/SocialProof'
import Comparison from '@/components/marketing/Comparison'
import UseCases from '@/components/marketing/UseCases'
import Pricing from '@/components/marketing/Pricing'
import FAQ from '@/components/marketing/FAQ'
import FinalCTA from '@/components/marketing/FinalCTA'

export const metadata = {
  title: 'Coriva Core - Vende más, pierde menos. Tu negocio en piloto automático',
  description: 'Sistema POS con IA que controla tu inventario, caja y ventas. WhatsApp automático, alertas inteligentes y reportes claros. Prueba gratis 30 días.',
  keywords: 'pos, punto de venta, inventario, caja, ventas, ia, whatsapp, peru, negocio',
  openGraph: {
    title: 'Coriva Core - Tu negocio en piloto automático',
    description: 'Vende más, pierde menos con IA y WhatsApp automático',
    type: 'website',
    locale: 'es_PE',
  }
}

export default function LandingPage() {
  return (
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
  )
}
