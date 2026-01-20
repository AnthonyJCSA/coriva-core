'use client'

import { useState } from 'react'

interface Sale {
  id: string
  sale_number: string
  total: number
  created_at: string
  customer_name?: string
  payment_method: string
  items_count: number
}

interface ReportsProps {
  sales: Sale[]
}

export default function ReportsModule({ sales }: ReportsProps) {
  const [dateRange, setDateRange] = useState('today')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

  const getFilteredSales = () => {
    let filtered = sales
    const now = new Date()
    
    switch (dateRange) {
      case 'today':
        filtered = sales.filter(s => s.created_at.startsWith(today))
        break
      case 'yesterday':
        filtered = sales.filter(s => s.created_at.startsWith(yesterday))
        break
      case 'week':
        filtered = sales.filter(s => s.created_at >= weekAgo)
        break
      case 'custom':
        if (startDate && endDate) {
          filtered = sales.filter(s => s.created_at >= startDate && s.created_at <= endDate + 'T23:59:59')
        }
        break
    }
    
    return filtered
  }

  const filteredSales = getFilteredSales()
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const averageSale = filteredSales.length > 0 ? totalSales / filteredSales.length : 0
  const totalTransactions = filteredSales.length

  const paymentMethods = filteredSales.reduce((acc, sale) => {
    acc[sale.payment_method] = (acc[sale.payment_method] || 0) + sale.total
    return acc
  }, {} as Record<string, number>)

  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourSales = filteredSales.filter(sale => {
      const saleHour = new Date(sale.created_at).getHours()
      return saleHour === hour
    })
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      sales: hourSales.length,
      amount: hourSales.reduce((sum, sale) => sum + sale.total, 0)
    }
  }).filter(data => data.sales > 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes y Analytics</h1>
        <p className="text-gray-600">BOTICAS BELLAFARMA - Dashboard de Ventas</p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Período de Análisis</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={() => setDateRange('today')}
            className={`p-2 rounded text-sm font-medium ${
              dateRange === 'today' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setDateRange('yesterday')}
            className={`p-2 rounded text-sm font-medium ${
              dateRange === 'yesterday' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ayer
          </button>
          <button
            onClick={() => setDateRange('week')}
            className={`p-2 rounded text-sm font-medium ${
              dateRange === 'week' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Última Semana
          </button>
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setDateRange('custom')
              }}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setDateRange('custom')
              }}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Ventas Totales</h3>
          <p className="text-2xl font-bold text-green-600">S/ {totalSales.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {dateRange === 'today' ? 'Hoy' : 
             dateRange === 'yesterday' ? 'Ayer' : 
             dateRange === 'week' ? 'Última semana' : 'Período seleccionado'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Transacciones</h3>
          <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
          <p className="text-xs text-gray-500 mt-1">Número de ventas</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Ticket Promedio</h3>
          <p className="text-2xl font-bold text-purple-600">S/ {averageSale.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Por transacción</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Items Vendidos</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredSales.reduce((sum, sale) => sum + sale.items_count, 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Productos totales</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Métodos de Pago</h3>
          <div className="space-y-3">
            {Object.entries(paymentMethods).map(([method, amount]) => {
              const percentage = totalSales > 0 ? (amount / totalSales) * 100 : 0
              return (
                <div key={method}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{method}</span>
                    <span>S/ {amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Hourly Sales */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Ventas por Hora</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {hourlyData.map((data) => (
              <div key={data.hour} className="flex justify-between items-center text-sm">
                <span className="font-medium">{data.hour}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{data.sales} ventas</span>
                  <span className="font-medium text-green-600">S/ {data.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium">Ventas Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.slice(0, 10).map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.sale_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sale.created_at).toLocaleString('es-PE')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {sale.customer_name || 'Cliente General'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sale.items_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sale.payment_method}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    S/ {sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Exportar Reportes</h3>
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              const csvContent = [
                ['Número', 'Fecha', 'Cliente', 'Items', 'Pago', 'Total'],
                ...filteredSales.map(sale => [
                  sale.sale_number,
                  new Date(sale.created_at).toLocaleString('es-PE'),
                  sale.customer_name || 'Cliente General',
                  sale.items_count,
                  sale.payment_method,
                  sale.total.toFixed(2)
                ])
              ].map(row => row.join(',')).join('\n')
              
              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `ventas_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`
              a.click()
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📊 Exportar CSV
          </button>
          
          <button 
            onClick={() => {
              const printContent = `
                <h1>BOTICAS BELLAFARMA - Reporte de Ventas</h1>
                <p>Período: ${dateRange === 'today' ? 'Hoy' : dateRange === 'yesterday' ? 'Ayer' : dateRange}</p>
                <p>Total Ventas: S/ ${totalSales.toFixed(2)}</p>
                <p>Transacciones: ${totalTransactions}</p>
                <p>Ticket Promedio: S/ ${averageSale.toFixed(2)}</p>
                <hr>
                <table border="1" style="width:100%; border-collapse: collapse;">
                  <tr><th>Número</th><th>Fecha</th><th>Cliente</th><th>Total</th></tr>
                  ${filteredSales.map(sale => 
                    `<tr>
                      <td>${sale.sale_number}</td>
                      <td>${new Date(sale.created_at).toLocaleString('es-PE')}</td>
                      <td>${sale.customer_name || 'Cliente General'}</td>
                      <td>S/ ${sale.total.toFixed(2)}</td>
                    </tr>`
                  ).join('')}
                </table>
              `
              
              const printWindow = window.open('', '_blank')
              if (printWindow) {
                printWindow.document.write(`
                  <html>
                    <head><title>Reporte BOTICAS BELLAFARMA</title></head>
                    <body style="font-family: Arial, sans-serif; margin: 20px;">
                      ${printContent}
                    </body>
                  </html>
                `)
                printWindow.document.close()
                printWindow.print()
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🖨️ Imprimir Reporte
          </button>
        </div>
      </div>
    </div>
  )
}