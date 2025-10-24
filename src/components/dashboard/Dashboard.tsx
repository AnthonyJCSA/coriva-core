'use client'

import { useState } from 'react'
import { 
  ShoppingCartIcon, 
  CubeIcon, 
  UsersIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Sidebar from './Sidebar'
import POSModule from '../pos/POSModule'
import { useAuthStore } from '@/lib/store/auth'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeModule, setActiveModule] = useState('dashboard')
  const { user } = useAuthStore()

  const stats = [
    { name: 'Ventas Hoy', value: '₡125,430', icon: ShoppingCartIcon, color: 'text-success-600' },
    { name: 'Productos', value: '1,247', icon: CubeIcon, color: 'text-primary-600' },
    { name: 'Clientes', value: '89', icon: UsersIcon, color: 'text-purple-600' },
    { name: 'Por Vencer', value: '12', icon: ChartBarIcon, color: 'text-warning-600' },
  ]

  const renderContent = () => {
    switch (activeModule) {
      case 'pos':
        return <POSModule />
      case 'products':
        return <div className="p-6">Módulo de Productos (En desarrollo)</div>
      case 'customers':
        return <div className="p-6">Módulo de Clientes (En desarrollo)</div>
      case 'reports':
        return <div className="p-6">Módulo de Reportes (En desarrollo)</div>
      default:
        return (
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bienvenido, {user?.full_name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Panel de control - FarmaZi
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div key={stat.name} className="card p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.name}
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveModule('pos')}
                className="card p-6 hover:shadow-md transition-shadow text-left"
              >
                <ShoppingCartIcon className="h-8 w-8 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Punto de Venta
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Realizar ventas rápidas y gestionar el mostrador
                </p>
              </button>

              <button
                onClick={() => setActiveModule('products')}
                className="card p-6 hover:shadow-md transition-shadow text-left"
              >
                <CubeIcon className="h-8 w-8 text-success-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Inventario
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Gestionar productos, stock y lotes
                </p>
              </button>

              <button
                onClick={() => setActiveModule('customers')}
                className="card p-6 hover:shadow-md transition-shadow text-left"
              >
                <UsersIcon className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Clientes
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Administrar clientes y programas de fidelización
                </p>
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}