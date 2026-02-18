import Link from 'next/link'

export const metadata = {
  title: 'Coriva vs Treinta - Comparación Completa 2024',
  description: 'Comparación detallada entre Coriva y Treinta. Descubre por qué Coriva es más rápido, tiene IA predictiva y WhatsApp automático.'
}

const COMPARACION = [
  { categoria: 'Velocidad', feature: 'Tiempo de venta', coriva: '< 5 segundos', treinta: '~15 segundos', winner: 'coriva' },
  { categoria: 'Velocidad', feature: 'Búsqueda de productos', coriva: 'Instantánea con IA', treinta: 'Manual', winner: 'coriva' },
  { categoria: 'Inteligencia Artificial', feature: 'Alertas de stock', coriva: '3 días antes', treinta: 'No disponible', winner: 'coriva' },
  { categoria: 'Inteligencia Artificial', feature: 'Predicción de ventas', coriva: 'Incluido', treinta: 'No disponible', winner: 'coriva' },
  { categoria: 'Inteligencia Artificial', feature: 'Recomendaciones', coriva: 'Automáticas', treinta: 'No disponible', winner: 'coriva' },
  { categoria: 'WhatsApp', feature: 'Cobros automáticos', coriva: 'Incluido', treinta: 'No disponible', winner: 'coriva' },
  { categoria: 'WhatsApp', feature: 'Recordatorios de deuda', coriva: 'Automático', treinta: 'Manual', winner: 'coriva' },
  { categoria: 'WhatsApp', feature: 'Notificaciones', coriva: 'Personalizables', treinta: 'Básicas', winner: 'coriva' },
  { categoria: 'Inventario', feature: 'Códigos de barras', coriva: 'Completo', treinta: 'Limitado', winner: 'coriva' },
  { categoria: 'Inventario', feature: 'Importación Excel', coriva: 'Ilimitada', treinta: 'Limitada', winner: 'coriva' },
  { categoria: 'Inventario', feature: 'Variantes (tallas/colores)', coriva: 'Incluido', treinta: 'No disponible', winner: 'coriva' },
  { categoria: 'Caja', feature: 'Control en tiempo real', coriva: 'Completo', treinta: 'Básico', winner: 'coriva' },
  { categoria: 'Caja', feature: 'Múltiples cajas', coriva: 'Ilimitadas', treinta: 'Limitado', winner: 'coriva' },
  { categoria: 'Reportes', feature: 'Reportes con IA', coriva: 'Incluido', treinta: 'No disponible', winner: 'coriva' },
  { categoria: 'Reportes', feature: 'Exportación', coriva: 'Excel/CSV/PDF', treinta: 'Solo Excel', winner: 'coriva' },
  { categoria: 'Reportes', feature: 'Análisis predictivo', coriva: 'Incluido', treinta: 'No disponible', winner: 'coriva' },
  { categoria: 'Usuarios', feature: 'Usuarios incluidos', coriva: 'Ilimitados gratis', treinta: 'De pago', winner: 'coriva' },
  { categoria: 'Usuarios', feature: 'Roles y permisos', coriva: '3 niveles', treinta: '2 niveles', winner: 'coriva' },
  { categoria: 'Multi-negocio', feature: 'Multi-sucursal', coriva: 'Incluido', treinta: 'No disponible', winner: 'coriva' },
  { categoria: 'Multi-negocio', feature: 'Consolidado', coriva: 'Automático', treinta: 'No disponible', winner: 'coriva' },
  { categoria: 'Soporte', feature: 'WhatsApp', coriva: '< 1 hora', treinta: 'Email', winner: 'coriva' },
  { categoria: 'Soporte', feature: 'Horario', coriva: 'Lun-Sáb 8am-8pm', treinta: 'Lun-Vie', winner: 'coriva' },
  { categoria: 'Precio', feature: 'Plan gratuito', coriva: 'Completo', treinta: 'Limitado', winner: 'coriva' },
  { categoria: 'Precio', feature: 'Plan Pro', coriva: 'S/ 49/mes', treinta: 'S/ 79/mes', winner: 'coriva' }
]

export default function ComparacionPage() {
  const categorias = Array.from(new Set(COMPARACION.map(item => item.categoria)))

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Coriva</span>
          </Link>
          <Link href="/registro" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
            Empezar gratis
          </Link>
        </nav>
      </header>

      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Coriva vs Treinta</h1>
          <p className="text-2xl text-gray-600 mb-8">Comparación completa y honesta</p>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Ambos son excelentes sistemas POS. Aquí te mostramos las diferencias para que elijas el mejor para tu negocio.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-indigo-200">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Coriva Core</h3>
              <p className="text-gray-700 mb-4">Sistema POS con IA y WhatsApp automático</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ IA predictiva incluida</li>
                <li>✅ WhatsApp automático</li>
                <li>✅ Usuarios ilimitados gratis</li>
                <li>✅ Multi-sucursal</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-200">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Treinta</h3>
              <p className="text-gray-700 mb-4">Sistema POS simple y confiable</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ Interfaz simple</li>
                <li>✅ Fácil de usar</li>
                <li>✅ Reconocido en LATAM</li>
                <li>✅ Soporte por email</li>
              </ul>
            </div>
          </div>

          {categorias.map((categoria, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{categoria}</h2>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Característica</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-indigo-600">Coriva</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Treinta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {COMPARACION.filter(item => item.categoria === categoria).map((item, i) => (
                      <tr key={i} className={item.winner === 'coriva' ? 'bg-green-50' : ''}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.feature}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${item.winner === 'coriva' ? 'bg-green-100 text-green-800' : 'text-gray-700'}`}>
                            {item.coriva}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">{item.treinta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">¿Cuál elegir?</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-8 rounded-2xl border-2 border-indigo-200">
              <h3 className="text-xl font-bold text-indigo-600 mb-4">Elige Coriva si:</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✅ Necesitas IA y automatización</li>
                <li>✅ Quieres WhatsApp automático</li>
                <li>✅ Tienes múltiples sucursales</li>
                <li>✅ Necesitas usuarios ilimitados</li>
                <li>✅ Buscas velocidad máxima</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Elige Treinta si:</h3>
              <ul className="space-y-3 text-gray-700">
                <li>✅ Prefieres simplicidad extrema</li>
                <li>✅ No necesitas IA</li>
                <li>✅ Tienes un solo local</li>
                <li>✅ Pocos usuarios</li>
                <li>✅ Ya lo conoces</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Prueba Coriva gratis por 30 días</h2>
          <p className="text-xl text-white/90 mb-10">Sin tarjeta de crédito. Sin compromiso. Cancela cuando quieras.</p>
          <Link href="/registro" className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all text-lg">
            Empezar ahora →
          </Link>
        </div>
      </section>
    </div>
  )
}
