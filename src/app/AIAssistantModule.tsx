'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  time: string
}

interface AIAssistantProps {
  products: any[]
  sales: any[]
  currentOrg: any
}

const quickQuestions = [
  { label: '📈 Producto más vendido', q: '¿Cuál es mi producto más vendido esta semana?' },
  { label: '📦 Reabastecimiento urgente', q: '¿Qué productos debo reabastecer urgente?' },
  { label: '📱 Mensaje para inactivos', q: 'Genera un mensaje de WhatsApp para clientes inactivos' },
  { label: '💡 Subir ticket promedio', q: '¿Cómo puedo aumentar mi ticket promedio?' },
  { label: '🔮 Predicción fin de semana', q: 'Predice mis ventas para este fin de semana' },
  { label: '🏆 Clientes más valiosos', q: '¿Cuáles son mis clientes más valiosos?' },
]

export default function AIAssistantModule({ products, sales, currentOrg }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hola! Soy tu asistente IA de Coriva. Puedo ayudarte a:\n\n• Analizar tus ventas y predecir tendencias\n• Alertarte sobre stock bajo y recomendar pedidos\n• Crear mensajes para clientes por WhatsApp o email\n• Sugerir promociones basadas en datos reales\n\n¿En qué te ayudo hoy?',
      time: 'Ahora',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages])

  const buildContext = () => ({
    negocio: currentOrg?.name,
    tipo: currentOrg?.business_type,
    moneda: currentOrg?.settings?.currency || 'S/',
    totalProductos: products.length,
    stockCritico: products.filter(p => p.stock <= (p.min_stock || 5)).map(p => ({ nombre: p.name, stock: p.stock })),
    ventasHoy: sales.filter(s => s.created_at?.startsWith(new Date().toISOString().split('T')[0])).length,
    totalVentas: sales.length,
    ventasTotales: sales.reduce((sum, s) => sum + (s.total || 0), 0).toFixed(2),
  })

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    const userMsg: Message = { role: 'user', content: msg, time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context: buildContext(),
        }),
      })
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'No pude obtener respuesta.',
          time: 'Coriva IA',
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Error al conectar con la IA. Verifica tu conexión.', time: 'Error' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat limpiado. ¿En qué te ayudo?', time: 'Ahora' }])
  }

  return (
    <div className="p-5 animate-fade-up">
      <div
        className="grid gap-[14px]"
        style={{ gridTemplateColumns: '1fr', height: 'calc(100vh - 140px)' }}
      >
        <div className="grid gap-[14px]" style={{ gridTemplateColumns: '1fr 320px', height: '100%' }}>

          {/* Chat panel */}
          <div
            className="rounded-[13px] flex flex-col overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-[10px]" style={{ borderBottom: '1px solid var(--border)' }}>
              <div
                className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-base flex-shrink-0"
                style={{ background: 'var(--gradient)' }}
              >
                🤖
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>Coriva IA — Asistente de Negocio</div>
                <div className="text-[10px]" style={{ color: 'var(--green)' }}>● En línea · GPT-4o powered</div>
              </div>
              <button
                onClick={clearChat}
                className="ml-auto px-3 py-[7px] rounded-[9px] text-xs font-semibold transition-all"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
              >
                🗑 Limpiar
              </button>
            </div>

            {/* Messages */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 touch-scroll">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] px-[13px] py-[10px] rounded-xl text-sm leading-relaxed"
                    style={
                      m.role === 'user'
                        ? { background: 'var(--gradient)', color: '#fff', borderRadius: '12px 12px 4px 12px' }
                        : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px 12px 12px 12px' }
                    }
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                    <div className="text-[10px] mt-[3px]" style={{ color: m.role === 'user' ? 'rgba(255,255,255,.6)' : 'var(--sub)' }}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-[13px] py-[10px] rounded-xl text-sm"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '4px 12px 12px 12px' }}
                  >
                    <span className="animate-pulse-dot">● ● ●</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-[14px] py-3 flex gap-2" style={{ borderTop: '1px solid var(--border)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ej: ¿Cuáles son mis productos con más margen?"
                className="flex-1 px-[13px] py-[9px] rounded-[9px] text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="px-[14px] py-[7px] rounded-[9px] text-xs font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: 'var(--gradient)' }}
              >
                Enviar ↗
              </button>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-[10px] overflow-y-auto touch-scroll">
            {/* Quick questions */}
            <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>⚡ Preguntas Rápidas</span>
              </div>
              <div className="p-[10px] flex flex-col gap-[6px]">
                {quickQuestions.map(qq => (
                  <button
                    key={qq.q}
                    onClick={() => sendMessage(qq.q)}
                    className="w-full text-left p-3 rounded-[11px] transition-all"
                    style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
                  >
                    <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>{qq.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>📊 KPIs Clave</span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {[
                  { val: String(products.length), lbl: 'Productos' },
                  { val: String(sales.length), lbl: 'Ventas total' },
                  { val: String(products.filter(p => p.stock <= (p.min_stock || 5)).length), lbl: 'Stock crítico' },
                  { val: `${currentOrg?.settings?.currency || 'S/'} ${sales.reduce((s, v) => s + (v.total || 0), 0).toFixed(0)}`, lbl: 'Ingresos' },
                ].map(k => (
                  <div key={k.lbl} className="text-center p-[10px] rounded-[9px]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="text-lg font-extrabold" style={{ color: 'var(--accent)' }}>{k.val}</div>
                    <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{k.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
