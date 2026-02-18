import { COPY } from '@/lib/constants'
import Link from 'next/link'

export default function UseCases() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          {COPY.useCases.title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COPY.useCases.cases.map((useCase, i) => (
            <Link key={i} href={useCase.link} className="group bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{useCase.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{useCase.title}</h3>
              <p className="text-gray-600 mb-4">{useCase.description}</p>
              <span className="text-indigo-600 font-semibold group-hover:underline">Ver cómo funciona →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
