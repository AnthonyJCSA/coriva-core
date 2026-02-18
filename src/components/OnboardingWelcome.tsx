'use client'

import { useState } from 'react'

interface OnboardingWelcomeProps {
  onComplete: () => void
  onDemo: () => void
}

export default function OnboardingWelcome({ onComplete, onDemo }: OnboardingWelcomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      icon: '⏰',
      title: 'Ahorra 10 horas a la semana',
      description: 'Desde hoy, ya no perderás tiempo contando inventario o cerrando caja manualmente. Coriva lo hace por ti en segundos.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '💰',
      title: 'Controla cada sol que entra y sale',
      description: 'Sabrás exactamente cuánto debes, cuánto te deben y cuánto tienes en caja. Sin sorpresas a fin de mes.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '📦',
      title: 'Nunca más pierdas ventas',
      description: 'La IA te avisa 3 días antes de que se acabe un producto. Tus clientes siempre encuentran lo que buscan.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🚀',
      title: '¡Listo para empezar!',
      description: 'Configura tu negocio en 3 pasos o prueba el modo demo con datos precargados.',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className={`bg-gradient-to-br ${slides[currentSlide].color} rounded-3xl shadow-2xl p-12 text-center text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>
          
          <div className="relative z-10">
            <div className="text-8xl mb-6 animate-bounce">{slides[currentSlide].icon}</div>
            <h1 className="text-4xl font-bold mb-4">{slides[currentSlide].title}</h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">{slides[currentSlide].description}</p>

            <div className="flex justify-center gap-2 mb-8">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>

            {currentSlide === slides.length - 1 ? (
              <div className="space-y-4">
                <button
                  onClick={onComplete}
                  className="w-full bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 shadow-lg transition-all text-lg"
                >
                  Configurar mi negocio →
                </button>
                <button
                  onClick={onDemo}
                  className="w-full bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition-all border-2 border-white/40"
                >
                  🎮 Probar modo demo
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentSlide(slides.length - 1)}
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all"
                >
                  Saltar
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 shadow-lg transition-all"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
