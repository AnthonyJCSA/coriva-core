'use client'

import { useState } from 'react'

interface WhatsAppWidgetProps {
  defaultMessage?: string
}

export default function WhatsAppWidget({ defaultMessage = "Hola,%20necesito%20ayuda%20con%20Coriva%20Core" }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 z-50 animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="font-bold text-gray-900">Soporte Coriva</p>
                <p className="text-xs text-green-600">● En línea</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-4">¿Necesitas ayuda? Escríbenos por WhatsApp y te respondemos en menos de 1 hora.</p>
          <a
            href={`https://wa.me/51962257626?text=${defaultMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-xl font-bold transition-all"
          >
            Iniciar chat →
          </a>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all hover:scale-110 z-50"
        title="Chat con soporte"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </>
  )
}
