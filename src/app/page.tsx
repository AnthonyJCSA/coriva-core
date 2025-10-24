'use client'

import { useState, useEffect, useRef } from 'react'

interface Product {
  id: string
  code: string
  name: string
  price: number
  stock: number
  category?: string
}

interface CartItem extends Product {
  quantity: number
}

export default function FarmaciaPOS() {
  const [products] = useState<Product[]>([
    { id: '1', code: '001', name: 'Paracetamol 500mg', price: 2.50, stock: 100, category: 'Analgésicos' },
    { id: '2', code: '002', name: 'Ibuprofeno 400mg', price: 3.20, stock: 50, category: 'Antiinflamatorios' },
    { id: '3', code: '003', name: 'Amoxicilina 500mg', price: 8.90, stock: 25, category: 'Antibióticos' },
    { id: '4', code: '004', name: 'Vitamina C 1000mg', price: 15.00, stock: 80, category: 'Vitaminas' },
    { id: '5', code: '005', name: 'Aspirina 100mg', price: 1.80, stock: 200, category: 'Analgésicos' },
  ])

  const [cart, setCart] = useState<CartItem[]>([])
  const [searchCode, setSearchCode] = useState('')
  const [customerDoc, setCustomerDoc] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO')
  const [receiptType, setReceiptType] = useState('BOLETA')
  
  const searchRef = useRef<HTMLInputElement>(null)

  // Auto-focus en búsqueda
  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  // Buscar producto por código y agregar automáticamente
  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const product = products.find(p => p.code === searchCode || p.name.toLowerCase().includes(searchCode.toLowerCase()))
      
      if (product && product.stock > 0) {
        addToCart(product)
        setSearchCode('')
      } else {
        alert('Producto no encontrado o sin stock')
        setSearchCode('')
      }
    }
  }

  // Agregar al carrito
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

  // Cambiar cantidad
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

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const igv = subtotal * 0.18
  const total = subtotal + igv

  // Procesar venta
  const processSale = () => {
    if (cart.length === 0) {
      alert('Carrito vacío')
      return
    }

    // Generar comprobante
    const saleData = {
      type: receiptType,
      number: `${receiptType}-${Date.now()}`,
      date: new Date().toLocaleString('es-PE'),
      customer: {
        doc: customerDoc || '00000000',
        name: customerName || 'Cliente General'
      },
      items: cart,
      subtotal: subtotal.toFixed(2),
      igv: igv.toFixed(2),
      total: total.toFixed(2),
      payment: paymentMethod
    }

    // Mostrar comprobante
    printReceipt(saleData)
    
    // Limpiar venta
    setCart([])
    setCustomerDoc('')
    setCustomerName('')
    searchRef.current?.focus()
  }

  // Imprimir comprobante
  const printReceipt = (sale: any) => {
    const receipt = `
═══════════════════════════════════
           FARMACIA SALUD
═══════════════════════════════════
${sale.type}: ${sale.number}
Fecha: ${sale.date}
───────────────────────────────────
Cliente: ${sale.customer.name}
Doc: ${sale.customer.doc}
───────────────────────────────────
PRODUCTOS:
${sale.items.map((item: CartItem) => 
  `${item.name}
  ${item.quantity} x S/ ${item.price.toFixed(2)} = S/ ${(item.quantity * item.price).toFixed(2)}`
).join('\n')}
───────────────────────────────────
Subtotal:        S/ ${sale.subtotal}
IGV (18%):       S/ ${sale.igv}
TOTAL:           S/ ${sale.total}
───────────────────────────────────
Pago: ${sale.payment}
───────────────────────────────────
        ¡GRACIAS POR SU COMPRA!
═══════════════════════════════════`

    // Crear ventana de impresión
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
      // F1 - Nueva venta
      if (e.key === 'F1') {
        e.preventDefault()
        setCart([])
        setCustomerDoc('')
        setCustomerName('')
        searchRef.current?.focus()
      }
      
      // F2 - Procesar venta
      if (e.key === 'F2') {
        e.preventDefault()
        processSale()
      }
      
      // ESC - Limpiar búsqueda
      if (e.key === 'Escape') {
        setSearchCode('')
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [cart])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">💊 FARMACIA POS - DEMO</h1>
          <p className="text-sm">F1: Nueva Venta | F2: Procesar | ESC: Limpiar</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                          product.stock > 10 ? 'text-green-600' : 
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
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IGV (18%):</span>
                    <span>S/ {igv.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>TOTAL:</span>
                    <span>S/ {total.toFixed(2)}</span>
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
                  disabled={cart.length === 0}
                  className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
                >
                  🖨️ PROCESAR VENTA (F2)
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