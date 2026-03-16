'use client'

interface TopbarProps {
  activeModule: string
  cajaOpen: boolean
  onHamburger: () => void
  onAIClick: () => void
  onCatalogClick: () => void
  lowStockCount: number
}

const screenTitles: Record<string, string> = {
  dashboard: 'Dashboard IA',
  asistente: 'Asistente IA',
  pos: 'Punto de Venta',
  cash: 'Gestión de Caja',
  inventory: 'Inventario + IA',
  store: 'Tienda Virtual',
  catalog: 'Catálogo Digital',
  communications: 'Email & WhatsApp',
  customers: 'CRM Clientes',
  reports: 'Reportes IA',
  users: 'Usuarios',
  settings: 'Configuración',
}

export default function Topbar({ activeModule, cajaOpen, onHamburger, onAIClick, onCatalogClick, lowStockCount }: TopbarProps) {
  const title = screenTitles[activeModule] || activeModule

  return (
    <div
      className="flex items-center justify-between gap-3 px-5 flex-shrink-0"
      style={{
        height: '52px',
        background: 'var(--sidebar)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onHamburger}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          ☰
        </button>
        <div>
          <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>{title}</div>
          <div className="text-[10px]" style={{ color: 'var(--sub)' }}>Coriva → {title}</div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-[6px] flex-shrink-0">
        <button
          onClick={onAIClick}
          className="hidden sm:flex items-center gap-[5px] px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
          style={{
            background: 'rgba(99,102,241,.08)',
            border: '1px solid rgba(99,102,241,.2)',
            color: 'var(--accent)',
          }}
        >
          🤖 Pregúntale a la IA
        </button>

        <div
          className="px-[10px] py-[3px] rounded-full text-[10px] font-semibold whitespace-nowrap"
          style={
            cajaOpen
              ? { background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)', color: 'var(--green)' }
              : { background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: 'var(--red)' }
          }
        >
          {cajaOpen ? '● Caja Abierta' : '● Caja Cerrada'}
        </div>

        {lowStockCount > 0 && (
          <button
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
            title={`${lowStockCount} alertas de stock`}
          >
            🔔
            <span
              className="absolute top-[6px] right-[6px] w-[7px] h-[7px] rounded-full"
              style={{ background: 'var(--red)', border: '1.5px solid var(--sidebar)' }}
            />
          </button>
        )}

        <button
          onClick={onCatalogClick}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          title="Catálogo digital"
        >
          🔗
        </button>
      </div>
    </div>
  )
}
