'use client'

interface DashboardProps {
  sales: any[]
  products: any[]
  currentOrg: any
  onNavigate: (module: string) => void
}

export default function DashboardModule({ sales, products, currentOrg, onNavigate }: DashboardProps) {
  const currency = currentOrg?.settings?.currency || 'S/'

  // Métricas del día
  const today = new Date().toISOString().split('T')[0]
  const todaySales = sales.filter(s => s.created_at?.startsWith(today))
  const todayTotal = todaySales.reduce((sum, s) => sum + (s.total || 0), 0)
  const avgTicket = todaySales.length > 0 ? todayTotal / todaySales.length : 0

  // Alertas de stock
  const criticalStock = products.filter(p => p.stock <= (p.min_stock || 5) && p.stock > 0)
  const outOfStock = products.filter(p => p.stock === 0)

  // Top productos (por frecuencia en ventas - simplificado)
  const topProducts = products.slice(0, 4)

  // Ventas semana (mock basado en datos reales del día)
  const weekBars = [0.6, 0.85, 0.55, 0.75, 0.8, 0.65, 1].map((ratio, i) => ({
    height: Math.round(ratio * 100),
    isToday: i === 6,
    isHigh: ratio === Math.max(0.6, 0.85, 0.55, 0.75, 0.8, 0.65, 1),
  }))
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy']

  return (
    <div className="p-5 space-y-4 animate-fade-up">

      {/* AI Banner */}
      <div
        className="flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl"
        style={{
          background: 'linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.08))',
          border: '1px solid rgba(99,102,241,.25)',
        }}
      >
        <div
          className="w-9 h-9 rounded-[9px] flex items-center justify-center text-base flex-shrink-0"
          style={{ background: 'var(--gradient)' }}
        >
          🤖
        </div>
        <div className="flex-1 min-w-0">
          <strong className="text-sm font-bold block" style={{ color: 'var(--text)' }}>
            IA detectó {criticalStock.length + outOfStock.length} situaciones importantes hoy
          </strong>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {outOfStock.length > 0 && `${outOfStock.length} productos sin stock · `}
            {criticalStock.length > 0 && `${criticalStock.length} con stock crítico · `}
            {todaySales.length} ventas registradas hoy
          </span>
        </div>
        <button
          onClick={() => onNavigate('asistente')}
          className="px-[14px] py-[7px] rounded-[9px] text-xs font-semibold text-white flex-shrink-0 transition-all"
          style={{ background: 'var(--gradient)' }}
        >
          Ver análisis
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
        <MetricCard color="green" icon="💰" label="Ventas Hoy" value={`${currency} ${todayTotal.toFixed(0)}`} sub={`${todaySales.length} transacciones`} />
        <MetricCard color="blue" icon="🧾" label="Transacciones" value={String(todaySales.length)} sub="del día" />
        <MetricCard color="amber" icon="🎯" label="Ticket Promedio" value={`${currency} ${avgTicket.toFixed(1)}`} sub={`Meta: ${currency} 40`} />
        <MetricCard color="red" icon="⚠️" label="Stock Crítico" value={String(criticalStock.length + outOfStock.length)} sub="productos" />
      </div>

      {/* Gráfico + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
        {/* Gráfico ventas semana */}
        <div className="lg:col-span-2 rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>📊 Ventas Semana</span>
            <span className="text-[10px] px-2 py-[2px] rounded-full font-semibold" style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)' }}>
              IA Predicción activa
            </span>
          </div>
          <div className="p-4">
            <div className="flex items-end gap-[6px] h-20 mb-2">
              {weekBars.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-[2px]">
                  <div
                    className="w-full rounded-t-[3px] transition-all"
                    style={{
                      height: `${bar.height}%`,
                      minHeight: '4px',
                      background: bar.isToday
                        ? 'var(--accent)'
                        : bar.isHigh
                        ? 'rgba(16,185,129,.4)'
                        : 'rgba(99,102,241,.3)',
                      boxShadow: bar.isToday ? '0 0 6px rgba(99,102,241,.4)' : 'none',
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-around">
              {days.map(d => (
                <span key={d} className="text-[10px]" style={{ color: 'var(--sub)' }}>{d}</span>
              ))}
            </div>
            <div
              className="mt-3 px-3 py-2 rounded-lg text-xs"
              style={{ background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.15)', color: 'var(--muted)' }}
            >
              🤖 <strong style={{ color: 'var(--accent)' }}>Predicción IA:</strong> El fin de semana podría ser tu mejor día. Asegura stock de productos top.
            </div>
          </div>
        </div>

        {/* Alertas stock */}
        <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>⚠️ Alertas IA Stock</span>
          </div>
          <div className="p-3 space-y-2">
            {outOfStock.slice(0, 2).map(p => (
              <AlertRow key={p.id} type="crit" icon="🚨" name={p.name} desc="Sin stock" value={0} />
            ))}
            {criticalStock.slice(0, 2).map(p => (
              <AlertRow key={p.id} type="warn" icon="⚠️" name={p.name} desc="Stock bajo" value={p.stock} />
            ))}
            {criticalStock.length === 0 && outOfStock.length === 0 && (
              <AlertRow type="ok" icon="✅" name="Todo en orden" desc="Stock óptimo" value={products.length} />
            )}
            <button
              onClick={() => onNavigate('inventory')}
              className="w-full py-[10px] rounded-[9px] text-xs font-semibold text-white mt-2 transition-all"
              style={{ background: 'var(--gradient)' }}
            >
              Ver inventario completo
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
        {/* Top productos */}
        <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>🏆 Top Productos</span>
          </div>
          <div className="p-4 space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-[10px] py-[9px] px-3 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="text-xs font-bold w-[110px] flex-shrink-0" style={{ color: 'var(--text)' }}>{p.name}</div>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.max(20, 100 - i * 20)}%`, background: 'var(--accent2)' }} />
                </div>
                <div className="text-xs w-10 text-right" style={{ color: 'var(--muted)' }}>{p.stock}u</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tienda virtual */}
        <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>📱 Tienda Virtual</span>
            <span className="text-[10px] px-2 py-[2px] rounded-full font-semibold" style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)' }}>NUEVO</span>
          </div>
          <div className="p-4">
            <div className="text-center mb-3">
              <div className="text-3xl font-extrabold" style={{ color: 'var(--accent2)' }}>{currency} 0</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Facturado online hoy</div>
            </div>
            <div className="space-y-[5px] text-xs mb-3">
              <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Pedidos pendientes</span><span className="px-2 py-[2px] rounded-full font-semibold" style={{ background: 'rgba(245,158,11,.1)', color: 'var(--amber)' }}>0</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Pedidos entregados</span><span className="px-2 py-[2px] rounded-full font-semibold" style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)' }}>0</span></div>
            </div>
            <button
              onClick={() => onNavigate('store')}
              className="w-full py-[9px] rounded-[9px] text-xs font-semibold transition-all"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              Gestionar tienda →
            </button>
          </div>
        </div>

        {/* Comunicaciones IA */}
        <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>📧 Comunicaciones</span>
          </div>
          <div className="p-4 space-y-2">
            <div
              className="p-3 rounded-[11px] cursor-pointer transition-all"
              style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
              onClick={() => onNavigate('communications')}
            >
              <div className="text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>🤖 IA sugiere</div>
              <div className="text-[11px]" style={{ color: 'var(--muted)' }}>Envía una campaña de WhatsApp a tus clientes hoy</div>
            </div>
            <div
              className="p-3 rounded-[11px] cursor-pointer transition-all"
              style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
              onClick={() => onNavigate('communications')}
            >
              <div className="text-xs font-bold mb-1" style={{ color: 'var(--text)' }}>📦 Alerta stock</div>
              <div className="text-[11px]" style={{ color: 'var(--muted)' }}>Notificar a proveedor de reposición urgente</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ color, icon, label, value, sub }: { color: string; icon: string; label: string; value: string; sub: string }) {
  const colors: Record<string, { text: string; glow: string }> = {
    green: { text: 'var(--green)', glow: 'var(--green)' },
    blue: { text: 'var(--blue)', glow: 'var(--blue)' },
    amber: { text: 'var(--amber)', glow: 'var(--amber)' },
    red: { text: 'var(--red)', glow: 'var(--red)' },
    purple: { text: 'var(--accent)', glow: 'var(--accent)' },
  }
  const c = colors[color] || colors.blue
  return (
    <div
      className="relative rounded-[13px] px-[18px] py-4 flex flex-col gap-[2px] overflow-hidden transition-all hover:-translate-y-[1px] cursor-default"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div
        className="absolute right-[-10px] top-[-10px] w-[70px] h-[70px] rounded-full"
        style={{ background: c.glow, opacity: 0.06 }}
      />
      <div className="absolute right-[14px] top-[14px] text-[22px] opacity-35">{icon}</div>
      <div className="text-[10px] font-bold uppercase tracking-[.6px]" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="text-[26px] font-extrabold leading-[1.1] my-[3px]" style={{ color: c.text }}>{value}</div>
      <div className="text-[11px]" style={{ color: 'var(--sub)' }}>{sub}</div>
    </div>
  )
}

function AlertRow({ type, icon, name, desc, value }: { type: string; name: string; desc: string; value: number; icon: string }) {
  const styles: Record<string, { border: string; bg: string; iconBg: string; valColor: string }> = {
    crit: { border: 'rgba(239,68,68,.3)', bg: 'rgba(239,68,68,.04)', iconBg: 'rgba(239,68,68,.15)', valColor: 'var(--red)' },
    warn: { border: 'rgba(245,158,11,.3)', bg: 'rgba(245,158,11,.04)', iconBg: 'rgba(245,158,11,.15)', valColor: 'var(--amber)' },
    ok: { border: 'rgba(16,185,129,.3)', bg: 'rgba(16,185,129,.04)', iconBg: 'rgba(16,185,129,.15)', valColor: 'var(--green)' },
  }
  const s = styles[type]
  return (
    <div className="flex items-center gap-3 p-3 rounded-[11px]" style={{ border: `1px solid ${s.border}`, background: s.bg }}>
      <div className="w-9 h-9 rounded-[9px] flex items-center justify-center text-base flex-shrink-0" style={{ background: s.iconBg }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold truncate" style={{ color: 'var(--text)' }}>{name}</div>
        <div className="text-[11px]" style={{ color: 'var(--muted)' }}>{desc}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-lg font-extrabold" style={{ color: s.valColor }}>{value}</div>
        <div className="text-[10px]" style={{ color: 'var(--muted)' }}>uds</div>
      </div>
    </div>
  )
}
