'use client'

import { useState } from 'react'
import DemoModal from '@/components/DemoModal'

export default function HeroBotica() {
  const [showModal, setShowModal] = useState(false)
  const whatsappUrl = "https://wa.me/51913916967?text=Hola,%20tengo%20una%20botica%20y%20quiero%20digitalizar%20mi%20negocio%20con%20Coriva%20Core."

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20 -ml-48 -mb-48"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <p className="text-green-600 font-semibold text-sm md:text-base">💊 Sistema especializado para boticas en Perú</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Sistema para boticas que te ayuda a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">vender más y no perder dinero</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Controla tus ventas, stock y deudas sin cuaderno ni Excel. Desde S/49 al mes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all text-center"
            >
              💬 Quiero que me lo instalen (WhatsApp) →
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold hover:border-green-600 hover:text-green-600 transition-all text-center"
            >
              Ver cómo funciona
            </button>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <span className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Implementación gratis
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Soporte en Perú
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Desde S/49 al mes
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-white text-xl">💊</div>
                  <div>
                    <div className="font-bold text-gray-900">Botica San Juan</div>
                    <div className="text-xs text-gray-500">Lima, Perú</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600">S/ 2,450</div>
                  <div className="text-xs text-gray-600 mt-1">Ventas hoy</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">324</div>
                  <div className="text-xs text-gray-600 mt-1">Medicamentos</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚠️</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">Stock bajo</div>
                    <div className="text-xs text-gray-600 mt-1">Paracetamol 500mg - Quedan 8 unidades</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">✅</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">Caja cerrada</div>
                    <div className="text-xs text-gray-600 mt-1">S/ 2,450 en ventas - Sin diferencias</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm animate-pulse">
            🔥 Oferta limitada
          </div>
        </div>
      </div>
      <DemoModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        whatsappUrl={whatsappUrl}
      />
    </section>
  )
}
