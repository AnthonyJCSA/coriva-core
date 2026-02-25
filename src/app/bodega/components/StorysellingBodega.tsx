import ScrollReveal from '@/components/ScrollReveal'

export default function StorysellingBodega() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-blue-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                JP
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Juan Pérez</h3>
                <p className="text-gray-600">Bodega Don Juan - San Juan de Miraflores</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-gray-700">
                  <span className="font-bold text-red-600">Antes:</span> No sabía cuánto ganaba al día. Cerraba caja en 1 hora y siempre faltaba plata. No sabía qué productos comprar y perdía ventas.
                </p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <p className="text-gray-700">
                  <span className="font-bold text-green-600">Ahora:</span> Veo mis ventas en tiempo real desde mi celular. Cierro caja en 1 minuto. El sistema me avisa qué se está acabando y ya no pierdo ventas.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">1 min</div>
                  <div className="text-sm text-gray-600">Cierre de caja</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">+40%</div>
                  <div className="text-sm text-gray-600">Más ventas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">S/ 0</div>
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
