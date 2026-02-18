'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const router = useRouter()

  useEffect(() => {
    localStorage.setItem('coriva_demo_mode', 'true')
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
          <span className="text-white text-3xl">🚀</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargando Demo...</h2>
        <p className="text-gray-600">Preparando tu experiencia con datos de ejemplo</p>
      </div>
    </div>
  )
}
