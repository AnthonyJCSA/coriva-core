import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-700 mb-4">Página no encontrada</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
            Ir al inicio
          </Link>
          <Link href="/registro" className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all">
            Crear cuenta gratis
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <Link href="/casos-de-uso/bodega" className="text-gray-600 hover:text-indigo-600 transition-colors">
            🛒 Bodega
          </Link>
          <Link href="/casos-de-uso/tienda-ropa" className="text-gray-600 hover:text-indigo-600 transition-colors">
            👕 Tienda de Ropa
          </Link>
          <Link href="/casos-de-uso/salon-belleza" className="text-gray-600 hover:text-indigo-600 transition-colors">
            💇 Salón de Belleza
          </Link>
          <Link href="/casos-de-uso/restaurante" className="text-gray-600 hover:text-indigo-600 transition-colors">
            🍔 Restaurante
          </Link>
        </div>
      </div>
    </div>
  )
}
