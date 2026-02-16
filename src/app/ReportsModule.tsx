'use client'

import { useState, useEffect } from 'react'
import { saleService, bellafarmaProductService, cashService } from '../lib/bellafarma-dynamo'

interface Sale {
  id: string
  sale_number: string
  total: number
  created_at: string
  customer_name?: string
  payment_method: string
  items_count: number
  items?: any[]
  status?: 'ACTIVA' | 'ANULADA' | 'COMPLETED' | 'CANCELLED'
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
    const now = new Date()
    const peruTime = new Date(now.getTime() - (5 * 60 * 60 * 1000))
    const today = peruTime.toISOString().split('T')[0]
    
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
    if (!startDate || !endDate) return sales.filter(s => s.status !== 'CANCELLED' && s.status !== 'ANULADA')
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.created_at).toISOString().split('T')[0]
      return saleDate >= startDate && saleDate <= endDate && sale.status !== 'CANCELLED' && sale.status !== 'ANULADA'
    })
  }

  const handleAnnulSale = async () => {
    if (!selectedSale || !annulmentReason.trim()) {
      alert('Debe ingresar un motivo de anulación')
      return
    }

    if (!confirm(`¿Está seguro de anular la venta ${selectedSale.sale_number}?\nEsta acción no se puede deshacer.`)) {
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
        currentUser?.name || 'Usuario',
        annulmentReason
      )

      if (fullSale.items && Array.isArray(fullSale.items)) {
        for (const item of fullSale.items) {
          const products = await bellafarmaProductService.getAll()
          const prod = products.find((p: any) => p.id === item.product_id)
          if (prod) {
            const newStock = Number(prod.stock) + Number(item.quantity)
            await bellafarmaProductService.updateStock(item.product_id, newStock)
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
      alert('❌ Error al anular venta: ' + error)
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
        <h1 className="text-2xl font-bold text-gray-900">Reportes y Analytics</h1>
        <p className="text-gray-600">BOTICAS BELLAFARMA - Dashboard de Ventas</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Filtros de Reporte</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <button
              onClick={loadSales}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? '🔄 Cargando...' : 'Refrescar Datos'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Ventas Totales</h3>
          <p className="text-2xl font-bold text-green-600">S/ {totalSales.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Transacciones</h3>
          <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Ticket Promedio</h3>
          <p className="text-2xl font-bold text-purple-600">S/ {averageSale.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Items Vendidos</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredSales.reduce((sum, sale) => {
              if (sale.items && Array.isArray(sale.items)) {
                return sum + sale.items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0)
              }
              return sum + (sale.items_count || 0)
            }, 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium">Ventas del Período</h3>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.slice(0, 20).map((sale) => (
                <tr key={sale.id} className={`hover:bg-gray-50 ${sale.status === 'ANULADA' ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{sale.sale_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sale.created_at.replace('T', ' ').replace('Z', '').substring(0, 19)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {sale.customer_name || 'Cliente General'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sale.items && Array.isArray(sale.items) 
                      ? sale.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
                      : sale.items_count || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sale.payment_method}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    S/ {sale.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {sale.status === 'ANULADA' ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        ❌ ANULADA
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ✅ ACTIVA
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {sale.status !== 'ANULADA' ? (
                      <button
                        onClick={() => {
                          setSelectedSale(sale)
                          setShowAnnulModal(true)
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">🚫 Anular Venta</h2>
            
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Comprobante</p>
              <p className="text-lg font-bold text-gray-900">{selectedSale.sale_number}</p>
              <p className="text-sm text-gray-600 mt-2">Total</p>
              <p className="text-xl font-bold text-red-600">S/ {selectedSale.total.toFixed(2)}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de Anulación *
              </label>
              <textarea
                value={annulmentReason}
                onChange={(e) => setAnnulmentReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                placeholder="Ej: Error en el registro, cliente solicitó devolución, etc."
                rows={3}
                autoFocus
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Esta acción no se puede deshacer. El stock de los productos será devuelto al inventario.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowAnnulModal(false)
                  setSelectedSale(null)
                  setAnnulmentReason('')
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAnnulSale}
                disabled={!annulmentReason.trim() || loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
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