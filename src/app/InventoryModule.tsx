'use client'

import { useState, useEffect } from 'react'
import { productService } from '../lib/aws-dynamodb'

interface Product {
  id: string
  code: string
  name: string
  active_ingredient?: string
  brand?: string
  is_generic?: boolean
  price: number
  cost?: number
  stock: number
  min_stock: number
  category?: string
  laboratory?: string
}

interface InventoryProps {
  products: Product[]
  onUpdateProduct: (product: Product) => void
  onAddProduct: (product: Omit<Product, 'id'>) => void
}

export default function InventoryModule({ products: initialProducts, onUpdateProduct, onAddProduct }: InventoryProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  const [newProduct, setNewProduct] = useState({
    code: '',
    name: '',
    active_ingredient: '',
    brand: '',
    is_generic: false,
    price: 0,
    cost: 0,
    stock: 0,
    min_stock: 5,
    category: '',
    laboratory: ''
  })

  // Load products from DynamoDB
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

  const categories = ['Analgésicos', 'Antibióticos', 'Antiinflamatorios', 'Vitaminas', 'Digestivos', 'Respiratorios']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.active_ingredient?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    
    return matchesSearch && matchesCategory
  })

  const lowStockProducts = products.filter(p => p.stock <= p.min_stock)

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const createdProduct = await productService.createProduct(newProduct)
      setProducts([...products, createdProduct])
      onAddProduct(newProduct as Product)
      setNewProduct({
        code: '',
        name: '',
        active_ingredient: '',
        brand: '',
        is_generic: false,
        price: 0,
        cost: 0,
        stock: 0,
        min_stock: 5,
        category: '',
        laboratory: ''
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
      await productService.updateStock(productId, newStock)
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, stock: newStock } : p
      )
      setProducts(updatedProducts)
      
      const product = products.find(p => p.id === productId)
      if (product) {
        onUpdateProduct({ ...product, stock: newStock })
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Error al actualizar stock')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600">BOTICAS BELLAFARMA</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Agregar Producto
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total Productos</h3>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Stock Bajo</h3>
          <p className="text-2xl font-bold text-red-600">{lowStockProducts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Valor Inventario</h3>
          <p className="text-2xl font-bold text-green-600">
            S/ {products.reduce((sum, p) => sum + (p.cost || p.price * 0.7) * p.stock, 0).toFixed(0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Genéricos</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {products.filter(p => p.is_generic).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Código, nombre o principio activo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">⚠️ Productos con Stock Bajo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockProducts.map(product => (
              <div key={product.id} className="text-sm text-red-700">
                {product.name} - Stock: {product.stock} (Mín: {product.min_stock})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.code}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      {product.active_ingredient && (
                        <div className="text-xs text-blue-600">P.A: {product.active_ingredient}</div>
                      )}
                      {product.laboratory && (
                        <div className="text-xs text-gray-500">Lab: {product.laboratory}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.is_generic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {product.is_generic ? '🟢 Genérico' : `🔵 ${product.brand}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">S/ {product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        product.stock <= product.min_stock ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {product.stock}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleUpdateStock(product.id, Math.max(0, product.stock - 1))}
                          className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleUpdateStock(product.id, product.stock + 1)}
                          className="w-6 h-6 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                        >
                          +
                        </button>
                      </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                  <input
                    type="text"
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Principio Activo</label>
                  <input
                    type="text"
                    value={newProduct.active_ingredient}
                    onChange={(e) => setNewProduct({...newProduct, active_ingredient: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca/Laboratorio</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_generic"
                    checked={newProduct.is_generic}
                    onChange={(e) => setNewProduct({...newProduct, is_generic: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="is_generic" className="text-sm font-medium text-gray-700">
                    Es genérico
                  </label>
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
                  Agregar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}