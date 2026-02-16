'use client'

import { useState, useEffect } from 'react'
import { cashService } from '@/lib/bellafarma-dynamo'

interface CashSession {
  id: string
  user_id: string
  user_name: string
  opening_amount: number
  opening_date: string
  closing_amount?: number
  closing_date?: string
  status: 'ABIERTA' | 'CERRADA'
  total_sales: number
  total_cancelled: number
  net_sales: number
  difference: number
}

interface CashRegisterProps {
  currentUser: any
}

export default function CashRegisterModule({ currentUser }: CashRegisterProps) {
  const [currentSession, setCurrentSession] = useState<CashSession | null>(null)
  const [openingAmount, setOpeningAmount] = useState('')
  const [closingAmount, setClosingAmount] = useState('')
  const [showOpenModal, setShowOpenModal] = useState(false)
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCurrentSession()
  }, [])

  const loadCurrentSession = async () => {
    try {
      setLoading(true)
      const session = await cashService.getCurrentSession()
      setCurrentSession(session as CashSession | null)
    } catch (error) {
      console.error('Error loading session:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCash = async () => {
    if (!openingAmount || Number(openingAmount) < 0) {
      alert('Ingrese un monto válido')
      return
    }

    const peruTime = new Date()
    peruTime.setHours(peruTime.getHours() - 5)

    const newSession: CashSession = {
      id: `cash_${Date.now()}`,
      user_id: currentUser?.id || 'unknown',
      user_name: currentUser?.name || 'Usuario',
      opening_amount: Number(openingAmount),
      opening_date: peruTime.toISOString(),
      status: 'ABIERTA',
      total_sales: 0,
      total_cancelled: 0,
      net_sales: 0,
      difference: 0
    }

    try {
      setLoading(true)
      await cashService.create(newSession)
      setCurrentSession(newSession)
      setOpeningAmount('')
      setShowOpenModal(false)
      alert('✅ Caja aperturada exitosamente')
    } catch (error) {
      console.error('Error opening cash:', error)
      alert('❌ Error al aperturar caja: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseCash = async () => {
    if (!closingAmount || Number(closingAmount) < 0) {
      alert('Ingrese un monto válido')
      return
    }

    if (!currentSession) return

    const netSales = (currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)
    const expectedAmount = currentSession.opening_amount + netSales
    const difference = Number(closingAmount) - expectedAmount

    try {
      setLoading(true)
      const peruTime = new Date()
      peruTime.setHours(peruTime.getHours() - 5)

      await cashService.updateSession(currentSession.id, {
        closing_amount: Number(closingAmount),
        closing_date: peruTime.toISOString(),
        status: 'CERRADA',
        difference
      })

      setCurrentSession(null)
      setClosingAmount('')
      setShowCloseModal(false)
      alert('✅ Caja cerrada exitosamente')
    } catch (error) {
      console.error('Error closing cash:', error)
      alert('❌ Error al cerrar caja: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Caja</h1>
          <p className="text-gray-600">BOTICAS BELLAFARMA</p>
        </div>
      </div>

      {!currentSession ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Caja Cerrada</h2>
            <p className="text-gray-600">Debe aperturar la caja para comenzar a vender</p>
          </div>
          <button
            onClick={() => setShowOpenModal(true)}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 text-lg font-medium"
          >
            🔓 Aperturar Caja
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">✅ Caja Abierta</h2>
              <div className="flex space-x-2">
                <button
                  onClick={loadCurrentSession}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? '🔄 Cargando...' : '🔄 Actualizar'}
                </button>
                <button
                  onClick={() => setShowCloseModal(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  🔒 Cerrar Caja
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Usuario</p>
                <p className="text-lg font-bold text-gray-900">{currentSession.user_name}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Monto Inicial</p>
                <p className="text-lg font-bold text-green-600">S/ {currentSession.opening_amount.toFixed(2)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Apertura</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(new Date(currentSession.opening_date).getTime() + (5 * 60 * 60 * 1000)).toLocaleString('es-PE', { timeZone: 'America/Lima' })}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-500">Ventas Totales</h3>
              <p className="text-3xl font-bold text-blue-600">S/ {(currentSession.total_sales || 0).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
              <h3 className="text-sm font-medium text-gray-500">Ventas Anuladas</h3>
              <p className="text-3xl font-bold text-red-600">S/ {(currentSession.total_cancelled || 0).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500">Ventas Netas</h3>
              <p className="text-3xl font-bold text-green-600">S/ {((currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-500">Total Esperado</h3>
              <p className="text-3xl font-bold text-purple-600">
                S/ {(currentSession.opening_amount + (currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Apertura */}
      {showOpenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Aperturar Caja</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto Inicial</label>
              <input
                type="number"
                step="0.01"
                value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowOpenModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleOpenCash}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Aperturar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cierre */}
      {showCloseModal && currentSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Cerrar Caja</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Ventas Totales:</p>
                  <p className="font-bold">S/ {(currentSession.total_sales || 0).toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Ventas Anuladas:</p>
                  <p className="font-bold text-red-600">- S/ {(currentSession.total_cancelled || 0).toFixed(2)}</p>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <p className="text-sm text-gray-600">Ventas Netas:</p>
                  <p className="font-bold text-green-600">S/ {((currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)).toFixed(2)}</p>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <p className="text-sm font-medium">Monto Esperado:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    S/ {(currentSession.opening_amount + (currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto Real en Caja</label>
              <input
                type="number"
                step="0.01"
                value={closingAmount}
                onChange={(e) => setClosingAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                placeholder="0.00"
                autoFocus
              />
            </div>
            {closingAmount && (
              <div className={`mb-4 p-4 rounded ${
                Number(closingAmount) - (currentSession.opening_amount + (currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)) >= 0
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className="text-sm font-medium">Diferencia</p>
                <p className="text-xl font-bold">
                  S/ {(Number(closingAmount) - (currentSession.opening_amount + (currentSession.total_sales || 0) - (currentSession.total_cancelled || 0))).toFixed(2)}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCloseModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseCash}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cerrar Caja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
