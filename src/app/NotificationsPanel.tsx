'use client'

import { useState, useEffect } from 'react'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  created_at: string
  read: boolean
}

interface NotificationsProps {
  products: any[]
  sales: any[]
}

export default function NotificationsPanel({ products, sales }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    checkNotifications()
  }, [products, sales])

  const checkNotifications = () => {
    const newNotifications: Notification[] = []

    // Low stock alerts
    const lowStock = products.filter(p => p.stock <= p.min_stock)
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

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  const getColor = (type: string) => {
    switch (type) {
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
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowPanel(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Notificaciones</h3>
              <p className="text-xs text-gray-500">{unreadCount} sin leer</p>
            </div>
            
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      !notif.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{getIcon(notif.type)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notif.created_at).toLocaleTimeString('es-PE')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
