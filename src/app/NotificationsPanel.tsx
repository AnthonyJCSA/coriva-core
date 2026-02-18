'use client'

import { useState, useEffect } from 'react'
import { StockPredictionAI } from '@/lib/ai-predictions'
import { WhatsAppAutomation } from '@/lib/whatsapp-automation'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success' | 'ai'
  title: string
  message: string
  created_at: string
  read: boolean
  action?: { label: string; url: string }
}

interface NotificationsProps {
  products: any[]
  sales: any[]
}

export default function NotificationsPanel({ products, sales }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'ia'>('all')

  const ai = new StockPredictionAI()
  const whatsapp = new WhatsAppAutomation('51913916967')

  useEffect(() => {
    checkNotifications()
  }, [products, sales])

  const checkNotifications = () => {
    const newNotifications: Notification[] = []

    // IA Predictions - Critical Alerts
    const criticalAlerts = ai.getCriticalAlerts(products, sales)
    criticalAlerts.forEach(alert => {
      newNotifications.push({
        id: `ia_${alert.product_id}`,
        type: 'ai',
        title: `🤖 IA: ${alert.product_name}`,
        message: `Se agota en ${alert.days_until_stockout} días. ${alert.recommendation}`,
        created_at: new Date().toISOString(),
        read: false,
        action: {
          label: '📦 Contactar Proveedor',
          url: whatsapp.generateStockAlert(alert.product_name, alert.current_stock, '51999888777').url
        }
      })
    })

    // Low stock alerts
    const lowStock = products.filter(p => p.stock <= p.min_stock && p.stock > 0)
    if (lowStock.length > 0) {
      newNotifications.push({
        id: `low_stock_${Date.now()}`,
        type: 'warning',
        title: 'Stock Bajo',
        message: `${lowStock.length} productos con stock bajo`,
        created_at: new Date().toISOString(),
        read: false
      })
    }

    // Out of stock alerts
    const outOfStock = products.filter(p => p.stock === 0)
    if (outOfStock.length > 0) {
      newNotifications.push({
        id: `out_stock_${Date.now()}`,
        type: 'error',
        title: 'Sin Stock',
        message: `${outOfStock.length} productos sin stock`,
        created_at: new Date().toISOString(),
        read: false
      })
    }

    // Daily sales summary
    const today = new Date().toISOString().split('T')[0]
    const todaySales = sales.filter(s => 
      s.created_at.split('T')[0] === today && s.status !== 'CANCELLED'
    )
    if (todaySales.length > 0) {
      const total = todaySales.reduce((sum, s) => sum + s.total, 0)
      newNotifications.push({
        id: `sales_${Date.now()}`,
        type: 'success',
        title: 'Ventas del Día',
        message: `${todaySales.length} ventas - S/ ${total.toFixed(2)}`,
        created_at: new Date().toISOString(),
        read: false
      })
    }

    setNotifications(newNotifications)
  }

  const filteredNotifications = activeTab === 'ia' 
    ? notifications.filter(n => n.type === 'ai')
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length
  const aiCount = notifications.filter(n => n.type === 'ai').length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'ai': return '🤖'
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'ai': return 'bg-purple-50 border-purple-200 text-purple-800'
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      default: return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
        {aiCount > 0 && (
          <span className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            🤖
          </span>
        )}
      </button>

      {showPanel && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowPanel(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-[600px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-lg">Notificaciones</h3>
              <p className="text-xs text-gray-500">{unreadCount} sin leer {aiCount > 0 && `• ${aiCount} alertas IA`}</p>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('ia')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'ia'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🤖 IA ({aiCount})
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-4xl mb-2">📭</p>
                  <p className="text-sm">No hay notificaciones</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notif.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl flex-shrink-0">{getIcon(notif.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900">
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          {notif.action && (
                            <a
                              href={notif.action.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-block mt-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {notif.action.label}
                            </a>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notif.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
