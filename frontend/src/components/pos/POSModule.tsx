'use client'

import { useState } from 'react'
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  TrashIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  stock: number
}

export default function POSModule() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO')

  // Productos de ejemplo
  const products = [
    { id: '1', name: 'Paracetamol 500mg', price: 2.50, stock: 100 },
    { id: '2', name: 'Ibuprofeno 400mg', price: 3.20, stock: 50 },
    { id: '3', name: 'Amoxicilina 500mg', price: 8.90, stock: 25 },
    { id: '4', name: 'Vitamina C 1000mg', price: 15.00, stock: 80 },
  ]

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.13 // 13% IVA
  const total = subtotal + tax

  const handleCheckout = () => {
    if (cart.length === 0) return
    
    // Aquí iría la lógica de procesamiento de venta
    alert(`Venta procesada: ₡${total.toFixed(2)} - ${paymentMethod}`)
    setCart([])
  }

  return (
    <div className="flex h-full">
      {/* Productos */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Punto de Venta
          </h2>
          
          {/* Búsqueda */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos por nombre o código..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-primary-600">
                  ₡{product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>
              <button
                onClick={() => addToCart(product)}
                className="w-full btn-primary"
                disabled={product.stock === 0}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Agregar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Carrito de Compras
        </h3>

        {/* Items del carrito */}
        <div className="flex-1 overflow-y-auto mb-6">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Carrito vacío
            </p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.name}
                    </h4>
                    <p className="text-primary-600 font-semibold">
                      ₡{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-danger-600 hover:text-danger-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₡{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (13%):</span>
                <span>₡{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₡{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Método de pago */}
            <div className="mb-4">
              <label className="label">Método de Pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="YAPE">Yape</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </select>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-success"
            >
              {paymentMethod === 'EFECTIVO' ? (
                <BanknotesIcon className="h-5 w-5 mr-2" />
              ) : (
                <CreditCardIcon className="h-5 w-5 mr-2" />
              )}
              Procesar Venta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}