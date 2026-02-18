'use client'

import { useState, useEffect } from 'react'
import { cashService } from '../lib/storage'

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

    const newSession: CashSession = {
      id: `cash_${Date.now()}`,
      user_id: currentUser?.id || 'unknown',
      user_name: currentUser?.full_name || 'Usuario',
      opening_amount: Number(openingAmount),
      opening_date: new Date().toISOString(),
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
      alert('❌ Error al aperturar caja')
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
      await cashService.updateSession(currentSession.id, {
        closing_amount: Number(closingAmount),
        closing_date: new Date().toISOString(),
        status: 'CERRADA',
        difference
      })

      setCurrentSession(null)
      setClosingAmount('')
      setShowCloseModal(false)
      alert('✅ Caja cerrada exitosamente')
    } catch (error) {
      console.error('Error closing cash:', error)
      alert('❌ Error al cerrar caja')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💵 Gestión de Caja</h1>
          <p className="text-gray-600 mt-1">Control de apertura y cierre de caja</p>
        </div>
      </div>

      {!currentSession ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg">
              <span className="text-6xl">🔒</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Caja Cerrada</h2>
            <p className="text-gray-600 text-lg">Debe aperturar la caja para comenzar a vender</p>
          </div>
          <button
            onClick={() => setShowOpenModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            🔓 Aperturar Caja
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800 flex items-center">
                <span className="mr-2">✅</span> Caja Abierta
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={loadCurrentSession}
                  disabled={loading}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? '🔄 Cargando...' : '🔄 Actualizar'}
                </button>
                <button
                  onClick={() => setShowCloseModal(true)}
                  className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-5 py-2.5 rounded-xl hover:from-red-700 hover:to-pink-700 font-medium transition-all shadow-md hover:shadow-lg"
                >
                  🔒 Cerrar Caja
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100">
                <p className="text-sm text-gray-600 mb-1">👤 Usuario</p>
                <p className="text-lg font-bold text-gray-900">{currentSession.user_name}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100">
                <p className="text-sm text-gray-600 mb-1">💰 Monto Inicial</p>
                <p className="text-xl font-bold text-green-600">S/ {currentSession.opening_amount.toFixed(2)}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100">
                <p className="text-sm text-gray-600 mb-1">🕐 Apertura</p>
                <p className="text-base font-bold text-gray-900">
                  {new Date(currentSession.opening_date).toLocaleString('es-PE', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">💳 Ventas Totales</h3>
              <p className="text-3xl font-bold text-blue-600">S/ {(currentSession.total_sales || 0).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">❌ Ventas Anuladas</h3>
              <p className="text-3xl font-bold text-red-600">S/ {(currentSession.total_cancelled || 0).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">✅ Ventas Netas</h3>
              <p className="text-3xl font-bold text-green-600">S/ {((currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
              <h3 className="text-sm font-medium text-gray-500 mb-2">🎯 Total Esperado</h3>
              <p className="text-3xl font-bold text-purple-600">
                S/ {(currentSession.opening_amount + (currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Apertura */}
      {showOpenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">🔓 Aperturar Caja</h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Monto Inicial</label>
              <input
                type="number"
                step="0.01"
                value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                placeholder="0.00"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowOpenModal(false)}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleOpenCash}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg transition-all"
              >
                Aperturar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cierre */}
      {showCloseModal && currentSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">🔒 Cerrar Caja</h2>
            <div className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">💳 Ventas Totales:</p>
                  <p className="font-bold text-gray-900">S/ {(currentSession.total_sales || 0).toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">❌ Ventas Anuladas:</p>
                  <p className="font-bold text-red-600">- S/ {(currentSession.total_cancelled || 0).toFixed(2)}</p>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-3">
                  <p className="text-sm text-gray-600">✅ Ventas Netas:</p>
                  <p className="font-bold text-green-600">S/ {((currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)).toFixed(2)}</p>
                </div>
                <div className="flex justify-between border-t-2 border-gray-400 pt-3">
                  <p className="font-semibold text-gray-900">🎯 Monto Esperado:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    S/ {(currentSession.opening_amount + (currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">💵 Monto Real en Caja</label>
              <input
                type="number"
                step="0.01"
                value={closingAmount}
                onChange={(e) => setClosingAmount(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-semibold"
                placeholder="0.00"
                autoFocus
              />
            </div>
            {closingAmount && (
              <div className={`mb-6 p-4 rounded-xl border-2 ${
                Number(closingAmount) - (currentSession.opening_amount + (currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)) >= 0
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
              }`}>
                <p className="text-sm font-medium text-gray-700 mb-1">📊 Diferencia</p>
                <p className={`text-2xl font-bold ${
                  Number(closingAmount) - (currentSession.opening_amount + (currentSession.total_sales || 0) - (currentSession.total_cancelled || 0)) >= 0
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  S/ {(Number(closingAmount) - (currentSession.opening_amount + (currentSession.total_sales || 0) - (currentSession.total_cancelled || 0))).toFixed(2)}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCloseModal(false)}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleCloseCash}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 font-semibold shadow-lg transition-all"
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
