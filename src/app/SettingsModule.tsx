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
        <h1 className="text-2xl font-bold text-gray-900">Configuración del Negocio</h1>
        <p className="text-gray-600">Personaliza tu sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Business Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Información del Negocio</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({...settings, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Negocio</label>
                <select
                  value={settings.business_type}
                  onChange={(e) => setSettings({...settings, business_type: e.target.value as any})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RUC</label>
                  <input
                    type="text"
                    value={settings.ruc}
                    onChange={(e) => setSettings({...settings, ruc: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">⚙️ Configuración del Sistema</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="S/">S/ (Soles)</option>
                    <option value="$">$ (Dólares)</option>
                    <option value="€">€ (Euros)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IGV (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.tax_rate}
                    onChange={(e) => setSettings({...settings, tax_rate: parseFloat(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pie de Comprobante</label>
                <textarea
                  value={settings.receipt_footer}
                  onChange={(e) => setSettings({...settings, receipt_footer: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Mensaje que aparece al final del comprobante"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color del Sistema</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.theme_color}
                    onChange={(e) => setSettings({...settings, theme_color: e.target.value})}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme_color}
                    onChange={(e) => setSettings({...settings, theme_color: e.target.value})}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium"
          >
            💾 Guardar Configuración
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Support Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg shadow p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-3xl">💬</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">¿Necesitas Ayuda?</h3>
              <p className="text-sm text-gray-600">Estamos aquí para ti</p>
            </div>

            <a
              href="https://wa.me/51913916967?text=Hola,%20necesito%20ayuda%20con%20Coriva%20Core"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-medium transition-colors mb-3"
            >
              📱 Soporte por WhatsApp
            </a>

            <div className="text-xs text-gray-600 space-y-1">
              <p>✅ Respuesta en menos de 1 hora</p>
              <p>✅ Soporte técnico incluido</p>
              <p>✅ Lunes a Sábado 8am-8pm</p>
            </div>
          </div>

          {/* Plan Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Tu Plan</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Plan Actual:</span>
                <span className="font-bold text-blue-600">DEMO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Usuarios:</span>
                <span className="font-bold">Ilimitados</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Productos:</span>
                <span className="font-bold">Ilimitados</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ventas/mes:</span>
                <span className="font-bold">Ilimitadas</span>
              </div>
            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 text-sm font-medium">
              🚀 Actualizar Plan
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔗 Enlaces Rápidos</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                📖 Guía de Usuario
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                🎥 Video Tutoriales
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                ❓ Preguntas Frecuentes
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                📝 Términos y Condiciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
