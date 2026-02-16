'use client'

import { useState, useEffect } from 'react'
import { productService } from '../lib/bellafarma-dynamo'

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
  onDeleteProduct: (id: string) => void
  currentUser: any
}

export default function InventoryModule({ products: initialProducts, onUpdateProduct, onAddProduct, onDeleteProduct, currentUser }: InventoryProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showLowStock, setShowLowStock] = useState(false)
  const itemsPerPage = 20

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
  }).sort((a, b) => a.name.localeCompare(b.name))

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterCategory])

  const lowStockProducts = products.filter(p => p.stock <= p.min_stock)

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await productService.createProduct(newProduct)
      // Solo recargar desde DynamoDB
      await loadProducts()
      // NO llamar onAddProduct para evitar duplicados
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
      // Asegurar que newStock sea un número positivo
      const validStock = Math.max(0, Number(newStock));
      
      await productService.updateStock(productId, validStock)
      
      // Actualizar estado local inmediatamente para mejor UX
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? { ...p, stock: validStock } : p
        )
      );
      
      // Recargar desde DynamoDB para confirmar
      await loadProducts()
      
      const product = products.find(p => p.id === productId)
      if (product) {
        onUpdateProduct({ ...product, stock: validStock })
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Error al actualizar stock')
      // Revertir cambio local en caso de error
      await loadProducts()
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
      await productService.updateProduct(editingProduct, currentUser?.id || 'unknown', currentUser?.name || 'Usuario')
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
      await productService.deleteProduct(product.id, currentUser?.id || 'unknown', currentUser?.name || 'Usuario')
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600">BOTICAS BELLAFARMA</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadProducts}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? '🔄 Cargando...' : 'Actualizar Datos'}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + Agregar Producto
          </button>
        </div>
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

      {/* Low Stock Alert - Collapsible */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowLowStock(!showLowStock)}
          >
            <h3 className="text-red-800 font-bold text-lg">
              ⚠️ Productos con Stock Bajo ({lowStockProducts.length})
            </h3>
            <button className="text-red-800 font-bold text-xl">
              {showLowStock ? '▲' : '▼'}
            </button>
          </div>
          
          {showLowStock && (
            <div className="mt-3 overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full">
                <thead className="sticky top-0 bg-red-50">
                  <tr className="border-b border-red-200">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-red-800">Producto</th>
                    <th className="text-center py-2 px-3 text-sm font-semibold text-red-800">Stock Actual</th>
                    <th className="text-center py-2 px-3 text-sm font-semibold text-red-800">Stock Mínimo</th>
                    <th className="text-center py-2 px-3 text-sm font-semibold text-red-800">Faltante</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.sort((a, b) => a.name.localeCompare(b.name)).map(product => (
                    <tr key={product.id} className="border-b border-red-100 hover:bg-red-100">
                      <td className="py-2 px-3 text-sm text-red-900 font-medium">{product.name}</td>
                      <td className="py-2 px-3 text-sm text-center text-red-700 font-bold">{product.stock}</td>
                      <td className="py-2 px-3 text-sm text-center text-red-600">{product.min_stock}</td>
                      <td className="py-2 px-3 text-sm text-center text-red-800 font-semibold">
                        {product.min_stock - product.stock > 0 ? product.min_stock - product.stock : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> de{' '}
            <span className="font-medium">{filteredProducts.length}</span> productos | Página {currentPage} de {totalPages}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
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
                  <td className="px-4 py-3 text-sm text-gray-900">S/ {product.price.toFixed(3)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        Number(product.stock) <= Number(product.min_stock) ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {Number(product.stock)}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleUpdateStock(product.id, Math.max(0, Number(product.stock) - 1))}
                          disabled={loading || Number(product.stock) <= 0}
                          className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:bg-gray-400"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleUpdateStock(product.id, Number(product.stock) + 1)}
                          disabled={loading}
                          className="w-6 h-6 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:bg-gray-400"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> de{' '}
                  <span className="font-medium">{filteredProducts.length}</span> productos
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    «
                  </button>
                  {totalPages <= 10 ? (
                    [...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-green-600 border-green-600 text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))
                  ) : (
                    <>
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => setCurrentPage(1)}
                            className="relative inline-flex items-center px-4 py-2 border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                          >
                            1
                          </button>
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        </>
                      )}
                      {[...Array(5)].map((_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i
                        if (pageNum < 1 || pageNum > totalPages) return null
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-green-600 border-green-600 text-white'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      {currentPage < totalPages - 2 && (
                        <>
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="relative inline-flex items-center px-4 py-2 border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    »
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
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
                    step="0.001"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    placeholder="0.000"
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

      {/* Edit Product Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                  <input
                    type="text"
                    value={editingProduct.code}
                    onChange={(e) => setEditingProduct({...editingProduct, code: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta *</label>
                  <input
                    type="number"
                    step="0.001"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    placeholder="0.000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingProduct(null)
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
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