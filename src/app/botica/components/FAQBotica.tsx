'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

export default function FAQBotica() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: "¿Necesito computadora?",
      a: "No necesariamente. Funciona en celular, tablet y computadora. Puedes vender desde tu celular sin problema."
    },
    {
      q: "¿Funciona en celular?",
      a: "Sí, 100%. Puedes controlar tu botica desde tu celular Android o iPhone. Vendes, ves reportes y cierras caja desde donde estés."
    },
    {
      q: "¿Me ayudan a instalarlo?",
      a: "Sí, la implementación es gratis. Te ayudamos a configurar todo, importar tus productos y te enseñamos a usarlo. En 1 día estás vendiendo."
    },
    {
      q: "¿Puedo importar productos desde Excel?",
      a: "Sí, puedes importar todos tus medicamentos desde un Excel. Te damos la plantilla y te ayudamos a subirlos. En minutos tienes todo listo."
    },
    {
      q: "¿Puedo cancelar cuando quiera?",
      a: "Sí, sin contratos ni penalizaciones. Si no te gusta, cancelas con un mensaje y listo. Sin preguntas."
    },
    {
      q: "¿Cuánto demora estar listo?",
      a: "En 1 día estás vendiendo. Te ayudamos a configurar todo por WhatsApp o videollamada. Importas tus productos y empiezas a vender el mismo día."
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Resolvemos tus dudas
          </p>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 50}>
              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-green-300 transition-all">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-green-600 flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300}>
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">¿Tienes más preguntas?</p>
            <a
              href="https://wa.me/51962257626?text=Hola,%20tengo%20una%20botica%20y%20quiero%20digitalizar%20mi%20negocio%20con%20Coriva%20Core."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
            >
              💬 Pregúntanos por WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
