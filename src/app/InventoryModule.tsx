'use client'

import { useState, useEffect } from 'react'
import { productService } from '../lib/storage'
import { exportInventoryToCSV } from '../lib/export'

interface Product {
  id: string
  code: string
  name: string
  category?: string
  price: number
  cost?: number
  stock: number
  min_stock: number
}

interface InventoryProps {
  products: Product[]
  onUpdateProduct: (product: Product) => void
  onAddProduct: (product: Omit<Product, 'id'>) => void
  onDeleteProduct: (id: string) => void
  currentUser: any
}

export default function InventoryModule({ products: initialProducts, onUpdateProduct, onAddProduct, onDeleteProduct, currentUser }: InventoryProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    category: 'General',
    price: 0,
    cost: 0,
    stock: 0,
    min_stock: 5
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.getAll()
      setProducts(data as Product[])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockProducts = products.filter(p => p.stock <= p.min_stock)

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onAddProduct(newProduct)
      await loadProducts()
      setNewProduct({
        code: '',
        name: '',
        category: 'General',
        price: 0,
        cost: 0,
        stock: 0,
        min_stock: 5
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Error al agregar producto')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStock = async (productId: string, newStock: number) => {
    setLoading(true)
    try {
      const validStock = Math.max(0, Number(newStock))
      await productService.updateStock(productId, validStock)
      await loadProducts()
      
      const product = products.find(p => p.id === productId)
      if (product) {
        onUpdateProduct({ ...product, stock: validStock })
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Error al actualizar stock')
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowEditForm(true)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    
    setLoading(true)
    try {
      await onUpdateProduct(editingProduct)
      await loadProducts()
      setShowEditForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error al actualizar producto')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`¿Estás seguro de eliminar "${product.name}"?`)) return
    
    setLoading(true)
    try {
      await onDeleteProduct(product.id)
      await loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Gestión de Inventario</h1>
          <p className="text-gray-600 mt-1">Control de productos y stock en tiempo real</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadProducts}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-all shadow-md hover:shadow-lg"
          >
            {loading ? '🔄 Cargando...' : '🔄 Actualizar'}
          </button>
          <button
            onClick={() => exportInventoryToCSV(products)}
            className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 font-medium transition-all shadow-md hover:shadow-lg"
          >
            📄 Exportar
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all shadow-md hover:shadow-lg"
          >
            + Agregar Producto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">📊 Total Productos</h3>
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">⚠️ Stock Bajo</h3>
          <p className="text-3xl font-bold text-red-600">{lowStockProducts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">💰 Valor Inventario</h3>
          <p className="text-3xl font-bold text-green-600">
            S/ {products.reduce((sum, p) => sum + (p.cost || p.price * 0.7) * p.stock, 0).toFixed(0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">📦 Items en Stock</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
          placeholder="🔍 Buscar por código o nombre..."
        />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl shadow-md p-6">
          <h3 className="text-red-800 font-bold text-lg mb-4 flex items-center">
            <span className="mr-2">⚠️</span>
            Productos con Stock Bajo ({lowStockProducts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-xl border border-red-200 shadow-sm">
                <p className="font-semibold text-sm text-gray-900">{product.name}</p>
                <p className="text-xs text-red-600 mt-1">Stock: {product.stock} / Mínimo: {product.min_stock}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Código</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">S/ {product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        product.stock <= product.min_stock 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {product.stock}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleUpdateStock(product.id, product.stock - 1)}
                          disabled={loading || product.stock <= 0}
                          className="w-8 h-8 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-bold"
                        >
                          −
                        </button>
                        <button
                          onClick={() => handleUpdateStock(product.id, product.stock + 1)}
                          disabled={loading}
                          className="w-8 h-8 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 disabled:bg-gray-300 transition-colors flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
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
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">➕ Agregar Nuevo Producto</h2>
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Código *</label>
                  <input
                    type="text"
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio Venta *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Inicial</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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
                  Agregar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">✏️ Editar Producto</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Código *</label>
                  <input
                    type="text"
                    value={editingProduct.code}
                    onChange={(e) => setEditingProduct({...editingProduct, code: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingProduct(null)
                  }}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 font-semibold shadow-lg transition-all"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
