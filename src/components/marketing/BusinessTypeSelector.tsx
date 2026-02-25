import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

export default function BusinessTypeSelector() {
  const businesses = [
    {
      icon: "💊",
      title: "Boticas y Farmacias",
      benefit: "Control de medicamentos y stock automático",
      link: "/botica",
      color: "from-green-600 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200"
    },
    {
      icon: "🛒",
      title: "Bodegas y Tiendas",
      benefit: "Sabe cuánto ganas hoy en tiempo real",
      link: "/bodega",
      color: "from-blue-600 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200"
    },
    {
      icon: "🍔",
      title: "Restaurantes",
      benefit: "Próximamente disponible",
      link: "#",
      color: "from-orange-600 to-red-600",
      bgColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      comingSoon: true
    },
    {
      icon: "✂️",
      title: "Salones de Belleza",
      benefit: "Próximamente disponible",
      link: "#",
      color: "from-pink-600 to-purple-600",
      bgColor: "from-pink-50 to-purple-50",
      borderColor: "border-pink-200",
      comingSoon: true
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Elige tu tipo de negocio
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Sistema especializado para cada tipo de negocio en Perú
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((business, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              {business.comingSoon ? (
                <div className={`relative bg-gradient-to-br ${business.bgColor} p-8 rounded-2xl border-2 ${business.borderColor} opacity-60`}>
                  <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Próximamente
                  </div>
                  <div className="text-5xl mb-4">{business.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{business.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{business.benefit}</p>
                  <div className="bg-gray-300 text-gray-500 text-center py-3 rounded-xl font-bold cursor-not-allowed">
                    Próximamente
                  </div>
                </div>
              ) : (
                <Link 
                  href={business.link}
                  className={`block bg-gradient-to-br ${business.bgColor} p-8 rounded-2xl border-2 ${business.borderColor} hover:shadow-xl hover:scale-105 transition-all`}
                >
                  <div className="text-5xl mb-4">{business.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{business.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{business.benefit}</p>
                  <div className={`bg-gradient-to-r ${business.color} text-white text-center py-3 rounded-xl font-bold`}>
                    Ver solución →
                  </div>
                </Link>
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
