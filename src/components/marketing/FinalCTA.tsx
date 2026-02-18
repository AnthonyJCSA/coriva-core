import { COPY } from '@/lib/constants'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 -ml-48 -mb-48"></div>
      
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {COPY.finalCTA.headline}
        </h2>
        <p className="text-xl text-white/90 mb-10">
          {COPY.finalCTA.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/registro" className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all text-lg">
            {COPY.finalCTA.ctaPrimary}
          </Link>
          <Link href="/demo" className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-indigo-600 transition-all text-lg">
            {COPY.finalCTA.ctaSecondary}
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-white/90">
          {COPY.finalCTA.trust.map((item, i) => (
            <span key={i} className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
