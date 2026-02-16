'use client'

import { useState, useEffect } from 'react'
import { saleService, bellafarmaProductService } from '@/lib/bellafarma-dynamo'

interface Sale {
  id: string
  sale_number: string
  customer_name?: string
  total: number
  payment_method: string
  receipt_type: string
  status: string
  created_at: string
  items: any[]
}

interface SalesCancellationProps {
  currentUser: any
}

export default function SalesCancellationModule({ currentUser }: SalesCancellationProps) {
  const [sales, setSales] = useState<Sale[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadSales()
  }, [])

  const loadSales = async () => {
    try {
      const allSales = await saleService.getCompleted()
      setSales(allSales as Sale[])
    } catch (error) {
      console.error('Error loading sales:', error)
    }
  }

  const handleCancelSale = async () => {
    if (!selectedSale || !cancellationReason.trim()) {
      alert('Debe ingresar un motivo de anulación')
      return
    }

    try {
      await saleService.cancel(
        selectedSale.id,
        currentUser?.id || 'unknown',
        currentUser?.name || 'Usuario',
        cancellationReason
      )

      for (const item of selectedSale.items) {
        const product = await bellafarmaProductService.getAll()
        const prod = product.find((p: any) => p.id === item.product_id)
        if (prod) {
          const newStock = Number(prod.stock) + Number(item.quantity)
          await bellafarmaProductService.updateStock(item.product_id, newStock)
        }
      }

      alert('Venta anulada exitosamente')
      setShowModal(false)
      setSelectedSale(null)
      setCancellationReason('')
      loadSales()
    } catch (error) {
      console.error('Error cancelling sale:', error)
      alert('Error al anular venta')
    }
  }

  const filteredSales = sales.filter(sale =>
    sale.sale_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anulación de Ventas</h1>
          <p className="text-gray-600">BOTICAS BELLAFARMA</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Buscar por número de venta o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Venta</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comprobante</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{sale.sale_number}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(sale.created_at).toLocaleString('es-PE')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{sale.customer_name || 'Público'}</td>
                <td className="px-4 py-3 text-sm font-bold text-green-600">S/ {sale.total.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sale.receipt_type}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedSale(sale)
                      setShowModal(true)
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Anular
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSales.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron ventas
          </div>
        )}
      </div>

      {/* Modal Anulación */}
      {showModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ Anular Venta</h2>
            
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">N° Venta</p>
                  <p className="font-bold">{selectedSale.sale_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-bold text-green-600">S/ {selectedSale.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-bold">{new Date(selectedSale.created_at).toLocaleString('es-PE')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-bold">{selectedSale.customer_name || 'Público'}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold mb-2">Productos</h3>
              <div className="border rounded max-h-40 overflow-y-auto">
                {selectedSale.items.map((item, idx) => (
                  <div key={idx} className="p-2 border-b last:border-b-0 flex justify-between">
                    <span className="text-sm">{item.product_name}</span>
                    <span className="text-sm font-medium">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de Anulación *
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Ingrese el motivo de la anulación..."
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedSale(null)
                  setCancellationReason('')
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCancelSale}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirmar Anulación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
