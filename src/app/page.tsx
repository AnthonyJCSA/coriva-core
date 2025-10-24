'use client'

import { useState, useEffect, useRef } from 'react'
import { productService, saleService, customerService, reportService } from '@/lib/database'
import { Product, Customer } from '@/lib/supabase'

interface CartItem extends Product {
  quantity: number
}

export default function FarmaciaPOS() {
  const [currentView, setCurrentView] = useState('pos')
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchCode, setSearchCode] = useState('')
  const [customerDoc, setCustomerDoc] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO')
  const [receiptType, setReceiptType] = useState('BOLETA')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>({})
  
  const searchRef = useRef<HTMLInputElement>(null)

  // Cargar datos iniciales
  useEffect(() => {
    loadProducts()
    loadCustomers()
    loadStats()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const loadCustomers = async () => {
    try {
      const data = await customerService.getAll()
      setCustomers(data)
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }

  const loadStats = async () => {
    try {
      const data = await reportService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  // Buscar producto y agregar al carrito
  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchCode.trim()) {
      try {
        const product = await productService.findByCode(searchCode) || 
                       products.find(p => p.name.toLowerCase().includes(searchCode.toLowerCase()))
        
        if (product && product.stock > 0) {
          addToCart(product)
          setSearchCode('')
        } else {
          alert('Producto no encontrado o sin stock')
          setSearchCode('')
        }
      } catch (error) {
        alert('Error al buscar producto')
        setSearchCode('')
      }
    }
  }

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id)
    const currentQty = existing ? existing.quantity : 0
    
    if (currentQty < product.stock) {
      if (existing) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        setCart([...cart, { ...product, quantity: 1 }])
      }
    } else {
      alert('Stock insuficiente')
    }
  }

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item.id !== productId))
      return
    }
    
    const product = products.find(p => p.id === productId)
    if (product && newQty <= product.stock) {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQty }
          : item
      ))
    }
  }

  // Procesar venta
  const processSale = async () => {
    if (cart.length === 0) {
      alert('Carrito vacío')
      return
    }

    setLoading(true)
    try {
      // Buscar o crear cliente
      let customer = null
      if (customerDoc) {
        customer = await customerService.findByDocument(customerDoc)
        if (!customer && customerName) {
          customer = await customerService.create({
            document_type: 'DNI',
            document_number: customerDoc,
            name: customerName
          })
        }
      }

      // Calcular totales
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const igv = subtotal * 0.18
      const total = subtotal + igv

      // Crear venta
      const sale = await saleService.create({
        customer_id: customer?.id,
        receipt_type: receiptType,
        subtotal,
        igv,
        total,
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        }))
      })

      // Imprimir comprobante
      printReceipt(sale, customer, cart, { subtotal, igv, total })
      
      // Limpiar y recargar
      setCart([])
      setCustomerDoc('')
      setCustomerName('')
      await loadProducts()
      await loadStats()
      searchRef.current?.focus()
      
      alert('Venta procesada exitosamente')
    } catch (error) {
      console.error('Error processing sale:', error)
      alert('Error al procesar la venta')
    } finally {
      setLoading(false)
    }
  }

  const printReceipt = (sale: any, customer: any, items: CartItem[], totals: any) => {
    const receipt = `
═══════════════════════════════════
           FARMACIA SALUD
═══════════════════════════════════
${sale.receipt_type}: ${sale.sale_number}
Fecha: ${new Date().toLocaleString('es-PE')}
───────────────────────────────────
Cliente: ${customer?.name || 'Cliente General'}
Doc: ${customer?.document_number || '00000000'}
───────────────────────────────────
PRODUCTOS:
${items.map(item => 
  `${item.name}
  ${item.quantity} x S/ ${item.price.toFixed(2)} = S/ ${(item.quantity * item.price).toFixed(2)}`
).join('\n')}
───────────────────────────────────
Subtotal:        S/ ${totals.subtotal.toFixed(2)}
IGV (18%):       S/ ${totals.igv.toFixed(2)}
TOTAL:           S/ ${totals.total.toFixed(2)}
───────────────────────────────────
Pago: ${sale.payment_method}
───────────────────────────────────
        ¡GRACIAS POR SU COMPRA!
═══════════════════════════════════`

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Comprobante</title></head>
          <body style="font-family: monospace; white-space: pre-line; margin: 20px;">
            ${receipt}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault()
        setCart([])
        setCustomerDoc('')
        setCustomerName('')
        searchRef.current?.focus()
      }
      
      if (e.key === 'F2') {
        e.preventDefault()
        processSale()
      }
      
      if (e.key === 'Escape') {
        setSearchCode('')
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [cart])

  if (currentView === 'pos') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">💊 FARMACIA POS - SUPABASE</h1>
              <p className="text-sm">F1: Nueva Venta | F2: Procesar | ESC: Limpiar</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('inventory')}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                📦 Inventario
              </button>
              <button
                onClick={() => setCurrentView('reports')}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                📊 Reportes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-b-lg shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Panel de Búsqueda y Productos */}
              <div className="lg:col-span-2">
                
                {/* Búsqueda Rápida */}
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">BUSCAR PRODUCTO (Código o Nombre)</label>
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full p-3 text-lg border-2 border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="Escriba código o nombre y presione ENTER"
                    autoComplete="off"
                  />
                </div>

                {/* Lista de Productos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className={`p-3 border rounded cursor-pointer hover:bg-blue-50 ${
                        product.stock === 0 ? 'bg-red-50 opacity-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm">[{product.code}] {product.name}</p>
                          <p className="text-blue-600 font-bold">S/ {product.price.toFixed(2)}</p>
                          {product.category && (
                            <p className="text-xs text-gray-500">{product.category}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${
                            product.stock > product.min_stock ? 'text-green-600' : 
                            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            Stock: {product.stock}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel de Venta */}
              <div className="bg-gray-50 p-4 rounded">
                
                {/* Datos del Cliente */}
                <div className="mb-4">
                  <h3 className="font-bold mb-2">CLIENTE</h3>
                  <input
                    type="text"
                    value={customerDoc}
                    onChange={(e) => setCustomerDoc(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="DNI/RUC"
                  />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Nombre/Razón Social"
                  />
                </div>

                {/* Tipo de Comprobante */}
                <div className="mb-4">
                  <h3 className="font-bold mb-2">COMPROBANTE</h3>
                  <select
                    value={receiptType}
                    onChange={(e) => setReceiptType(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="BOLETA">BOLETA</option>
                    <option value="FACTURA">FACTURA</option>
                    <option value="TICKET">TICKET</option>
                  </select>
                </div>

                {/* Carrito */}
                <div className="mb-4">
                  <h3 className="font-bold mb-2">CARRITO ({cart.length} items)</h3>
                  <div className="max-h-60 overflow-y-auto">
                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Carrito vacío</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center mb-2 p-2 bg-white rounded">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">S/ {item.price.toFixed(2)} c/u</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-red-500 text-white rounded text-xs"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-green-500 text-white rounded text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Totales */}
                {cart.length > 0 && (
                  <div className="mb-4 p-3 bg-white rounded">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>S/ {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IGV (18%):</span>
                      <span>S/ {(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>TOTAL:</span>
                      <span>S/ {(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Método de Pago */}
                <div className="mb-4">
                  <h3 className="font-bold mb-2">PAGO</h3>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="EFECTIVO">EFECTIVO</option>
                    <option value="TARJETA">TARJETA</option>
                    <option value="YAPE">YAPE</option>
                    <option value="PLIN">PLIN</option>
                  </select>
                </div>

                {/* Botones de Acción */}
                <div className="space-y-2">
                  <button
                    onClick={processSale}
                    disabled={cart.length === 0 || loading}
                    className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {loading ? '⏳ Procesando...' : '🖨️ PROCESAR VENTA (F2)'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setCart([])
                      setCustomerDoc('')
                      setCustomerName('')
                      searchRef.current?.focus()
                    }}
                    className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
                  >
                    🗑️ LIMPIAR (F1)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Otras vistas (Inventario, Reportes) se implementarán después
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {currentView === 'inventory' ? '📦 Gestión de Inventario' : '📊 Reportes'}
            </h2>
            <button
              onClick={() => setCurrentView('pos')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ← Volver al POS
            </button>
          </div>
          
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              {currentView === 'inventory' ? 'Módulo de Inventario' : 'Módulo de Reportes'} en desarrollo...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Conectado a Supabase ✅
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}