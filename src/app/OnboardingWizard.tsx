'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Organization } from '../types'

const C = {
  ink: '#0C0E12', ink2: '#2D3142', muted: '#6B7280',
  bg: '#FAFAF8', bg2: '#F3F2EF', card: '#FFFFFF', border: '#E5E3DE', border2: '#D4D2CC',
  lime: '#C8F23A', green: '#0D9C6E', greenLight: '#E8F8F3', orange: '#FF5A1F',
  amber: '#E8970A', amberLight: '#FEF6E4',
}

const fi = (label: string, value: string, onChange: (v: string) => void, opts?: { type?: string; placeholder?: string; required?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: C.muted }}>
      {label}{opts?.required && <span style={{ color: C.orange }}> *</span>}
    </label>
    <input
      type={opts?.type || 'text'} value={value} placeholder={opts?.placeholder}
      onChange={e => onChange(e.target.value)}
      style={{ padding: '11px 13px', borderRadius: 10, border: `1.5px solid ${C.border2}`, background: C.bg2, fontSize: 14, color: C.ink, outline: 'none', transition: 'border .15s', width: '100%', boxSizing: 'border-box' as const }}
      onFocus={e => (e.target.style.borderColor = C.ink)}
      onBlur={e => (e.target.style.borderColor = C.border2)}
    />
  </div>
)

interface OnboardingWizardProps {
  onComplete: (org: Organization, products: any[]) => void
  businessType?: string
}

export default function OnboardingWizard({ onComplete, businessType }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [businessData, setBusinessData] = useState({
    name: '', business_type: (businessType || 'retail') as any,
    ruc: '', address: '', phone: '', email: ''
  })
  const [products, setProducts] = useState<any[]>([])
  const [manualProduct, setManualProduct] = useState({ code: '', name: '', price: 0, stock: 0 })
  const [userData, setUserData] = useState({ full_name: '', email: '', username: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const rows = (ev.target?.result as string).split('\n').slice(1)
      const parsed = rows.filter(r => r.trim()).map((row, i) => {
        const [code, name, price, stock] = row.split(',').map(s => s.trim())
        return { id: `prod_${Date.now()}_${i}`, code: code || `PROD${i+1}`, name: name || `Producto ${i+1}`, price: parseFloat(price)||0, stock: parseInt(stock)||0, min_stock: 5, category: 'General', unit: 'unit' }
      })
      setProducts(parsed)
      alert(`✅ ${parsed.length} productos importados`)
    }
    reader.readAsText(file)
  }

  const addManualProduct = () => {
    if (!manualProduct.name || !manualProduct.code) { alert('Complete código y nombre'); return }
    setProducts([...products, { id: `prod_${Date.now()}`, ...manualProduct, min_stock: 5, category: 'General', unit: 'unit' }])
    setManualProduct({ code: '', name: '', price: 0, stock: 0 })
  }

  const next = async () => {
    if (step === 1) {
      if (!businessData.name) { alert('Ingresa el nombre del negocio'); return }
      setStep(2)
    } else if (step === 2) {
      if (products.length === 0) { alert('Agrega al menos 1 producto'); return }
      setStep(3)
    } else {
      if (!userData.username || !userData.password || !userData.full_name) { alert('Completa todos los campos'); return }
      setLoading(true)
      const newOrg: Organization = {
        id: `org_${Date.now()}`,
        slug: `${businessData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        ...businessData,
        settings: { currency: 'S/', tax_rate: 0.18 },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setLoading(false)
      onComplete(newOrg, products)
    }
  }

  const steps = [
    { n: 1, label: 'Datos del Negocio', sub: 'Información básica' },
    { n: 2, label: 'Productos Iniciales', sub: 'Importa o agrega' },
    { n: 3, label: 'Tu Usuario', sub: 'Crea tu cuenta' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.bg }}>

      {/* LEFT sidebar */}
      <div style={{ display: 'none', width: '38%', background: C.ink, padding: '56px 48px', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }} className="wiz-left">
        <div style={{ position: 'absolute', top: -200, right: -200, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,242,58,0.07), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 56 }}>
            <div style={{ width: 38, height: 38, background: C.lime, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces',Georgia,serif", fontSize: 19, fontWeight: 900, color: C.ink, letterSpacing: -1 }}>C</div>
            <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 19, fontWeight: 700, color: '#fff' }}>Coriva</span>
          </Link>

          <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 'clamp(28px,2.5vw,40px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: -1.5, color: '#fff', marginBottom: 12 }}>
            Configura tu negocio<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: C.lime }}>en 3 pasos.</em>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 48 }}>Listo para vender en menos de 5 minutos.</p>

          {/* steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', gap: 16, paddingBottom: i < steps.length - 1 ? 28 : 0, position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', left: 19, top: 40, width: 2, height: 'calc(100% - 12px)', background: step > s.n ? C.lime : 'rgba(255,255,255,0.1)' }} />
                )}
                <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces',Georgia,serif", fontSize: 15, fontWeight: 900, transition: '.3s', background: step > s.n ? C.lime : step === s.n ? 'rgba(200,242,58,0.15)' : 'rgba(255,255,255,0.06)', color: step > s.n ? C.ink : step === s.n ? C.lime : 'rgba(255,255,255,0.3)', border: step === s.n ? `2px solid ${C.lime}` : '2px solid transparent' }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: step >= s.n ? '#fff' : 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          © 2025 Coriva Core · soporte@corivape.com
        </div>
      </div>

      {/* RIGHT — content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px,4vw,64px)', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* mobile header */}
          <div className="wiz-mobile-header" style={{ marginBottom: 32 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 28 }}>
              <div style={{ width: 34, height: 34, background: C.ink, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces',Georgia,serif", fontSize: 17, fontWeight: 900, color: C.lime }}>C</div>
              <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 17, fontWeight: 700, color: C.ink }}>Coriva</span>
            </Link>
            {/* progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Paso {step} de 3</span>
              <span style={{ fontSize: 13, color: C.ink, fontWeight: 700 }}>{Math.round((step/3)*100)}%</span>
            </div>
            <div style={{ height: 4, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: C.lime, borderRadius: 99, width: `${(step/3)*100}%`, transition: 'width .4s ease' }} />
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: C.muted, display: 'block', marginBottom: 8 }}>Paso 1 de 3</span>
                <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 'clamp(26px,3vw,36px)', fontWeight: 900, letterSpacing: -1.5, color: C.ink, marginBottom: 8 }}>Datos de tu Negocio</h2>
                <p style={{ fontSize: 15, color: C.muted }}>Cuéntanos sobre tu empresa para personalizar tu experiencia</p>
                <div style={{ marginTop: 16, background: C.greenLight, border: '1px solid rgba(13,156,110,0.2)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: C.green, fontWeight: 500 }}>
                  💡 Desde hoy: ahorrarás horas, controlarás tu efectivo y dejarás de perder ventas
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {fi('Nombre del Negocio', businessData.name, v => setBusinessData(p => ({...p, name: v})), { placeholder: 'Ej: Bodega San Juan', required: true })}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: C.muted }}>Tipo de Negocio <span style={{ color: C.orange }}>*</span></label>
                  <select value={businessData.business_type} onChange={e => setBusinessData(p => ({...p, business_type: e.target.value as any}))}
                    style={{ padding: '11px 13px', borderRadius: 10, border: `1.5px solid ${C.border2}`, background: C.bg2, fontSize: 14, color: C.ink, outline: 'none' }}>
                    <option value="retail">🛒 Tienda / Bodega</option>
                    <option value="pharmacy">💊 Farmacia / Botica</option>
                    <option value="hardware">🔧 Ferretería</option>
                    <option value="clothing">👕 Ropa / Textil</option>
                    <option value="barbershop">✂️ Barbería / Peluquería</option>
                    <option value="restaurant">🍔 Restaurante / Cafetería</option>
                    <option value="other">📦 Otro</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {fi('RUC', businessData.ruc, v => setBusinessData(p => ({...p, ruc: v})), { placeholder: '20123456789' })}
                  {fi('Teléfono', businessData.phone, v => setBusinessData(p => ({...p, phone: v})), { placeholder: '999 888 777' })}
                </div>
                {fi('Dirección', businessData.address, v => setBusinessData(p => ({...p, address: v})), { placeholder: 'Av. Principal 123, Lima' })}
                {fi('Email del Negocio', businessData.email, v => setBusinessData(p => ({...p, email: v})), { type: 'email', placeholder: 'contacto@minegocio.com' })}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: C.muted, display: 'block', marginBottom: 8 }}>Paso 2 de 3</span>
                <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 'clamp(26px,3vw,36px)', fontWeight: 900, letterSpacing: -1.5, color: C.ink, marginBottom: 8 }}>Productos Iniciales</h2>
                <p style={{ fontSize: 15, color: C.muted }}>Importa desde Excel/CSV o agrega manualmente</p>
                <div style={{ marginTop: 16, background: C.amberLight, border: '1px solid rgba(232,151,10,0.2)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: C.amber, fontWeight: 500 }}>
                  🚀 Agrega tus productos y estarás listo para tu primera venta
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* upload */}
                <label htmlFor="file-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '28px 20px', border: `2px dashed ${C.border2}`, borderRadius: 14, cursor: 'pointer', background: C.bg2, transition: '.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = C.ink}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = C.border2}>
                  <span style={{ fontSize: 28 }}>📂</span>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Importar desde Excel/CSV</div>
                    <div style={{ fontSize: 12, color: C.muted }}>Formato: codigo, nombre, precio, stock</div>
                  </div>
                  <div style={{ padding: '8px 20px', borderRadius: 9, background: C.ink, color: '#fff', fontSize: 13, fontWeight: 700 }}>Seleccionar archivo</div>
                  <input id="file-upload" type="file" accept=".csv,.xlsx" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>o agrega manualmente</span>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                </div>

                {/* manual */}
                <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: C.muted, marginBottom: 12 }}>Agregar Producto</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px', gap: 8, marginBottom: 10 }}>
                    {[['Código','code','text'],['Nombre','name','text'],['Precio','price','number'],['Stock','stock','number']].map(([ph, key, type]) => (
                      <input key={key} type={type} placeholder={ph}
                        value={(manualProduct as any)[key] || ''}
                        onChange={e => setManualProduct(p => ({...p, [key]: type === 'number' ? parseFloat(e.target.value)||0 : e.target.value}))}
                        style={{ padding: '9px 10px', borderRadius: 9, border: `1.5px solid ${C.border2}`, background: C.card, fontSize: 13, color: C.ink, outline: 'none' }} />
                    ))}
                  </div>
                  <button onClick={addManualProduct}
                    style={{ width: '100%', padding: '10px', borderRadius: 9, background: C.green, color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    + Agregar Producto
                  </button>
                </div>

                {products.length > 0 && (
                  <div style={{ background: C.greenLight, border: '1px solid rgba(13,156,110,0.2)', borderRadius: 14, padding: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 10 }}>✅ {products.length} productos agregados</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                      {products.slice(0, 5).map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: C.card, padding: '8px 12px', borderRadius: 8, fontSize: 13 }}>
                          <span style={{ color: C.ink, fontWeight: 600 }}>{p.code} — {p.name}</span>
                          <span style={{ color: C.muted }}>S/ {p.price} · {p.stock} uds</span>
                        </div>
                      ))}
                      {products.length > 5 && <p style={{ fontSize: 12, color: C.muted, textAlign: 'center' }}>... y {products.length - 5} más</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: C.muted, display: 'block', marginBottom: 8 }}>Paso 3 de 3</span>
                <h2 style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 'clamp(26px,3vw,36px)', fontWeight: 900, letterSpacing: -1.5, color: C.ink, marginBottom: 8 }}>Crea tu Usuario</h2>
                <p style={{ fontSize: 15, color: C.muted }}>Serás el administrador principal del sistema</p>
                <div style={{ marginTop: 16, background: C.greenLight, border: '1px solid rgba(13,156,110,0.2)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: C.green, fontWeight: 500 }}>
                  🎉 Último paso — crea tu cuenta y empieza a vender en 60 segundos
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {fi('Nombre Completo', userData.full_name, v => setUserData(p => ({...p, full_name: v})), { placeholder: 'Juan Pérez', required: true })}
                {fi('Usuario', userData.username, v => setUserData(p => ({...p, username: v})), { placeholder: 'juanperez', required: true })}
                {fi('Email', userData.email, v => setUserData(p => ({...p, email: v})), { type: 'email', placeholder: 'juan@negocio.com' })}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: C.muted }}>Contraseña <span style={{ color: C.orange }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPass ? 'text' : 'password'} value={userData.password} placeholder="Mínimo 6 caracteres"
                      onChange={e => setUserData(p => ({...p, password: e.target.value}))}
                      style={{ width: '100%', padding: '11px 44px 11px 13px', borderRadius: 10, border: `1.5px solid ${C.border2}`, background: C.bg2, fontSize: 14, color: C.ink, outline: 'none', boxSizing: 'border-box' as const }}
                      onFocus={e => (e.target.style.borderColor = C.ink)}
                      onBlur={e => (e.target.style.borderColor = C.border2)} />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: C.muted }}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NAV buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)}
                style={{ padding: '12px 24px', borderRadius: 10, border: `1.5px solid ${C.border2}`, background: 'transparent', color: C.ink2, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                ← Atrás
              </button>
            ) : (
              <Link href="/" style={{ padding: '12px 24px', borderRadius: 10, border: `1.5px solid ${C.border2}`, background: 'transparent', color: C.muted, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                ← Volver
              </Link>
            )}

            <button onClick={next} disabled={loading}
              style={{ padding: '12px 32px', borderRadius: 10, background: step === 3 ? C.green : C.ink, color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .6 : 1, transition: 'all .2s' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}>
              {loading ? '⏳ Procesando...' : step === 3 ? '🚀 Finalizar y entrar' : 'Siguiente →'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: C.muted, marginTop: 20 }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" style={{ color: C.ink, fontWeight: 700, textDecoration: 'none' }}>Inicia sesión →</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .wiz-left { display: flex !important; }
          .wiz-mobile-header { display: none !important; }
        }
      `}</style>
    </div>
  )
}
