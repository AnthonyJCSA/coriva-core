import { COPY } from '@/lib/constants'
import ScrollReveal from '@/components/ScrollReveal'

export default function Benefits() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            {COPY.benefits.title}
          </h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {COPY.benefits.items.map((benefit, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-indigo-300 transition-all">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
