'use client'

import { useState, useEffect } from 'react'
import { exportCustomersToCSV } from '../lib/export'

interface Customer {
  id: string
  document_type: 'DNI' | 'RUC' | 'CE'
  document_number: string
  full_name: string
  phone?: string
  email?: string
  address?: string
  total_purchases: number
  last_purchase?: string
  created_at: string
}

interface CustomersModuleProps {
  currentUser: any
}

const STORAGE_KEY = 'coriva_customers'

export default function CustomersModule({ currentUser }: CustomersModuleProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [newCustomer, setNewCustomer] = useState({
    document_type: 'DNI' as 'DNI' | 'RUC' | 'CE',
    document_number: '',
    full_name: '',
    phone: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    setCustomers(data ? JSON.parse(data) : [])
  }

  const saveCustomers = (data: Customer[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setCustomers(data)
  }

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    
    const customer: Customer = {
      id: `cust_${Date.now()}`,
      ...newCustomer,
      total_purchases: 0,
      created_at: new Date().toISOString()
    }

    saveCustomers([customer, ...customers])
    setNewCustomer({
      document_type: 'DNI',
      document_number: '',
      full_name: '',
      phone: '',
      email: '',
      address: ''
    })
    setShowAddForm(false)
    alert('✅ Cliente agregado')
  }

  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer) return

    const updated = customers.map(c => 
      c.id === editingCustomer.id ? editingCustomer : c
    )
    saveCustomers(updated)
    setShowEditForm(false)
    setEditingCustomer(null)
    alert('✅ Cliente actualizado')
  }

  const handleDeleteCustomer = (customer: Customer) => {
    if (!confirm(`¿Eliminar a ${customer.full_name}?`)) return
    saveCustomers(customers.filter(c => c.id !== customer.id))
  }

  const filteredCustomers = customers.filter(c =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.document_number.includes(searchTerm)
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600">Base de datos de clientes</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => exportCustomersToCSV(customers)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            📄 Exportar
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + Agregar Cliente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total Clientes</h3>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Clientes Activos</h3>
          <p className="text-2xl font-bold text-green-600">
            {customers.filter(c => c.total_purchases > 0).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Nuevos (Este Mes)</h3>
          <p className="text-2xl font-bold text-purple-600">
            {customers.filter(c => {
              const created = new Date(c.created_at)
              const now = new Date()
              return created.getMonth() === now.getMonth()
            }).length}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar por nombre o documento..."
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compras</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div>
                    <span className="font-medium">{customer.document_type}</span>
                    <p className="text-gray-600">{customer.document_number}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {customer.full_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div>
                    {customer.phone && <p>📱 {customer.phone}</p>}
                    {customer.email && <p className="text-xs">✉️ {customer.email}</p>}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="font-bold text-green-600">{customer.total_purchases}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCustomer(customer)
                        setShowEditForm(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(customer)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Agregar Cliente</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Doc *</label>
                  <select
                    value={newCustomer.document_type}
                    onChange={(e) => setNewCustomer({...newCustomer, document_type: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DNI">DNI</option>
                    <option value="RUC">RUC</option>
                    <option value="CE">CE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                  <input
                    type="text"
                    value={newCustomer.document_number}
                    onChange={(e) => setNewCustomer({...newCustomer, document_number: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={newCustomer.full_name}
                    onChange={(e) => setNewCustomer({...newCustomer, full_name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Agregar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditForm && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Editar Cliente</h2>
            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Doc</label>
                  <select
                    value={editingCustomer.document_type}
                    onChange={(e) => setEditingCustomer({...editingCustomer, document_type: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DNI">DNI</option>
                    <option value="RUC">RUC</option>
                    <option value="CE">CE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input
                    type="text"
                    value={editingCustomer.document_number}
                    onChange={(e) => setEditingCustomer({...editingCustomer, document_number: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={editingCustomer.full_name}
                    onChange={(e) => setEditingCustomer({...editingCustomer, full_name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingCustomer(null)
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
