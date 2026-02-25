export default function CTAFinalBodega() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Deja el cuaderno y ordena tu bodega hoy
        </h2>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Únete a las bodegas que ya controlan sus ventas, mercadería y plata con Coriva Core
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a 
            href="https://wa.me/51913916967?text=Hola,%20tengo%20una%20bodega%20y%20quiero%20ordenar%20mi%20negocio%20con%20Coriva%20Core."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
          >
            💬 Hablar con un asesor ahora
          </a>
          <a 
            href="/demo"
            className="border-2 border-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
          >
            Ver cómo funciona
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm opacity-90">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Implementación gratis
          </span>
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Ordena tu negocio en 1 día
          </span>
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Desde S/49 al mes
          </span>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-sm opacity-75">
            📞 También puedes llamarnos: +51 913 916 967<br />
            📧 O escribirnos: soporte@coriva.com
          </p>
        </div>
      </div>
    </section>
  )
}
