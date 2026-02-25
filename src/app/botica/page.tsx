import HeroBotica from './components/HeroBotica'
import ProblemasBotica from './components/ProblemasBotica'
import BeneficiosBotica from './components/BeneficiosBotica'
import DemoVisual from './components/DemoVisual'
import TestimoniosBotica from './components/TestimoniosBotica'
import ComparacionBotica from './components/ComparacionBotica'
import OfertaUrgencia from './components/OfertaUrgencia'
import CTAFinalBotica from './components/CTAFinalBotica'
import WhatsAppWidget from '@/components/WhatsAppWidget'

export const metadata = {
  title: 'Sistema para Boticas en Perú | Coriva Core',
  description: 'Sistema para boticas que controla ventas, stock y caja. Empieza hoy desde S/49 al mes. Soporte en Perú.',
  keywords: 'sistema para botica, software para boticas, control de stock farmacia, programa para botica en Perú, sistema pos farmacia, software farmacia peru',
  robots: 'index, follow',
  openGraph: {
    title: 'Sistema para Boticas en Perú | Coriva Core',
    description: 'Sistema para boticas que controla ventas, stock y caja. Empieza hoy desde S/49 al mes.',
    type: 'website',
    locale: 'es_PE',
    url: 'https://coriva-core.vercel.app/botica',
  },
  alternates: {
    canonical: 'https://coriva-core.vercel.app/botica'
  }
}

export default function BoticaLanding() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Coriva Core - Sistema para Boticas",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "49",
              "priceCurrency": "PEN"
            },
            "description": "Sistema para boticas que controla ventas, stock y caja"
          })
        }}
      />
      <main className="min-h-screen">
        <HeroBotica />
        <ProblemasBotica />
        <BeneficiosBotica />
        <DemoVisual />
        <TestimoniosBotica />
        <ComparacionBotica />
        <OfertaUrgencia />
        <CTAFinalBotica />
      </main>
      <WhatsAppWidget 
        defaultMessage="Hola, tengo una botica y quiero digitalizar mi negocio con Coriva Core."
      />
    </>
  )
}
