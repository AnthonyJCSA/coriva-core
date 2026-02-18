'use client'

import { useState, useEffect } from 'react'
import { User } from '../types'
import { Role } from '../lib/permissions'

interface UsersModuleProps {
  currentUser: User
  organizationId: string
}

const STORAGE_KEY = 'coriva_users'

export default function UsersModule({ currentUser, organizationId }: UsersModuleProps) {
  const [users, setUsers] = useState<User[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'VENDEDOR' as Role
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    const allUsers = data ? JSON.parse(data) : []
    setUsers(allUsers.filter((u: User) => u.organization_id === organizationId))
  }

  const saveUser = (user: User) => {
    const data = localStorage.getItem(STORAGE_KEY)
    const allUsers = data ? JSON.parse(data) : []
    const filtered = allUsers.filter((u: User) => u.id !== user.id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...filtered, user]))
    loadUsers()
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    
    const user: User = {
      id: `user_${Date.now()}`,
      organization_id: organizationId,
      ...newUser,
      is_active: true,
      created_at: new Date().toISOString()
    }

    saveUser(user)
    setNewUser({
      username: '',
      email: '',
      full_name: '',
      password: '',
      role: 'VENDEDOR'
    })
    setShowAddForm(false)
    alert('✅ Usuario creado')
  }

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    saveUser(editingUser)
    setShowEditForm(false)
    setEditingUser(null)
    alert('✅ Usuario actualizado')
  }

  const handleToggleStatus = (user: User) => {
    saveUser({ ...user, is_active: !user.is_active })
  }

  const handleDeleteUser = (user: User) => {
    if (user.id === currentUser.id) {
      alert('No puedes eliminar tu propio usuario')
      return
    }
    if (!confirm(`¿Eliminar a ${user.full_name}?`)) return
    
    const data = localStorage.getItem(STORAGE_KEY)
    const allUsers = data ? JSON.parse(data) : []
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers.filter((u: User) => u.id !== user.id)))
    loadUsers()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👤 Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Control de acceso y permisos del sistema</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all shadow-md hover:shadow-lg"
        >
          + Agregar Usuario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">👥 Total Usuarios</h3>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">✅ Activos</h3>
          <p className="text-3xl font-bold text-green-600">
            {users.filter(u => u.is_active).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">👑 Administradores</h3>
          <p className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.role === 'ADMIN').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.full_name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'ADMIN' ? '👑 ADMIN' : user.role === 'MANAGER' ? '👔 MANAGER' : '🛒 VENDEDOR'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.is_active ? '✅ Activo' : '❌ Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setEditingUser(user)
                          setShowEditForm(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">➕ Agregar Usuario</h2>
            <form onSubmit={handleAddUser} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario *</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rol *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as Role})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="VENDEDOR">🛒 Vendedor</option>
                  <option value="MANAGER">👔 Manager</option>
                  <option value="ADMIN">👑 Administrador</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg transition-all"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditForm && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">✏️ Editar Usuario</h2>
            <form onSubmit={handleUpdateUser} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={editingUser.full_name}
                  onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rol</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as Role})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="VENDEDOR">🛒 Vendedor</option>
                  <option value="MANAGER">👔 Manager</option>
                  <option value="ADMIN">👑 Administrador</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingUser(null)
                  }}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg transition-all"
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
