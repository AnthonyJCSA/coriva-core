'use client'

import { useState, useEffect } from 'react'
import { exportSalesToCSV } from '../lib/export'

interface Sale {
  id: string; sale_number: string; total: number; created_at: string
  customer_name?: string; payment_method: string; status?: string; receipt_type?: string
}

export default function ReportsModule({ sales, currentUser }: { sales: Sale[]; currentUser: any }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setStartDate(today); setEndDate(today)
  }, [])

  const filtered = sales.filter(s => {
    if (!startDate || !endDate) return true
    const d = new Date(s.created_at).toISOString().split('T')[0]
    return d >= startDate && d <= endDate
  })

  const totalSales = filtered.reduce((s, v) => s + v.total, 0)
  const avgTicket = filtered.length > 0 ? totalSales / filtered.length : 0

  const paymentBreakdown = filtered.reduce((acc: Record<string, number>, s) => {
    acc[s.payment_method] = (acc[s.payment_method] || 0) + s.total
    return acc
  }, {})
  const paymentTotal = Object.values(paymentBreakdown).reduce((s, v) => s + v, 0)

  const paymentIcons: Record<string, string> = {
    EFECTIVO: '💵', TARJETA: '💳', YAPE: '📱', PLIN: '📱', TRANSFERENCIA: '🏦'
  }

  return (
    <div className="p-5 animate-fade-up">
      {/* AI Banner */}
      <div className="flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl mb-4"
        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.08))', border: '1px solid rgba(99,102,241,.25)' }}>
        <div className="w-9 h-9 rounded-[9px] flex items-center justify-center text-base flex-shrink-0" style={{ background: 'var(--gradient)' }}>📊</div>
        <div className="flex-1 min-w-0">
          <strong className="text-sm font-bold block" style={{ color: 'var(--text)' }}>Resumen generado por IA</strong>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {filtered.length} transacciones · Ticket promedio S/ {avgTicket.toFixed(2)} · Total S/ {totalSales.toFixed(2)}
          </span>
        </div>
        <button onClick={() => exportSalesToCSV(filtered)}
          className="px-[14px] py-[7px] rounded-[9px] text-xs font-semibold text-white flex-shrink-0 transition-all"
          style={{ background: 'var(--gradient)' }}>
          📄 Exportar reporte
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] mb-4">
        {[
          { color: 'var(--green)', icon: '💰', label: 'Ventas Período', value: `S/ ${totalSales.toFixed(2)}` },
          { color: 'var(--blue)', icon: '🧾', label: 'Transacciones', value: String(filtered.length) },
          { color: 'var(--amber)', icon: '🎯', label: 'Ticket Promedio', value: `S/ ${avgTicket.toFixed(2)}` },
          { color: 'var(--accent)', icon: '📋', label: 'Total Ventas', value: String(sales.length) },
        ].map(m => (
          <div key={m.label} className="rounded-[13px] px-[18px] py-4 relative overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="absolute right-[-10px] top-[-10px] w-[70px] h-[70px] rounded-full" style={{ background: m.color, opacity: 0.06 }} />
            <div className="absolute right-[14px] top-[14px] text-[22px] opacity-35">{m.icon}</div>
            <div className="text-[10px] font-bold uppercase tracking-[.6px]" style={{ color: 'var(--muted)' }}>{m.label}</div>
            <div className="text-[26px] font-extrabold leading-[1.1] my-[3px]" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="rounded-[13px] overflow-hidden mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>🔍 Filtros de Reporte</span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex flex-col gap-[5px]">
            <label className="text-[10px] font-bold uppercase tracking-[.5px]" style={{ color: 'var(--muted)' }}>📅 Fecha Inicio</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="px-[13px] py-3 rounded-[9px] outline-none text-sm"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
          <div className="flex flex-col gap-[5px]">
            <label className="text-[10px] font-bold uppercase tracking-[.5px]" style={{ color: 'var(--muted)' }}>📅 Fecha Fin</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="px-[13px] py-3 rounded-[9px] outline-none text-sm"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
          <div className="flex flex-col gap-[5px]">
            <label className="text-[10px] font-bold uppercase tracking-[.5px]" style={{ color: 'var(--muted)' }}>&nbsp;</label>
            <button onClick={() => { const t = new Date().toISOString().split('T')[0]; setStartDate(t); setEndDate(t) }}
              className="py-3 rounded-[9px] text-xs font-semibold transition-all"
              style={{ background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', color: 'var(--blue)' }}>
              🔄 Hoy
            </button>
          </div>
          <div className="flex flex-col gap-[5px]">
            <label className="text-[10px] font-bold uppercase tracking-[.5px]" style={{ color: 'var(--muted)' }}>&nbsp;</label>
            <button onClick={() => exportSalesToCSV(filtered)}
              className="py-3 rounded-[9px] text-xs font-semibold transition-all"
              style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)', color: 'var(--green)' }}>
              📄 Exportar Excel
            </button>
          </div>
        </div>
      </div>

      {/* Métodos de pago + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px] mb-4">
        <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>💳 Métodos de Pago</span>
          </div>
          <div className="p-4 space-y-2">
            {Object.entries(paymentBreakdown).length === 0 ? (
              <div className="text-xs text-center py-4" style={{ color: 'var(--sub)' }}>Sin datos en el período</div>
            ) : Object.entries(paymentBreakdown).map(([method, amount]) => {
              const pct = paymentTotal > 0 ? Math.round((amount / paymentTotal) * 100) : 0
              return (
                <div key={method} className="flex items-center gap-[10px] py-[9px] px-3 rounded-lg"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="text-xs font-bold w-[110px] flex-shrink-0" style={{ color: 'var(--text)' }}>
                    {paymentIcons[method] || '💰'} {method}
                  </div>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--accent2)' }} />
                  </div>
                  <div className="text-xs w-8 text-right" style={{ color: 'var(--muted)' }}>{pct}%</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>🤖 Insights IA</span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {[
              { title: '📈 Análisis del período', desc: filtered.length > 0 ? `${filtered.length} ventas por S/ ${totalSales.toFixed(2)}. Ticket promedio S/ ${avgTicket.toFixed(2)}.` : 'Sin ventas en el período seleccionado.' },
              { title: '💡 Recomendación', desc: avgTicket < 40 ? 'Considera crear combos de productos para subir el ticket promedio.' : 'Excelente ticket promedio. Mantén la estrategia actual.' },
              { title: '🛍️ Canal online', desc: 'Activa tu tienda virtual para recibir pedidos por WhatsApp y aumentar ventas.' },
            ].map(ins => (
              <div key={ins.title} className="p-3 rounded-[11px]" style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}>
                <div className="text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>{ins.title}</div>
                <div className="text-[11px]" style={{ color: 'var(--muted)' }}>{ins.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla ventas */}
      <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Historial de Ventas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: '600px' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                {['Nº', 'Fecha', 'Cliente', 'Tipo', 'Pago', 'Total', 'Estado'].map(h => (
                  <th key={h} className="px-[14px] py-[9px] text-left font-bold uppercase tracking-[.6px]"
                    style={{ color: 'var(--sub)', fontSize: '10px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(30,45,69,.5)' }}>
                  <td className="px-[14px] py-[10px] font-mono text-[11px]" style={{ color: 'var(--muted)' }}>{s.sale_number}</td>
                  <td className="px-[14px] py-[10px]" style={{ color: 'var(--muted)' }}>
                    {new Date(s.created_at).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-[14px] py-[10px]" style={{ color: 'var(--text)' }}>{s.customer_name || 'Cliente General'}</td>
                  <td className="px-[14px] py-[10px]">
                    <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold"
                      style={{ background: 'rgba(59,130,246,.1)', color: 'var(--blue)' }}>{s.receipt_type || 'BOLETA'}</span>
                  </td>
                  <td className="px-[14px] py-[10px]">
                    <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold"
                      style={{ background: 'rgba(136,150,179,.1)', color: 'var(--muted)' }}>{s.payment_method}</span>
                  </td>
                  <td className="px-[14px] py-[10px] font-bold" style={{ color: 'var(--green)' }}>S/ {s.total.toFixed(2)}</td>
                  <td className="px-[14px] py-[10px]">
                    <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold"
                      style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)' }}>✅ OK</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-[14px] py-8 text-center text-xs" style={{ color: 'var(--sub)' }}>Sin ventas en el período seleccionado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
