import ScrollReveal from '@/components/ScrollReveal'

export default function ProblemasBodega() {
  const problemas = [
    {
      icon: "❓",
      titulo: "No sabes cuánto ganas al día",
      descripcion: "Vendes todo el día pero no sabes si estás ganando o perdiendo plata"
    },
    {
      icon: "⏰",
      titulo: "Pierdes tiempo cerrando caja",
      descripcion: "Contar billetes, revisar el cuaderno. Te demoras 1 hora o más todos los días"
    },
    {
      icon: "📦",
      titulo: "No sabes qué se acaba",
      descripcion: "Los clientes piden y no tienes. Pierdes ventas porque no sabes qué comprar"
    },
    {
      icon: "💰",
      titulo: "Clientes que deben y no pagan",
      descripcion: "Fías en el cuaderno y luego no te acuerdas quién debe ni cuánto"
    },
    {
      icon: "📓",
      titulo: "El cuaderno es un lío",
      descripcion: "Números borrados, hojas perdidas. No sabes cuánto vendiste la semana pasada"
    },
    {
      icon: "😰",
      titulo: "No sabes si te están robando",
      descripcion: "La caja no cuadra y no sabes si es error o alguien se está llevando plata"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            ¿Te pasa esto en tu bodega?
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Estos son los problemas más comunes de los bodegueros en Perú
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
              Con Coriva Core, deja el cuaderno y ordena tu negocio
            </p>
            <a 
              href="https://wa.me/51913916967?text=Hola,%20tengo%20una%20bodega%20y%20quiero%20ordenar%20mi%20negocio%20con%20Coriva%20Core."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
            >
              💬 Quiero ordenar mi bodega ahora →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
