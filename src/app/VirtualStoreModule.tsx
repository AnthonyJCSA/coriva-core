'use client'

import { useState } from 'react'

interface VirtualStoreProps {
  products: any[]
  currentOrg: any
  onShareCatalog: () => void
}

const mockOrders = [
  { id: '#W001', customer: 'Juan García', items: 'Agua x3, Leche x2', total: 18.90, channel: 'WhatsApp', status: 'pending' },
  { id: '#W002', customer: 'María Torres', items: 'Galletas x5, Gaseosa x2', total: 13.50, channel: 'WhatsApp', status: 'delivered' },
  { id: '#W003', customer: 'Carlos Quispe', items: 'Aceite x1, Detergente x1', total: 18.40, channel: 'Web', status: 'pending' },
]

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: 'Pendiente', bg: 'rgba(245,158,11,.1)', color: 'var(--amber)' },
  delivered: { label: 'Entregado', bg: 'rgba(16,185,129,.1)', color: 'var(--green)' },
  transit: { label: 'En camino', bg: 'rgba(99,102,241,.1)', color: 'var(--accent)' },
}

export default function VirtualStoreModule({ products, currentOrg, onShareCatalog }: VirtualStoreProps) {
  const [storeConfig, setStoreConfig] = useState({
    name: currentOrg?.name || 'Mi Tienda',
    whatsapp: currentOrg?.phone || '',
    welcome: '¡Hola! 👋 Bienvenido. Escríbenos tu pedido y te lo entregamos.',
    delivery: 'Solo recojo en tienda',
    visible: true,
    waOrders: true,
  })
  const [orders, setOrders] = useState(mockOrders)
  const [saving, setSaving] = useState(false)
  const currency = currentOrg?.settings?.currency || 'S/'

  const confirmOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'delivered' } : o))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
  }

  const pendingOrders = orders.filter(o => o.status === 'pending')
  const totalOnline = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0)

  return (
    <div className="p-5 animate-fade-up">
      {/* Banner */}
      <div
        className="flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl mb-4"
        style={{ background: 'linear-gradient(135deg,rgba(6,182,212,.12),rgba(99,102,241,.08))', border: '1px solid rgba(6,182,212,.25)' }}
      >
        <div className="w-9 h-9 rounded-[9px] flex items-center justify-center text-base flex-shrink-0" style={{ background: 'var(--gradient)' }}>🛍️</div>
        <div className="flex-1 min-w-0">
          <strong className="text-sm font-bold block" style={{ color: 'var(--text)' }}>Tu tienda virtual está activa y recibiendo pedidos</strong>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{orders.length} pedidos · {currency} {totalOnline.toFixed(2)} en ventas online · {pendingOrders.length} pendientes</span>
        </div>
        <button
          onClick={onShareCatalog}
          className="px-[14px] py-[7px] rounded-[9px] text-xs font-semibold flex-shrink-0 transition-all"
          style={{ background: 'rgba(6,182,212,.1)', border: '1px solid rgba(6,182,212,.2)', color: 'var(--accent2)' }}
        >
          📲 Compartir enlace
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-[10px] mb-4">
        <MetCard color="cyan" icon="📦" label="Pedidos Hoy" value={String(orders.length)} />
        <MetCard color="green" icon="💰" label="Ventas Online" value={`${currency} ${totalOnline.toFixed(2)}`} />
        <MetCard color="amber" icon="⏳" label="Pendientes" value={String(pendingOrders.length)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
        {/* Pedidos */}
        <div className="lg:col-span-2 rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>📋 Pedidos Recientes</span>
            <button
              className="px-3 py-[7px] rounded-[9px] text-xs font-semibold transition-all"
              style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)', color: 'var(--green)' }}
            >
              Notificar todos
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ minWidth: '500px' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  {['ID', 'Cliente', 'Productos', 'Total', 'Canal', 'Estado', 'Acción'].map(h => (
                    <th key={h} className="px-[14px] py-[9px] text-left font-bold uppercase tracking-[.6px]" style={{ color: 'var(--sub)', fontSize: '10px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const st = statusConfig[order.status] || statusConfig.pending
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(30,45,69,.5)' }}>
                      <td className="px-[14px] py-[10px] font-mono text-[11px]" style={{ color: 'var(--muted)' }}>{order.id}</td>
                      <td className="px-[14px] py-[10px] font-bold" style={{ color: 'var(--text)' }}>{order.customer}</td>
                      <td className="px-[14px] py-[10px]" style={{ color: 'var(--muted)' }}>{order.items}</td>
                      <td className="px-[14px] py-[10px] font-bold" style={{ color: 'var(--green)' }}>{currency} {order.total.toFixed(2)}</td>
                      <td className="px-[14px] py-[10px]">
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold" style={
                          order.channel === 'WhatsApp'
                            ? { background: 'rgba(37,211,102,.1)', color: '#25D366' }
                            : { background: 'rgba(59,130,246,.1)', color: 'var(--blue)' }
                        }>{order.channel}</span>
                      </td>
                      <td className="px-[14px] py-[10px]">
                        <span className="px-2 py-[2px] rounded-full text-[10px] font-semibold" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                      <td className="px-[14px] py-[10px]">
                        {order.status === 'pending' ? (
                          <button
                            onClick={() => confirmOrder(order.id)}
                            className="px-2 py-[3px] rounded-[7px] text-[10px] font-semibold transition-all"
                            style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)', color: 'var(--green)' }}
                          >
                            Confirmar
                          </button>
                        ) : (
                          <span className="text-[10px]" style={{ color: 'var(--sub)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Config tienda */}
        <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>⚙️ Config. Tienda</span>
          </div>
          <div className="p-4 flex flex-col gap-[10px]">
            <Field label="Nombre de la Tienda">
              <input className="fi-dark" value={storeConfig.name} onChange={e => setStoreConfig(p => ({ ...p, name: e.target.value }))} />
            </Field>
            <Field label="WhatsApp de Pedidos">
              <input className="fi-dark" value={storeConfig.whatsapp} onChange={e => setStoreConfig(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+51 999 999 999" />
            </Field>
            <Field label="Mensaje de Bienvenida">
              <textarea className="fi-dark" rows={3} value={storeConfig.welcome} onChange={e => setStoreConfig(p => ({ ...p, welcome: e.target.value }))} />
            </Field>
            <Field label="Delivery">
              <select className="fi-dark" value={storeConfig.delivery} onChange={e => setStoreConfig(p => ({ ...p, delivery: e.target.value }))}>
                <option>Solo recojo en tienda</option>
                <option>Delivery (radio 2km)</option>
                <option>Delivery (radio 5km)</option>
              </select>
            </Field>
            <Toggle label="Tienda visible al público" value={storeConfig.visible} onChange={v => setStoreConfig(p => ({ ...p, visible: v }))} />
            <Toggle label="Pedidos por WhatsApp" value={storeConfig.waOrders} onChange={v => setStoreConfig(p => ({ ...p, waOrders: v }))} />
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 rounded-[9px] text-xs font-bold text-white transition-all disabled:opacity-60"
              style={{ background: 'var(--gradient)' }}
            >
              {saving ? '⏳ Guardando...' : '💾 Guardar'}
            </button>
            <button
              onClick={onShareCatalog}
              className="w-full py-3 rounded-[9px] text-xs font-semibold transition-all"
              style={{ background: 'rgba(6,182,212,.08)', border: '1px solid rgba(6,182,212,.2)', color: 'var(--accent2)' }}
            >
              📲 Compartir catálogo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetCard({ color, icon, label, value }: { color: string; icon: string; label: string; value: string }) {
  const c: Record<string, string> = { cyan: 'var(--accent2)', green: 'var(--green)', amber: 'var(--amber)' }
  return (
    <div className="rounded-[13px] px-[18px] py-4 relative overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="absolute right-[-10px] top-[-10px] w-[70px] h-[70px] rounded-full" style={{ background: c[color], opacity: 0.06 }} />
      <div className="absolute right-[14px] top-[14px] text-[22px] opacity-35">{icon}</div>
      <div className="text-[10px] font-bold uppercase tracking-[.6px]" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="text-[26px] font-extrabold leading-[1.1] my-[3px]" style={{ color: c[color] }}>{value}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[10px] font-bold uppercase tracking-[.5px]" style={{ color: 'var(--muted)' }}>{label}</label>
      {children}
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        className="relative flex-shrink-0 transition-all"
        style={{ width: '36px', height: '20px', borderRadius: '99px', background: value ? 'var(--green)' : 'var(--border2)' }}
      >
        <div
          className="absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: value ? 'calc(100% - 18px)' : '2px' }}
        />
      </button>
    </div>
  )
}
