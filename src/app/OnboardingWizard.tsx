'use client'

import { useState } from 'react'
import { Organization } from '../types'
import { supabase } from '../lib/supabase'

interface OnboardingWizardProps {
  onComplete: (org: Organization, products: any[]) => void
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Step 1: Business Info
  const [businessData, setBusinessData] = useState({
    name: '',
    business_type: 'retail' as any,
    ruc: '',
    address: '',
    phone: '',
    email: ''
  })

  // Step 2: Products
  const [products, setProducts] = useState<any[]>([])
  const [manualProduct, setManualProduct] = useState({
    code: '',
    name: '',
    price: 0,
    stock: 0
  })

  // Step 3: First User
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: ''
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const rows = text.split('\n').slice(1) // Skip header
      
      const parsedProducts = rows
        .filter(row => row.trim())
        .map((row, index) => {
          const [code, name, price, stock] = row.split(',').map(s => s.trim())
          return {
            id: `prod_${Date.now()}_${index}`,
            code: code || `PROD${index + 1}`,
            name: name || `Producto ${index + 1}`,
            price: parseFloat(price) || 0,
            stock: parseInt(stock) || 0,
            min_stock: 5,
            category: 'General',
            unit: 'unit'
          }
        })
      
      setProducts(parsedProducts)
      alert(`✅ ${parsedProducts.length} productos importados`)
    }
    reader.readAsText(file)
  }

  const addManualProduct = () => {
    if (!manualProduct.name || !manualProduct.code) {
      alert('Complete código y nombre')
      return
    }

    setProducts([...products, {
      id: `prod_${Date.now()}`,
      ...manualProduct,
      min_stock: 5,
      category: 'General',
      unit: 'unit'
    }])

    setManualProduct({ code: '', name: '', price: 0, stock: 0 })
  }

  const handleComplete = async () => {
    if (step === 1) {
      if (!businessData.name || !businessData.business_type) {
        alert('Complete los campos obligatorios')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (products.length === 0) {
        alert('Agregue al menos 1 producto')
        return
      }
      setStep(3)
    } else if (step === 3) {
      if (!userData.username || !userData.password || !userData.full_name) {
        alert('Complete todos los campos')
        return
      }

      setLoading(true)

      const newOrg: Organization = {
        id: `org_${Date.now()}`,
        slug: businessData.name.toLowerCase().replace(/\s+/g, '-'),
        ...businessData,
        settings: { currency: 'S/', tax_rate: 0.18 },
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Save to Supabase
      if (supabase) {
        try {
          await supabase
            .from('organizations')
            .insert({
              id: newOrg.id,
              name: newOrg.name,
              slug: newOrg.slug,
              business_type: newOrg.business_type,
              ruc: newOrg.ruc,
              address: newOrg.address,
              phone: newOrg.phone,
              email: newOrg.email,
              settings: newOrg.settings,
              is_active: newOrg.is_active
            })
            .select()
        } catch (err) {
          // Silent fail - continue with local storage
        }
      }

      setLoading(false)
      onComplete(newOrg, products)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Paso {step} de 3</span>
            <span className="text-sm font-medium text-blue-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🏢</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Datos de tu Negocio</h2>
              <p className="text-gray-600">Cuéntanos sobre tu empresa</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio *</label>
                <input
                  type="text"
                  value={businessData.name}
                  onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Bodega San Juan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Negocio *</label>
                <select
                  value={businessData.business_type}
                  onChange={(e) => setBusinessData({...businessData, business_type: e.target.value as any})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="retail">🛒 Tienda / Bodega</option>
                  <option value="pharmacy">💊 Farmacia / Botica</option>
                  <option value="hardware">🔧 Ferretería</option>
                  <option value="clothing">👕 Ropa / Textil</option>
                  <option value="barbershop">✂️ Barbería / Peluquería</option>
                  <option value="restaurant">🍔 Restaurante / Cafetería</option>
                  <option value="other">📦 Otro</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
                  <input
                    type="text"
                    value={businessData.ruc}
                    onChange={(e) => setBusinessData({...businessData, ruc: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="20123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={businessData.phone}
                    onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="999 888 777"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={businessData.address}
                  onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Av. Principal 123, Lima"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Products */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">📦</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Productos Iniciales</h2>
              <p className="text-gray-600">Importa o agrega tus productos</p>
            </div>

            <div className="space-y-4">
              {/* Excel Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">📊 Importar desde Excel/CSV</p>
                <p className="text-xs text-gray-500 mb-3">Formato: codigo,nombre,precio,stock</p>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Seleccionar Archivo
                </label>
              </div>

              {/* Manual Add */}
              <div className="border border-gray-300 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">➕ Agregar Manualmente</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Código"
                    value={manualProduct.code}
                    onChange={(e) => setManualProduct({...manualProduct, code: e.target.value})}
                    className="p-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={manualProduct.name}
                    onChange={(e) => setManualProduct({...manualProduct, name: e.target.value})}
                    className="p-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={manualProduct.price || ''}
                    onChange={(e) => setManualProduct({...manualProduct, price: parseFloat(e.target.value) || 0})}
                    className="p-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={manualProduct.stock || ''}
                    onChange={(e) => setManualProduct({...manualProduct, stock: parseInt(e.target.value) || 0})}
                    className="p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <button
                  onClick={addManualProduct}
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
                >
                  Agregar Producto
                </button>
              </div>

              {/* Products List */}
              {products.length > 0 && (
                <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    ✅ {products.length} productos agregados
                  </p>
                  <div className="space-y-1">
                    {products.slice(0, 5).map((p, i) => (
                      <div key={i} className="text-xs text-gray-600 flex justify-between">
                        <span>{p.code} - {p.name}</span>
                        <span>S/ {p.price} | Stock: {p.stock}</span>
                      </div>
                    ))}
                    {products.length > 5 && (
                      <p className="text-xs text-gray-500 italic">... y {products.length - 5} más</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: First User */}
        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Crea tu Usuario</h2>
              <p className="text-gray-600">Serás el administrador principal</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  value={userData.full_name}
                  onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario *</label>
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({...userData, username: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="juanperez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="juan@negocio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({...userData, password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  🎉 ¡Casi listo! Al finalizar tendrás acceso completo al sistema.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ← Atrás
            </button>
          )}
          
          <button
            onClick={handleComplete}
            disabled={loading}
            className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium ${
              step === 1 ? 'ml-auto' : ''
            }`}
          >
            {step === 3 ? '🚀 Finalizar' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}
