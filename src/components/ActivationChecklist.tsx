'use client'

import { useState, useEffect } from 'react'

interface ActivationChecklistProps {
  products: number
  sales: number
  cashRegisterOpen: boolean
  usersInvited: number
}

export default function ActivationChecklist({ products, sales, cashRegisterOpen, usersInvited }: ActivationChecklistProps) {
  const [isVisible, setIsVisible] = useState(true)

  const tasks = [
    { id: 'products', label: 'Agregar primer producto', completed: products > 0, icon: '📦' },
    { id: 'cash', label: 'Abrir caja', completed: cashRegisterOpen, icon: '💵' },
    { id: 'sale', label: 'Realizar primera venta', completed: sales > 0, icon: '🛒' },
    { id: 'user', label: 'Invitar un usuario', completed: usersInvited > 0, icon: '👥' }
  ]

  const completedTasks = tasks.filter(t => t.completed).length
  const progress = (completedTasks / tasks.length) * 100

  useEffect(() => {
    if (completedTasks === tasks.length) {
      setTimeout(() => setIsVisible(false), 3000)
    }
  }, [completedTasks, tasks.length])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50 animate-in slide-in-from-bottom">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Primeros pasos</h3>
          <p className="text-sm text-gray-600">{completedTasks} de {tasks.length} completados</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Progreso</span>
          <span className="font-bold text-indigo-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              task.completed
                ? 'bg-green-50 border border-green-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              task.completed ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              {task.completed ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-lg">{task.icon}</span>
              )}
            </div>
            <span className={`flex-1 text-sm font-medium ${
              task.completed ? 'text-green-800 line-through' : 'text-gray-700'
            }`}>
              {task.label}
            </span>
          </div>
        ))}
      </div>

      {completedTasks === tasks.length && (
        <div className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl text-center">
          <p className="font-bold text-lg mb-1">🎉 ¡Felicitaciones!</p>
          <p className="text-sm text-white/90">Ya estás listo para vender</p>
        </div>
      )}

      {completedTasks < tasks.length && (
        <div className="mt-4 bg-indigo-50 border border-indigo-100 p-3 rounded-xl">
          <p className="text-sm text-indigo-800">
            <span className="font-semibold">💡 Tip:</span> Estás a {tasks.length - completedTasks} {tasks.length - completedTasks === 1 ? 'paso' : 'pasos'} de tu primera venta
          </p>
        </div>
      )}
    </div>
  )
}
