import { COPY } from '@/lib/constants'
import Link from 'next/link'

export default function Comparison() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
          {COPY.comparison.title}
        </h2>
        <p className="text-center text-gray-600 mb-12">Comparación directa con Treinta</p>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Característica</th>
                <th className="px-6 py-4 text-center font-bold">Coriva</th>
                <th className="px-6 py-4 text-center font-bold">Treinta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {COPY.comparison.features.map((feature, i) => (
                <tr key={i} className={feature.winner ? 'bg-green-50' : ''}>
                  <td className="px-6 py-4 font-medium text-gray-900">{feature.name}</td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600">{feature.coriva}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{feature.treinta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-8">
          <Link href="/registro" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
            {COPY.comparison.cta} →
          </Link>
        </div>
      </div>
    </section>
  )
}
