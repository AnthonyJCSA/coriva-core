'use client'

import { useState } from 'react'

interface CommunicationsProps {
  currentOrg: any
  customers: any[]
}

const waTemplates: Record<string, string> = {
  promo: '🎉 ¡Hola [nombre]! Te tenemos una oferta especial.\n\n🛍️ Hoy: Descuento especial en productos seleccionados.\n\nVisita tu tienda online:\n👉 coriva.app/tienda/tu-negocio\n\n¡Válido solo hoy! ⏰',
  inactive: '👋 Hola [nombre], hace tiempo no te vemos.\n\nTe tenemos un regalo especial para que vuelvas: 10% OFF en tu próxima compra. 🎁\n\nPide en línea: coriva.app/tienda',
  stock: '📦 ¡Hola [nombre]! Ya llegó el producto que tenías pendiente.\n\nHaz tu pedido ahora antes que se agote:\n👉 coriva.app/tienda\n\n📱 O escríbenos directamente.',
  catalog: '🛍️ Hola [nombre]! Ya puedes ver y pedir desde nuestro catálogo digital:\n\n👉 coriva.app/tienda/tu-negocio\n\nProductos frescos todos los días. Delivery disponible. 🚚',
}

const history = [
  { date: 'Hoy', type: 'WhatsApp', sent: 35, read: 28, status: 'Enviado' },
  { date: 'Ayer', type: 'Email', sent: 142, read: 89, status: 'Enviado' },
]

export default function CommunicationsModule({ currentOrg, customers }: CommunicationsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('promo')
  const [waMsg, setWaMsg] = useState(waTemplates.promo)
  const [emailSubject, setEmailSubject] = useState('🎁 Oferta especial de hoy')
  const [recipients, setRecipients] = useState('all')
  const [generatingAI, setGeneratingAI] = useState(false)
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const selectTemplate = (key: string) => {
    setSelectedTemplate(key)
    setWaMsg(waTemplates[key])
  }

  const generateWithAI = async () => {
    setGeneratingAI(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Genera un mensaje de WhatsApp corto y efectivo para ${selectedTemplate === 'promo' ? 'una promoción' : selectedTemplate === 'inactive' ? 'reactivar clientes inactivos' : selectedTemplate === 'stock' ? 'avisar que llegó stock' : 'compartir catálogo digital'}. Negocio: ${currentOrg?.name}. Máximo 5 líneas. Usa emojis.` }],
          context: { negocio: currentOrg?.name, tipo: currentOrg?.business_type },
        }),
      })
      const data = await res.json()
      if (data.reply) setWaMsg(data.reply)
      showToast('✅ Mensaje generado por IA')
    } catch {
      showToast('❌ Error al generar mensaje')
    } finally {
      setGeneratingAI(false)
    }
  }

  const sendCampaign = async (channel: string) => {
    setSending(true)
    await new Promise(r => setTimeout(r, 1500))
    setSending(false)
    showToast(`✅ Campaña enviada por ${channel}`)
  }

  const shareWA = () => {
    const msg = encodeURIComponent(waMsg.replace('[nombre]', ''))
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  const recipientCount = recipients === 'all' ? customers.length || 142 : recipients === 'inactive' ? 8 : 24

  return (
    <div className="p-5 animate-fade-up">
      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-[11px] text-sm font-semibold flex items-center gap-2 animate-slide-in"
          style={{ background: 'var(--card)', border: '1px solid var(--border2)', boxShadow: '0 4px 20px rgba(0,0,0,.5)', color: 'var(--text)', borderLeft: '3px solid var(--green)' }}
        >
          {toast}
        </div>
      )}

      {/* Banner IA */}
      <div
        className="flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl mb-4"
        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.08))', border: '1px solid rgba(99,102,241,.25)' }}
      >
        <div className="w-9 h-9 rounded-[9px] flex items-center justify-center text-base flex-shrink-0" style={{ background: 'var(--gradient)' }}>🤖</div>
        <div className="flex-1 min-w-0">
          <strong className="text-sm font-bold block" style={{ color: 'var(--text)' }}>IA detectó oportunidades de comunicación</strong>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Clientes inactivos · Stock reabastecido · Proveedor pendiente</span>
        </div>
        <button
          onClick={generateWithAI}
          disabled={generatingAI}
          className="px-[14px] py-[7px] rounded-[9px] text-xs font-semibold text-white flex-shrink-0 transition-all disabled:opacity-60"
          style={{ background: 'var(--gradient)' }}
        >
          {generatingAI ? '⏳ Generando...' : '✨ Generar con IA'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
        {/* WhatsApp */}
        <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>📱 Nueva Campaña WhatsApp</span>
            <span className="text-[10px] px-2 py-[2px] rounded-full font-semibold" style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)' }}>Recomendado IA</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {/* Templates */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[.5px] mb-2" style={{ color: 'var(--muted)' }}>Plantillas IA</div>
              <div className="grid grid-cols-2 gap-[6px]">
                {[
                  { key: 'promo', icon: '🎁', title: 'Promoción', desc: 'Oferta especial del día' },
                  { key: 'inactive', icon: '👋', title: 'Clientes inactivos', desc: 'Reactiva clientes' },
                  { key: 'stock', icon: '📦', title: 'Stock reabastecido', desc: 'Avisa llegada de producto' },
                  { key: 'catalog', icon: '📲', title: 'Catálogo digital', desc: 'Comparte tu tienda' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => selectTemplate(t.key)}
                    className="text-left p-3 rounded-[11px] transition-all"
                    style={{
                      background: selectedTemplate === t.key ? 'rgba(99,102,241,.08)' : 'var(--card2)',
                      border: `1px solid ${selectedTemplate === t.key ? 'var(--accent)' : 'var(--border)'}`,
                    }}
                  >
                    <div className="text-xl mb-1">{t.icon}</div>
                    <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>{t.title}</div>
                    <div className="text-[10px]" style={{ color: 'var(--muted)' }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipients */}
            <div className="flex flex-col gap-[5px]">
              <label className="text-[10px] font-bold uppercase tracking-[.5px]" style={{ color: 'var(--muted)' }}>Destinatarios</label>
              <select
                className="px-[13px] py-[9px] rounded-[9px] text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                value={recipients}
                onChange={e => setRecipients(e.target.value)}
              >
                <option value="all">Todos los clientes ({customers.length || 142})</option>
                <option value="inactive">Clientes inactivos +30 días (8)</option>
                <option value="frequent">Clientes frecuentes (24)</option>
              </select>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-[5px]">
              <label className="text-[10px] font-bold uppercase tracking-[.5px]" style={{ color: 'var(--muted)' }}>Mensaje</label>
              <textarea
                rows={5}
                value={waMsg}
                onChange={e => setWaMsg(e.target.value)}
                className="px-[13px] py-[9px] rounded-[9px] text-sm outline-none resize-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', lineHeight: '1.5' }}
              />
            </div>

            {/* Preview */}
            <div className="p-3 rounded-[10px]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="text-[10px] font-bold uppercase tracking-[.5px] mb-2" style={{ color: 'var(--sub)' }}>Vista Previa</div>
              <div
                className="inline-block px-[13px] py-[10px] text-xs text-white leading-relaxed max-w-[80%]"
                style={{ background: '#128C7E', borderRadius: '3px 12px 12px 12px', whiteSpace: 'pre-wrap' }}
              >
                {waMsg}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={generateWithAI}
                disabled={generatingAI}
                className="px-[14px] py-[9px] rounded-[9px] text-xs font-semibold text-white transition-all disabled:opacity-60"
                style={{ background: 'var(--gradient)' }}
              >
                {generatingAI ? '⏳' : '✨ Mejorar con IA'}
              </button>
              <button
                onClick={shareWA}
                className="flex-1 py-[9px] rounded-[9px] text-xs font-semibold transition-all"
                style={{ background: 'rgba(37,211,102,.1)', color: '#25D366', border: '1px solid rgba(37,211,102,.3)' }}
              >
                📱 Enviar por WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Email + Historial */}
        <div className="flex flex-col gap-[14px]">
          {/* Email */}
          <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>📧 Nueva Campaña Email</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-[5px]">
                <label className="text-[10px] font-bold uppercase tracking-[.5px]" style={{ color: 'var(--muted)' }}>Asunto</label>
                <input
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="px-[13px] py-[9px] rounded-[9px] text-sm outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>
              {/* Email preview */}
              <div className="rounded-[9px] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="px-[14px] py-[10px] text-[11px] space-y-[2px]" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                  <div>De: {currentOrg?.name} &lt;{currentOrg?.email || 'hola@coriva.pe'}&gt;</div>
                  <div>Asunto: {emailSubject}</div>
                </div>
                <div className="p-[14px] text-xs leading-[1.7]" style={{ color: 'var(--text)' }}>
                  <div className="text-base font-extrabold mb-3" style={{ color: 'var(--text)' }}>¡Hola! 👋</div>
                  Tenemos una oferta que no puedes perderte:
                  <div className="my-2 p-3 rounded-lg" style={{ background: 'var(--surface)', borderLeft: '3px solid var(--accent)' }}>
                    <strong style={{ color: 'var(--accent2)' }}>Descuento especial hoy</strong><br />
                    <span className="text-[11px]" style={{ color: 'var(--muted)' }}>Solo por tiempo limitado</span>
                  </div>
                  <div className="mt-3">
                    <span className="px-4 py-2 rounded-lg text-white text-xs font-bold" style={{ background: 'var(--gradient)' }}>
                      Ver Catálogo Completo →
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateWithAI}
                  disabled={generatingAI}
                  className="px-[14px] py-[9px] rounded-[9px] text-xs font-semibold text-white transition-all disabled:opacity-60"
                  style={{ background: 'var(--gradient)' }}
                >
                  ✨ IA redacta
                </button>
                <button
                  onClick={() => sendCampaign('Email')}
                  disabled={sending}
                  className="flex-1 py-[9px] rounded-[9px] text-xs font-semibold transition-all disabled:opacity-60"
                  style={{ background: 'rgba(6,182,212,.08)', border: '1px solid rgba(6,182,212,.2)', color: 'var(--accent2)' }}
                >
                  {sending ? '⏳ Enviando...' : '📧 Enviar Email'}
                </button>
              </div>
            </div>
          </div>

          {/* Historial */}
          <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>📊 Historial</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                    {['Fecha', 'Tipo', 'Enviados', 'Leídos', 'Estado'].map(h => (
                      <th key={h} className="px-[14px] py-[9px] text-left font-bold uppercase tracking-[.6px]" style={{ color: 'var(--sub)', fontSize: '10px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(30,45,69,.5)' }}>
                      <td className="px-[14px] py-[10px]" style={{ color: 'var(--text)' }}>{h.date}</td>
                      <td className="px-[14px] py-[10px]">
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold" style={
                          h.type === 'WhatsApp'
                            ? { background: 'rgba(37,211,102,.1)', color: '#25D366' }
                            : { background: 'rgba(59,130,246,.1)', color: 'var(--blue)' }
                        }>{h.type}</span>
                      </td>
                      <td className="px-[14px] py-[10px]" style={{ color: 'var(--text)' }}>{h.sent}</td>
                      <td className="px-[14px] py-[10px] font-bold" style={{ color: 'var(--green)' }}>{h.read}</td>
                      <td className="px-[14px] py-[10px]">
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold" style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)' }}>{h.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
