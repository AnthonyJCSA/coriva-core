import Link from 'next/link'
import { notFound } from 'next/navigation'

const CASOS_DE_USO = {
  bodega: {
    icon: '🛒',
    title: 'Bodega o Minimarket',
    subtitle: 'Controla 500+ productos y vende rápido',
    hero: 'Sistema POS diseñado para bodegas que necesitan velocidad y control total',
    benefits: [
      { icon: '⚡', title: 'Venta ultra-rápida', desc: 'Cobra en menos de 5 segundos con búsqueda inteligente' },
      { icon: '📦', title: 'Control de 500+ productos', desc: 'Gestiona todo tu inventario sin complicaciones' },
      { icon: '🤖', title: 'IA que predice desabastecimientos', desc: 'Te avisa 3 días antes de que se acabe un producto' },
      { icon: '💰', title: 'Control de caja automático', desc: 'Apertura, cierre y cuadre sin errores' }
    ],
    features: ['Búsqueda por código o nombre', 'Alertas de stock bajo', 'Múltiples métodos de pago', 'Reportes de productos más vendidos', 'Control de vencimientos', 'Gestión de proveedores'],
    testimonial: { quote: 'Antes perdía 2 horas diarias cerrando caja. Ahora Coriva lo hace en 30 segundos.', author: 'María González', business: 'Bodega El Ahorro, Lima' }
  },
  'tienda-ropa': {
    icon: '👕',
    title: 'Tienda de Ropa',
    subtitle: 'Gestiona tallas, colores y temporadas',
    hero: 'Control total de tu inventario textil con variantes y temporadas',
    benefits: [
      { icon: '🎨', title: 'Variantes de producto', desc: 'Gestiona tallas, colores y modelos en un solo producto' },
      { icon: '📊', title: 'Análisis de ventas', desc: 'Sabe qué tallas y colores se venden más' },
      { icon: '🏷️', title: 'Promociones y descuentos', desc: 'Crea ofertas por temporada automáticamente' },
      { icon: '📸', title: 'Fotos de productos', desc: 'Agrega imágenes para identificar rápido' }
    ],
    features: ['Control por tallas y colores', 'Temporadas (Verano, Invierno)', 'Descuentos automáticos', 'Etiquetas de precio', 'Historial de ventas por modelo', 'Alertas de stock por variante'],
    testimonial: { quote: 'La IA me avisó que se acababa mi producto estrella. Reabastecí a tiempo y vendí el doble.', author: 'Carlos Ruiz', business: 'Fashion Store, Arequipa' }
  },
  'salon-belleza': {
    icon: '💇',
    title: 'Salón de Belleza',
    subtitle: 'Servicios y productos en un solo lugar',
    hero: 'Gestiona citas, servicios y venta de productos de belleza',
    benefits: [
      { icon: '📅', title: 'Agenda de citas', desc: 'Programa servicios y recibe recordatorios' },
      { icon: '💄', title: 'Servicios + Productos', desc: 'Vende tratamientos y productos en la misma venta' },
      { icon: '👥', title: 'Historial de clientes', desc: 'Recuerda qué servicios prefiere cada cliente' },
      { icon: '💬', title: 'WhatsApp automático', desc: 'Envía recordatorios de citas por WhatsApp' }
    ],
    features: ['Catálogo de servicios', 'Venta de productos', 'Historial por cliente', 'Recordatorios automáticos', 'Control de comisiones', 'Reportes por servicio'],
    testimonial: { quote: 'WhatsApp cobra por mí. Mis clientes pagan más rápido y yo no persigo deudas.', author: 'Ana Torres', business: 'Salón Glamour, Cusco' }
  },
  restaurante: {
    icon: '🍔',
    title: 'Restaurante o Cafetería',
    subtitle: 'Toma pedidos rápido y controla ingredientes',
    hero: 'Sistema POS para restaurantes con control de comandas e ingredientes',
    benefits: [
      { icon: '🍽️', title: 'Comandas digitales', desc: 'Toma pedidos desde el celular o tablet' },
      { icon: '📦', title: 'Control de ingredientes', desc: 'Sabe cuándo reabastecer cada insumo' },
      { icon: '👨🍳', title: 'Cocina sincronizada', desc: 'Los pedidos llegan directo a cocina' },
      { icon: '💵', title: 'División de cuentas', desc: 'Divide la cuenta entre varios comensales' }
    ],
    features: ['Menú digital', 'Control de mesas', 'Comandas a cocina', 'Recetas con ingredientes', 'Alertas de insumos', 'Propinas automáticas'],
    testimonial: { quote: 'Reduje el tiempo de atención a la mitad. Mis clientes están más satisfechos.', author: 'Roberto Díaz', business: 'Café Central, Trujillo' }
  }
}

export function generateStaticParams() {
  return Object.keys(CASOS_DE_USO).map((tipo) => ({ tipo }))
}

export function generateMetadata({ params }: { params: { tipo: string } }) {
  const caso = CASOS_DE_USO[params.tipo as keyof typeof CASOS_DE_USO]
  if (!caso) return {}
  return { title: `${caso.title} - Coriva Core`, description: caso.hero }
}

export default function CasoDeUsoPage({ params }: { params: { tipo: string } }) {
  const caso = CASOS_DE_USO[params.tipo as keyof typeof CASOS_DE_USO]
  if (!caso) notFound()

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
          <div className="text-6xl mb-6">{caso.icon}</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{caso.title}</h1>
          <p className="text-2xl text-gray-600 mb-8">{caso.subtitle}</p>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">{caso.hero}</p>
          <Link href="/registro" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-lg">
            Probar gratis por 30 días →
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Diseñado específicamente para ti</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {caso.benefits.map((benefit, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-lg">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Funcionalidades incluidas</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {caso.features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-200">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-12 rounded-2xl border-2 border-indigo-200 text-center">
            <div className="text-5xl mb-6">💬</div>
            <p className="text-2xl text-gray-900 italic mb-6">"{caso.testimonial.quote}"</p>
            <p className="text-lg font-bold text-gray-900">{caso.testimonial.author}</p>
            <p className="text-gray-600">{caso.testimonial.business}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">¿Listo para transformar tu {caso.title.toLowerCase()}?</h2>
          <p className="text-xl text-white/90 mb-10">Únete a los 10,000+ negocios que ya crecen con Coriva</p>
          <Link href="/registro" className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all text-lg">
            Empezar gratis ahora →
          </Link>
        </div>
      </section>
    </div>
  )
}
