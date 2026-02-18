'use client'

import { useState, useEffect } from 'react'
import { saleService, productService, cashService } from '../lib/storage'
import { exportSalesToCSV } from '../lib/export'

interface Sale {
  id: string
  sale_number: string
  total: number
  created_at: string
  customer_name?: string
  payment_method: string
  items?: any[]
  status?: 'COMPLETED' | 'CANCELLED' | 'PENDING'
  annulment_reason?: string
  annulled_by?: string
  annulled_at?: string
}

interface ReportsProps {
  sales: Sale[]
  currentUser: any
}

export default function ReportsModule({ sales: initialSales, currentUser }: ReportsProps) {
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showAnnulModal, setShowAnnulModal] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [annulmentReason, setAnnulmentReason] = useState('')

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setStartDate(today)
    setEndDate(today)
    loadSales()
  }, [])

  const loadSales = async () => {
    setLoading(true)
    try {
      const data = await saleService.getAll()
      setSales(data as Sale[])
    } catch (error) {
      console.error('Error loading sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredSales = () => {
    if (!startDate || !endDate) return sales.filter(s => s.status !== 'CANCELLED')
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.created_at).toISOString().split('T')[0]
      return saleDate >= startDate && saleDate <= endDate && sale.status !== 'CANCELLED'
    })
  }

  const handleAnnulSale = async () => {
    if (!selectedSale || !annulmentReason.trim()) {
      alert('Debe ingresar un motivo de anulación')
      return
    }

    if (!confirm(`¿Está seguro de anular la venta ${selectedSale.sale_number}?`)) {
      return
    }

    setLoading(true)
    try {
      const fullSale = await saleService.getById(selectedSale.id)
      if (!fullSale) {
        alert('❌ No se encontró la venta')
        return
      }

      await saleService.cancel(
        selectedSale.id,
        currentUser?.id || 'unknown',
        currentUser?.full_name || 'Usuario',
        annulmentReason
      )

      if (fullSale.items && Array.isArray(fullSale.items)) {
        for (const item of fullSale.items) {
          const product = await productService.getById(item.product_id)
          if (product) {
            const newStock = Number(product.stock) + Number(item.quantity)
            await productService.updateStock(item.product_id, newStock)
          }
        }
      }

      const currentSession = await cashService.getCurrentSession()
      if (currentSession) {
        await cashService.addCancelledSale(currentSession.id, fullSale.total)
      }
      
      alert('✅ Venta anulada correctamente')
      setShowAnnulModal(false)
      setSelectedSale(null)
      setAnnulmentReason('')
      await loadSales()
    } catch (error) {
      console.error('Error annulling sale:', error)
      alert('❌ Error al anular venta')
    } finally {
      setLoading(false)
    }
  }

  const filteredSales = getFilteredSales()
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const averageSale = filteredSales.length > 0 ? totalSales / filteredSales.length : 0
  const totalTransactions = filteredSales.length

  const paymentMethods = filteredSales.reduce((acc, sale) => {
    acc[sale.payment_method] = (acc[sale.payment_method] || 0) + sale.total
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📈 Reportes y Analytics</h1>
        <p className="text-gray-600 mt-1">Dashboard de ventas y estadísticas</p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-5 text-gray-900">🔍 Filtros de Reporte</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Fecha Inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Fecha Fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">&nbsp;</label>
            <button
              onClick={loadSales}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-all shadow-md"
            >
              {loading ? '🔄 Cargando...' : '🔄 Refrescar'}
            </button>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">&nbsp;</label>
            <button
              onClick={() => exportSalesToCSV(filteredSales)}
              className="w-full bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 font-medium transition-all shadow-md"
            >
              📄 Exportar Excel
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">💰 Ventas Totales</h3>
          <p className="text-3xl font-bold text-green-600">S/ {totalSales.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">🧾 Transacciones</h3>
          <p className="text-3xl font-bold text-blue-600">{totalTransactions}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">📊 Ticket Promedio</h3>
          <p className="text-3xl font-bold text-purple-600">S/ {averageSale.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">📦 Items Vendidos</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {filteredSales.reduce((sum, sale) => {
              if (sale.items && Array.isArray(sale.items)) {
                return sum + sale.items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0)
              }
              return sum
            }, 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">📋 Ventas del Período</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Número</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha/Hora</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pago</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.slice(0, 20).map((sale) => (
                <tr key={sale.id} className={`hover:bg-gray-50 transition-colors ${sale.status === 'CANCELLED' ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.sale_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sale.created_at).toLocaleString('es-PE', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {sale.customer_name || 'Cliente General'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {sale.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    S/ {sale.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {sale.status === 'CANCELLED' ? (
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        ❌ ANULADA
                      </span>
                    ) : (
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ✅ ACTIVA
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {sale.status !== 'CANCELLED' ? (
                      <button
                        onClick={() => {
                          setSelectedSale(sale)
                          setShowAnnulModal(true)
                        }}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        🚫 Anular
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        {sale.annulment_reason}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Anular Venta */}
      {showAnnulModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-red-600 flex items-center">
              <span className="mr-2">🚫</span> Anular Venta
            </h2>
            
            <div className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Comprobante</p>
              <p className="text-lg font-bold text-gray-900">{selectedSale.sale_number}</p>
              <p className="text-sm text-gray-600 mt-3 mb-1">Total</p>
              <p className="text-2xl font-bold text-red-600">S/ {selectedSale.total.toFixed(2)}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📝 Motivo de Anulación *
              </label>
              <textarea
                value={annulmentReason}
                onChange={(e) => setAnnulmentReason(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ej: Error en el registro, cliente solicitó devolución, etc."
                rows={3}
                autoFocus
              />
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800 flex items-start">
                <span className="mr-2 text-lg">⚠️</span>
                <span>Esta acción no se puede deshacer. El stock será devuelto al inventario.</span>
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAnnulModal(false)
                  setSelectedSale(null)
                  setAnnulmentReason('')
                }}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleAnnulSale}
                disabled={!annulmentReason.trim() || loading}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 font-semibold shadow-lg transition-all"
              >
                {loading ? 'Anulando...' : 'Anular Venta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
