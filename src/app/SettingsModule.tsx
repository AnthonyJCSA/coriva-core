'use client'

import { useState, useEffect } from 'react'
import { Organization } from '../types'

interface SettingsModuleProps {
  currentOrg: Organization
  onUpdate: (org: Organization) => void
}

export default function SettingsModule({ currentOrg, onUpdate }: SettingsModuleProps) {
  const [settings, setSettings] = useState({
    name: currentOrg.name,
    business_type: currentOrg.business_type,
    ruc: currentOrg.ruc || '',
    address: currentOrg.address || '',
    phone: currentOrg.phone || '',
    email: currentOrg.email || '',
    currency: currentOrg.settings.currency || 'S/',
    tax_rate: (currentOrg.settings.tax_rate || 0.18) * 100,
    receipt_footer: currentOrg.settings.receipt_footer || 'Gracias por su compra',
    theme_color: currentOrg.settings.theme_color || '#3B82F6'
  })

  const handleSave = () => {
    const updatedOrg: Organization = {
      ...currentOrg,
      name: settings.name,
      business_type: settings.business_type,
      ruc: settings.ruc,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      settings: {
        ...currentOrg.settings,
        currency: settings.currency,
        tax_rate: settings.tax_rate / 100,
        receipt_footer: settings.receipt_footer,
        theme_color: settings.theme_color
      },
      updated_at: new Date().toISOString()
    }

    onUpdate(updatedOrg)
    alert('✅ Configuración guardada')
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">⚙️ Configuración del Negocio</h1>
        <p className="text-gray-600 mt-1">Personaliza tu sistema y preferencias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Business Info */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
              <span className="mr-2">📋</span> Información del Negocio
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Negocio</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({...settings, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Negocio</label>
                <select
                  value={settings.business_type}
                  onChange={(e) => setSettings({...settings, business_type: e.target.value as any})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="retail">🛒 Tienda / Bodega</option>
                  <option value="pharmacy">💊 Farmacia / Botica</option>
                  <option value="hardware">🔧 Ferretería</option>
                  <option value="clothing">👕 Ropa / Textil</option>
                  <option value="barbershop">✂️ Barbería / Peluquería</option>
                  <option value="restaurant">🍔 Restaurante</option>
                  <option value="other">📦 Otro</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">RUC</label>
                  <input
                    type="text"
                    value={settings.ruc}
                    onChange={(e) => setSettings({...settings, ruc: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
              <span className="mr-2">⚙️</span> Configuración del Sistema
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Moneda</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="S/">S/ (Soles)</option>
                    <option value="$">$ (Dólares)</option>
                    <option value="€">€ (Euros)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">IGV (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.tax_rate}
                    onChange={(e) => setSettings({...settings, tax_rate: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pie de Comprobante</label>
                <textarea
                  value={settings.receipt_footer}
                  onChange={(e) => setSettings({...settings, receipt_footer: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                  placeholder="Mensaje que aparece al final del comprobante"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color del Sistema</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.theme_color}
                    onChange={(e) => setSettings({...settings, theme_color: e.target.value})}
                    className="w-16 h-12 border-2 border-gray-300 rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_color}
                    onChange={(e) => setSettings({...settings, theme_color: e.target.value})}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            💾 Guardar Configuración
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Support Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-md p-6">
            <div className="text-center mb-5">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">¿Necesitas Ayuda?</h3>
              <p className="text-sm text-gray-600 mt-1">Estamos aquí para ti</p>
            </div>

            <a
              href="https://wa.me/51913916967?text=Hola,%20necesito%20ayuda%20con%20Coriva%20Core"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-center py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl mb-4"
            >
              📱 Soporte por WhatsApp
            </a>

            <div className="text-xs text-gray-700 space-y-2 bg-white bg-opacity-50 rounded-lg p-3">
              <p className="flex items-center"><span className="mr-2">✅</span> Respuesta en menos de 1 hora</p>
              <p className="flex items-center"><span className="mr-2">✅</span> Soporte técnico incluido</p>
              <p className="flex items-center"><span className="mr-2">✅</span> Lunes a Sábado 8am-8pm</p>
            </div>
          </div>

          {/* Plan Info */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📊</span> Tu Plan
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Plan Actual:</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">DEMO</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Usuarios:</span>
                <span className="font-bold text-gray-900">Ilimitados</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Productos:</span>
                <span className="font-bold text-gray-900">Ilimitados</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Ventas/mes:</span>
                <span className="font-bold text-gray-900">Ilimitadas</span>
              </div>
            </div>

            <button className="w-full mt-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold transition-all shadow-lg hover:shadow-xl">
              🚀 Actualizar Plan
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🔗</span> Enlaces Rápidos
            </h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-800 py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors">
                📖 Guía de Usuario
              </a>
              <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-800 py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors">
                🎥 Video Tutoriales
              </a>
              <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-800 py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors">
                ❓ Preguntas Frecuentes
              </a>
              <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-800 py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors">
                📝 Términos y Condiciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
