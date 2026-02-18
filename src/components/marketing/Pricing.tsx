import { COPY } from '@/lib/constants'
import Link from 'next/link'

export default function Pricing() {
  return (
    <section className="py-20 bg-white relative">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-3 font-bold shadow-lg">
        {COPY.pricing.banner}
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">Precios simples y transparentes</h2>
        <p className="text-center text-gray-600 mb-12">Elige el plan perfecto para tu negocio</p>
        <div className="grid md:grid-cols-3 gap-8">
          {COPY.pricing.plans.map((plan, i) => (
            <div key={i} className={`relative bg-white rounded-2xl border-2 p-8 ${plan.popular ? 'border-indigo-500 shadow-2xl scale-105' : 'border-gray-200 shadow-lg'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  🔥 Más Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">S/ {plan.price}</span>
                  <span className="text-gray-600 ml-2">/ {plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="text-gray-500 line-through text-sm mt-1">S/ {plan.originalPrice}</div>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/registro" className={`block text-center py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center mt-12 text-gray-600 font-medium">{COPY.pricing.guarantee}</p>
      </div>
    </section>
  )
}
