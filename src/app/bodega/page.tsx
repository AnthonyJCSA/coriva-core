import HeroBodega from './components/HeroBodega'
import StorysellingBodega from './components/StorysellingBodega'
import ProblemasBodega from './components/ProblemasBodega'
import BeneficiosBodega from './components/BeneficiosBodega'
import TestimoniosBodega from './components/TestimoniosBodega'
import FAQBodega from './components/FAQBodega'
import OfertaBodega from './components/OfertaBodega'
import CTAFinalBodega from './components/CTAFinalBodega'
import StickyWhatsApp from '@/components/StickyWhatsApp'

export const metadata = {
  title: 'Sistema para Bodegas en Perú | Coriva Core',
  description: 'Sistema para bodegas que controla ventas, stock y caja. Empieza hoy desde S/49 al mes.',
  keywords: 'sistema para bodega, programa para bodega, sistema de ventas para tienda, control de ventas negocio pequeño, pos bodega peru',
  robots: 'index, follow',
  openGraph: {
    title: 'Sistema para Bodegas en Perú | Coriva Core',
    description: 'Sistema para bodegas que controla ventas, stock y caja. Empieza hoy desde S/49 al mes.',
    type: 'website',
    locale: 'es_PE',
    url: 'https://coriva-core.vercel.app/bodega',
  },
  alternates: {
    canonical: 'https://coriva-core.vercel.app/bodega'
  }
}

export default function BodegaLanding() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Coriva Core - Sistema para Bodegas",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "49",
              "priceCurrency": "PEN"
            },
            "description": "Sistema para bodegas que controla ventas, stock y caja"
          })
        }}
      />
      <main className="min-h-screen">
        <HeroBodega />
        <StorysellingBodega />
        <ProblemasBodega />
        <BeneficiosBodega />
        <TestimoniosBodega />
        <FAQBodega />
        <OfertaBodega />
        <CTAFinalBodega />
      </main>
      <StickyWhatsApp 
        phoneNumber="51913916967"
        message="Hola,%20tengo%20una%20bodega%20y%20quiero%20ordenar%20mi%20negocio%20con%20Coriva%20Core."
        text="WhatsApp: Implementación gratis"
      />
    </>
  )
}
