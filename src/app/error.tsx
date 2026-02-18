'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">⚠️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Algo salió mal</h1>
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, ocurrió un error inesperado. Nuestro equipo ha sido notificado.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            Intentar de nuevo
          </button>
          <Link href="/" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
            Ir al inicio
          </Link>
        </div>
        <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda?{' '}
            <a href="https://wa.me/51913916967" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold hover:underline">
              Contáctanos por WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
