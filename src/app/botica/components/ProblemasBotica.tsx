import ScrollReveal from '@/components/ScrollReveal'

export default function ProblemasBotica() {
  const problemas = [
    {
      icon: "💸",
      titulo: "Pierdes dinero por mala caja",
      descripcion: "Al final del día no cuadra la caja y no sabes dónde se fue el dinero"
    },
    {
      icon: "📦",
      titulo: "Te quedas sin stock de medicamentos",
      descripcion: "Los clientes piden y no tienes. Pierdes ventas todos los días"
    },
    {
      icon: "📓",
      titulo: "Ventas mal anotadas en cuaderno",
      descripcion: "Números borrados, hojas perdidas. No sabes cuánto vendiste realmente"
    },
    {
      icon: "💰",
      titulo: "Deudas de clientes que no pagan",
      descripcion: "Fías y luego no te acuerdas quién debe. Pierdes plata cada mes"
    },
    {
      icon: "⏰",
      titulo: "Cierras la caja en 1 hora",
      descripcion: "Contar billetes, revisar cuaderno, hacer cuentas. Todos los días lo mismo"
    },
    {
      icon: "❓",
      titulo: "No sabes cuánto ganas",
      descripcion: "¿Cuánto vendiste esta semana? ¿Qué medicamento se vende más? No tienes idea"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            ¿Te pasa esto en tu botica?
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            No eres el único. Estos son los problemas más comunes de las boticas en Perú
          </p>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problemas.map((problema, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border-2 border-red-200 hover:shadow-xl transition-all">
                <div className="text-4xl mb-3">{problema.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{problema.titulo}</h3>
                <p className="text-gray-600">{problema.descripcion}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={600}>
          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-4">
              Con Coriva Core, todos estos problemas se acaban hoy
            </p>
            <a 
              href="https://wa.me/51962257626?text=Hola,%20tengo%20una%20botica%20y%20quiero%20digitalizar%20mi%20negocio%20con%20Coriva%20Core."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
            >
              💬 Quiero solucionar esto ahora →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
