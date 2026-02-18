'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { trackEvent } from './Analytics'

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && !localStorage.getItem('coriva_exit_shown')) {
        setIsVisible(true)
        setHasShown(true)
        localStorage.setItem('coriva_exit_shown', Date.now().toString())
        trackEvent('exit_intent_shown', 'popup', 'exit_attempt')
      }
    }

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > 70 && !hasShown && !localStorage.getItem('coriva_exit_shown')) {
        setIsVisible(true)
        setHasShown(true)
        localStorage.setItem('coriva_exit_shown', Date.now().toString())
        trackEvent('exit_intent_shown', 'popup', 'scroll_70')
      }
    }

    const shown = localStorage.getItem('coriva_exit_shown')
    const daysSinceShown = shown ? (Date.now() - parseInt(shown)) / (1000 * 60 * 60 * 24) : 999
    
    if (daysSinceShown > 7) {
      localStorage.removeItem('coriva_exit_shown')
      document.addEventListener('mouseleave', handleMouseLeave)
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasShown])

  const handleClose = () => {
    setIsVisible(false)
    trackEvent('exit_intent_closed', 'popup', 'close_button')
  }

  const handleCTA = () => {
    trackEvent('exit_intent_converted', 'popup', 'cta_clicked')
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏰</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">¡Espera!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Antes de irte, prueba Coriva <span className="font-bold text-indigo-600">gratis por 30 días</span>
          </p>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-indigo-200">
            <p className="text-2xl font-bold text-gray-900 mb-2">🎁 Oferta especial</p>
            <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">50% OFF</p>
            <p className="text-sm text-gray-600">En tu primer año si te registras hoy</p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Sin tarjeta
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Cancela cuando quieras
              </div>
            </div>
          </div>

          <Link href="/registro" onClick={handleCTA} className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all mb-3 transform hover:scale-105">
            Crear mi cuenta gratis →
          </Link>
          
          <button onClick={handleClose} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            No gracias, prefiero seguir perdiendo ventas
          </button>
        </div>
      </div>
    </div>
  )
}
