import ScrollReveal from '@/components/ScrollReveal'

export default function StorysellingBotica() {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-green-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                RM
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Rosa Mendoza</h3>
                <p className="text-gray-600">Botica Santa Rosa - San Juan de Lurigancho</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-gray-700">
                  <span className="font-bold text-red-600">Antes:</span> Cerraba caja en 1 hora y siempre faltaba dinero. No sabía si era error mío o alguien se llevaba plata. Perdía ventas porque no sabía qué medicamentos comprar.
                </p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <p className="text-gray-700">
                  <span className="font-bold text-green-600">Ahora:</span> Cierro caja en 1 minuto y sé exactamente cuánto gané hoy. El sistema me avisa cuando se acaba un medicamento. Ya no pierdo ventas.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600">1 min</div>
                  <div className="text-sm text-gray-600">Cierre de caja</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">+35%</div>
                  <div className="text-sm text-gray-600">Más ventas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">S/ 0</div>
                  <div className="text-sm text-gray-600">Dinero perdido</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
