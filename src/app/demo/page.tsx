'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/registro') }, [router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, background: '#0C0E12', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>🚀</div>
        <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16, color: '#6B7280' }}>Redirigiendo...</p>
      </div>
    </div>
  )
}
