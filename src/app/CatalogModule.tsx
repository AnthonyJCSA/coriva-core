'use client'

interface CatalogModuleProps {
  products: any[]
  currentOrg: any
}

export default function CatalogModule({ products, currentOrg }: CatalogModuleProps) {
  const currency = currentOrg?.settings?.currency || 'S/'
  const storeSlug = currentOrg?.slug || 'mi-negocio'
  const storeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/tienda/${storeSlug}`
    : `/tienda/${storeSlug}`
  const waPhone = currentOrg?.phone || ''

  const copyLink = () => {
    navigator.clipboard.writeText(storeUrl).catch(() => {})
  }

  const shareWA = () => {
    const msg = encodeURIComponent(`¡Hola! Te comparto el catálogo de ${currentOrg?.name || 'mi tienda'} 🛍️\n${storeUrl}`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  const displayProducts = products.slice(0, 6)

  return (
    <div className="p-5 animate-fade-up">
      {/* Banner */}
      <div
        className="flex items-center gap-[14px] px-[18px] py-[14px] rounded-xl mb-4"
        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.12),rgba(6,182,212,.08))', border: '1px solid rgba(99,102,241,.25)' }}
      >
        <div className="w-9 h-9 rounded-[9px] flex items-center justify-center text-base flex-shrink-0" style={{ background: 'var(--gradient)' }}>📲</div>
        <div className="flex-1 min-w-0">
          <strong className="text-sm font-bold block" style={{ color: 'var(--text)' }}>Catálogo digital listo para compartir</strong>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Tus clientes pueden ver tus productos y hacer pedidos directo por WhatsApp</span>
        </div>
        <button
          onClick={shareWA}
          className="px-[14px] py-[7px] rounded-[9px] text-xs font-semibold flex-shrink-0 transition-all"
          style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)', color: 'var(--green)' }}
        >
          📲 Compartir ahora
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
        {/* Vista previa */}
        <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>🖼️ Vista Previa del Catálogo</span>
          </div>
          <div className="p-3">
            <div className="rounded-[14px] overflow-hidden" style={{ background: 'var(--bg)', border: '2px solid var(--border2)' }}>
              {/* Store header */}
              <div className="p-5 text-center" style={{ background: 'var(--gradient)' }}>
                <div className="text-xl font-extrabold text-white mb-1">🏪 {currentOrg?.name || 'Mi Tienda'}</div>
                <div className="text-xs text-white/80">Delivery disponible · Pedidos por WhatsApp</div>
                {waPhone && (
                  <div className="mt-2 inline-block px-3 py-[6px] rounded-lg text-xs text-white" style={{ background: 'rgba(255,255,255,.15)' }}>
                    📱 {waPhone}
                  </div>
                )}
              </div>
              {/* Products grid */}
              <div className="grid grid-cols-3 gap-[10px] p-[14px]">
                {displayProducts.length > 0 ? displayProducts.map(p => (
                  <div key={p.id} className="rounded-[10px] p-3 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="w-[60px] h-[60px] mx-auto mb-2 rounded-lg flex items-center justify-center text-3xl" style={{ background: 'var(--surface)' }}>
                      {p.icon || '📦'}
                    </div>
                    <div className="text-[11px] font-bold mb-[3px] truncate" style={{ color: 'var(--text)' }}>{p.name}</div>
                    <div className="text-sm font-extrabold" style={{ color: 'var(--accent2)' }}>{currency} {p.price?.toFixed(2)}</div>
                    <button
                      onClick={shareWA}
                      className="mt-2 w-full py-[6px] rounded-[7px] text-[10px] font-bold transition-all"
                      style={{ background: 'rgba(16,185,129,.1)', color: 'var(--green)', border: '1px solid rgba(16,185,129,.2)' }}
                    >
                      Pedir
                    </button>
                  </div>
                )) : (
                  <div className="col-span-3 text-center py-8 text-xs" style={{ color: 'var(--sub)' }}>
                    Agrega productos para verlos aquí
                  </div>
                )}
              </div>
              {/* WA button */}
              <div className="p-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--card)' }}>
                <button
                  onClick={shareWA}
                  className="w-full py-[10px] rounded-[9px] text-xs font-bold text-white transition-all"
                  style={{ background: '#25D366' }}
                >
                  📱 Enviar pedido por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats + Share */}
        <div className="flex flex-col gap-[14px]">
          {/* Stats */}
          <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>📊 Estadísticas del Catálogo</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-[10px] mb-4">
                <div className="rounded-[9px] p-3 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-extrabold" style={{ color: 'var(--blue)' }}>{products.length}</div>
                  <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Productos</div>
                </div>
                <div className="rounded-[9px] p-3 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl font-extrabold" style={{ color: 'var(--green)' }}>0</div>
                  <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Pedidos hoy</div>
                </div>
              </div>
              <div className="text-xs font-bold mb-2 uppercase tracking-[.5px]" style={{ color: 'var(--muted)' }}>Productos más vistos</div>
              {products.slice(0, 3).map((p, i) => (
                <div key={p.id} className="flex items-center gap-[10px] py-[9px] px-3 rounded-lg mb-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="text-xs font-bold w-[100px] flex-shrink-0 truncate" style={{ color: 'var(--text)' }}>{p.name}</div>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${90 - i * 20}%`, background: 'var(--accent2)' }} />
                  </div>
                  <div className="text-[10px] w-8 text-right" style={{ color: 'var(--muted)' }}>—</div>
                </div>
              ))}
            </div>
          </div>

          {/* Share links */}
          <div className="rounded-[13px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>🔗 Enlace de tu Catálogo</span>
            </div>
            <div className="p-4">
              <div
                className="flex items-center justify-between px-[14px] py-[10px] rounded-[9px] mb-3"
                style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}
              >
                <span className="text-xs font-mono truncate" style={{ color: 'var(--accent2)' }}>{storeUrl}</span>
                <button
                  onClick={copyLink}
                  className="ml-2 px-2 py-[4px] rounded-[7px] text-[10px] font-semibold flex-shrink-0 transition-all"
                  style={{ background: 'rgba(6,182,212,.08)', border: '1px solid rgba(6,182,212,.2)', color: 'var(--accent2)' }}
                >
                  Copiar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={shareWA}
                  className="py-[10px] rounded-[9px] text-xs font-semibold transition-all"
                  style={{ background: 'rgba(37,211,102,.1)', color: '#25D366', border: '1px solid rgba(37,211,102,.3)' }}
                >
                  📱 WhatsApp
                </button>
                <button
                  onClick={copyLink}
                  className="py-[10px] rounded-[9px] text-xs font-semibold transition-all"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                >
                  📋 Copiar enlace
                </button>
                <button
                  className="py-[10px] rounded-[9px] text-xs font-semibold transition-all col-span-2"
                  style={{ background: 'var(--gradient)', color: '#fff' }}
                  onClick={() => window.open(storeUrl, '_blank')}
                >
                  🌐 Ver catálogo público
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
