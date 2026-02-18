import Link from 'next/link'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Coriva</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#beneficios" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Beneficios</Link>
            <Link href="/#precios" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Precios</Link>
            <Link href="/comparacion" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">vs Treinta</Link>
            <Link href="/demo" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Demo</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Iniciar sesión</Link>
            <Link href="/registro" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all">
              Empezar gratis
            </Link>
          </div>
        </nav>
      </header>
      
      <main className="flex-1">{children}</main>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-2xl font-bold">Coriva</span>
              </div>
              <p className="text-gray-400 text-sm">Tu negocio en piloto automático con IA y WhatsApp.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/#beneficios" className="hover:text-white transition-colors">Beneficios</Link></li>
                <li><Link href="/#precios" className="hover:text-white transition-colors">Precios</Link></li>
                <li><Link href="/comparacion" className="hover:text-white transition-colors">vs Treinta</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Casos de Uso</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/casos-de-uso/bodega" className="hover:text-white transition-colors">Bodega</Link></li>
                <li><Link href="/casos-de-uso/tienda-ropa" className="hover:text-white transition-colors">Tienda de Ropa</Link></li>
                <li><Link href="/casos-de-uso/salon-belleza" className="hover:text-white transition-colors">Salón de Belleza</Link></li>
                <li><Link href="/casos-de-uso/restaurante" className="hover:text-white transition-colors">Restaurante</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://wa.me/51913916967" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a></li>
                <li><a href="mailto:soporte@coriva.com" className="hover:text-white transition-colors">Email</a></li>
                <li><Link href="/ayuda" className="hover:text-white transition-colors">Centro de Ayuda</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2024 Coriva Core. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
