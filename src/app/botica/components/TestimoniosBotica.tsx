import ScrollReveal from '@/components/ScrollReveal'

export default function TestimoniosBotica() {
  const testimonios = [
    {
      texto: "Antes perdía 2 horas cerrando caja. Ahora lo hago en 1 minuto y sin errores.",
      autor: "Rosa Mendoza",
      botica: "Botica Santa Rosa",
      ubicacion: "San Juan de Lurigancho",
      avatar: "RM"
    },
    {
      texto: "Ya no pierdo ventas por falta de stock. El sistema me avisa y compro a tiempo.",
      autor: "Carlos Vega",
      botica: "Farmacia El Pueblo",
      ubicacion: "Villa El Salvador",
      avatar: "CV"
    },
    {
      texto: "Ahora sé exactamente cuánto gano cada día. Antes era un misterio.",
      autor: "María Flores",
      botica: "Botica San Martín",
      ubicacion: "Los Olivos",
      avatar: "MF"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Boticas que ya usan Coriva Core
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Esto dicen los dueños de boticas en Perú
          </p>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonios.map((testimonio, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonio.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonio.autor}</div>
                    <div className="text-sm text-gray-600">{testimonio.botica}</div>
                    <div className="text-xs text-gray-500">{testimonio.ubicacion}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonio.texto}"</p>
                <div className="flex mt-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
