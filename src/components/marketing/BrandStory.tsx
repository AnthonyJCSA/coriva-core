import ScrollReveal from '@/components/ScrollReveal'

export default function BrandStory() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-indigo-200">
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold mb-4">
                Nuestra historia
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué creamos Coriva Core?
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Coriva nació porque <span className="font-bold text-gray-900">miles de negocios en Perú siguen perdiendo plata</span> por usar cuaderno y Excel.
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Vimos cómo dueños de bodegas y boticas <span className="font-bold text-gray-900">trabajan 12 horas al día</span> pero no saben cuánto ganan. Cierran caja en 1 hora y siempre falta dinero. Pierden ventas porque no saben qué productos comprar.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Hoy ayudamos a dueños de boticas y bodegas a <span className="font-bold text-indigo-600">ordenar su negocio en minutos</span>. Sin cuaderno, sin Excel, sin complicaciones.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Negocios usando Coriva</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="text-4xl font-bold text-blue-600 mb-2">1 día</div>
                  <div className="text-sm text-gray-600">Para estar vendiendo</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="text-4xl font-bold text-purple-600 mb-2">S/ 49</div>
                  <div className="text-sm text-gray-600">Por mes</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
