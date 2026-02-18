'use client'

import { COPY } from '@/lib/constants'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 -ml-48 -mb-48"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <p className="text-indigo-600 font-semibold text-sm md:text-base">{COPY.hero.eyebrow}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            {COPY.hero.headline}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {COPY.hero.subheadline}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">{COPY.hero.description}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/registro" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-center">
              {COPY.hero.ctaPrimary} →
            </Link>
            <Link href="/demo" className="border-2 border-gray-300 px-8 py-4 rounded-xl font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-all text-center">
              {COPY.hero.ctaSecondary}
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {COPY.hero.trust.map((item, i) => (
              <span key={i} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg"></div>
                  <div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    <div className="h-2 w-16 bg-gray-100 rounded mt-2"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600">S/ 12,450</div>
                  <div className="text-xs text-gray-600 mt-1">Ventas hoy</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-xs text-gray-600 mt-1">Productos</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🤖</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">Alerta de IA</div>
                    <div className="text-xs text-gray-600 mt-1">"Coca Cola 1L" se agotará en 2 días.</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">💬</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">WhatsApp Automático</div>
                    <div className="text-xs text-gray-600 mt-1">Cliente pagó S/ 150. Deuda saldada.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm animate-pulse">
            🔥 50% OFF
          </div>
        </div>
      </div>
    </section>
  )
}
