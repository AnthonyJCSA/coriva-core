import ScrollReveal from '@/components/ScrollReveal'

export default function OfertaBodega() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-orange-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-bl-2xl font-bold">
              🔥 OFERTA LIMITADA
            </div>
            
            <div className="mt-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Oferta especial para bodegas
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Solo por tiempo limitado
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-300 mb-8">
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <div className="text-5xl font-bold text-blue-600 mb-2">S/ 0</div>
                    <div className="text-gray-700 font-semibold">Implementación gratis</div>
                    <div className="text-sm text-gray-500">(Valor: S/ 300)</div>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-blue-600 mb-2">S/ 49</div>
                    <div className="text-gray-700 font-semibold">Por mes</div>
                    <div className="text-sm text-gray-500 line-through">Antes S/ 99</div>
                  </div>
                </div>
                
                <div className="border-t-2 border-blue-200 pt-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Incluye:</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-left">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Control de ventas</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Control de mercadería</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Control de caja</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Alertas cuando se acaba</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Reportes de ventas</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Control de deudas</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Soporte en Perú</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Te enseñamos a usarlo</span>
                    </div>
                  </div>
                </div>
              </div>

              <a 
                href="https://wa.me/51913916967?text=Hola,%20tengo%20una%20bodega%20y%20quiero%20ordenar%20mi%20negocio%20con%20Coriva%20Core."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all mb-4"
              >
                💬 Quiero esta oferta para mi bodega →
              </a>
              
              <p className="text-sm text-gray-500">
                ⏰ Oferta válida solo para las primeras 50 bodegas
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
