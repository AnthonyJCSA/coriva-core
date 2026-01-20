'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  code: string
  name: string
  active_ingredient?: string
  brand?: string
  is_generic?: boolean
  price: number
  stock: number
}

interface CartItem extends Product {
  quantity: number
}

// Mock data para BOTICAS BELLAFARMA
const PRODUCTS: Product[] = [
  { id: '1', code: 'AMX001', name: 'Amoxidal 500mg', active_ingredient: 'Amoxicilina', brand: 'Amoxidal', is_generic: false, price: 25.50, stock: 50 },
  { id: '2', code: 'AMX002', name: 'Amoxicilina Genérica 500mg', active_ingredient: 'Amoxicilina', brand: 'Genérico', is_generic: true, price: 15.80, stock: 80 },
  { id: '3', code: 'PAR001', name: 'Panadol 500mg', active_ingredient: 'Paracetamol', brand: 'Panadol', is_generic: false, price: 8.50, stock: 100 },
  { id: '4', code: 'PAR002', name: 'Paracetamol Genérico 500mg', active_ingredient: 'Paracetamol', brand: 'Genérico', is_generic: true, price: 4.20, stock: 150 },
  { id: '5', code: 'IBU001', name: 'Advil 400mg', active_ingredient: 'Ibuprofeno', brand: 'Advil', is_generic: false, price: 18.90, stock: 60 },
  { id: '6', code: 'IBU002', name: 'Ibuprofeno Genérico 400mg', active_ingredient: 'Ibuprofeno', brand: 'Genérico', is_generic: true, price: 9.50, stock: 90 }
]

const USERS = {
  admin: { password: 'admin123', name: 'Administrador', role: 'ADMINISTRADOR' },
  farmaceutico: { password: 'farm123', name: 'Juan Pérez', role: 'FARMACEUTICO' },
  vendedor: { password: 'vend123', name: 'María García', role: 'VENDEDOR' }
}

export default function FarmaciaPOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  
  const [products] = useState<Product[]>(PRODUCTS)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchCode, setSearchCode] = useState('')
  const [customerDoc, setCustomerDoc] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO')
  const [receiptType, setReceiptType] = useState('BOLETA')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = USERS[username as keyof typeof USERS]
    if (user && user.password === password) {
      setCurrentUser({ username, ...user })
      setIsAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Usuario o contraseña incorrectos')
    }
  }

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchCode.trim()) {
      const results = products.filter(p => 
        p.code.toLowerCase().includes(searchCode.toLowerCase()) ||
        p.name.toLowerCase().includes(searchCode.toLowerCase()) ||
        p.active_ingredient?.toLowerCase().includes(searchCode.toLowerCase())
      )
      setSearchResults(results)
      
      if (results.length === 1) {
        addToCart(results[0])
        setSearchCode('')
        setSearchResults([])
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax

  const processSale = () => {
    if (cart.length === 0) {
      alert('Carrito vacío')
      return
    }

    const receipt = generateReceipt()
    printReceipt(receipt)
    
    setCart([])
    setCustomerDoc('')
    setCustomerName('')
    setSearchResults([])
  }

  const generateReceipt = () => {
    const now = new Date()
    const date = now.toLocaleDateString('es-PE')
    const time = now.toLocaleTimeString('es-PE')
    
    return `
================================
      BOTICAS BELLAFARMA
================================
Av. Perú N°3699, Cdra. 36,
Lado Izquierdo, Zona 4, Sector 46
Urb. Perú - S.M.P.
RUC: 10473232583
Tel: 962257626
⭐ Atención 24 horas ⭐
================================
${receiptType}: ${receiptType}-${Date.now()}
Fecha: ${date} ${time}
${customerName ? `Cliente: ${customerName}` : ''}
${customerDoc ? `DNI: ${customerDoc}` : ''}

================================
CANT  DESCRIPCIÓN      PRECIO
================================
${cart.map(item => {
  const qty = item.quantity.toString().padEnd(4)
  const name = item.name.substring(0, 20).padEnd(20)
  const price = `S/ ${item.price.toFixed(2)}`.padStart(8)
  return `${qty} ${name} ${price}`
}).join('\n')}
================================
Subtotal:           S/ ${subtotal.toFixed(2)}
IGV (18%):          S/ ${tax.toFixed(2)}
TOTAL:              S/ ${total.toFixed(2)}
Pago: ${paymentMethod}

================================
    ¡Gracias por su compra!
   Consulte a nuestro farmacéutico
     para mayor información
================================`
  }

  const printReceipt = (receipt: string) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Comprobante BOTICAS BELLAFARMA</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                font-size: 12px;
                line-height: 1.2;
                margin: 0;
                padding: 10px;
                white-space: pre-line;
              }
            </style>
          </head>
          <body>${receipt}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault()
        setCart([])
        setCustomerDoc('')
        setCustomerName('')
        setSearchResults([])
      }
      
      if (e.key === 'F2') {
        e.preventDefault()
        processSale()
      }
      
      if (e.key === 'Escape') {
        setSearchCode('')
        setSearchResults([])
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [cart])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">BF</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">BOTICAS BELLAFARMA</h1>
            <p className="text-gray-600">Sistema FarmaZi POS</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ingrese su usuario"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Usuarios de prueba:</p>
            <div className="text-xs space-y-1">
              <div><strong>Admin:</strong> admin / admin123</div>
              <div><strong>Farmacéutico:</strong> farmaceutico / farm123</div>
              <div><strong>Vendedor:</strong> vendedor / vend123</div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Av. Perú N°3699, Cdra. 36, S.M.P.</p>
            <p>RUC: 10473232583 | Tel: 962257626</p>
            <p className="font-medium text-green-600">Atención 24 horas</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">💊 BOTICAS BELLAFARMA - FarmaZi POS</h1>
              <p className="text-sm opacity-90">F1: Nueva Venta | F2: Procesar | ESC: Limpiar</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Usuario: {currentUser?.name}</p>
              <p className="text-xs opacity-75">{currentUser?.role}</p>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded mt-1 hover:bg-opacity-30"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-lg shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2">
              
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-green-700">
                  BÚSQUEDA INTELIGENTE (Código, Nombre o Principio Activo)
                </label>
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full p-3 text-lg border-2 border-green-300 rounded focus:border-green-500 focus:outline-none"
                  placeholder="Ej: 'Amoxicilina' para ver todas las marcas disponibles"
                  autoComplete="off"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-green-700">Resultados de búsqueda:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          addToCart(product)
                          setSearchResults([])
                          setSearchCode('')
                        }}
                        className="p-3 border-2 border-green-200 rounded cursor-pointer hover:bg-green-50 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-bold text-sm">[{product.code}] {product.name}</p>
                            <p className="text-green-600 font-bold text-lg">S/ {product.price.toFixed(2)}</p>
                            {product.active_ingredient && (
                              <p className="text-xs text-blue-600">P.A: {product.active_ingredient}</p>
                            )}
                            {product.brand && (
                              <p className="text-xs text-gray-600">
                                {product.is_generic ? '🟢 Genérico' : `🔵 Marca: ${product.brand}`}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${
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
              )}

              <div>
                <h3 className="font-bold mb-3 text-green-700">Productos Populares:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {products.slice(0, 6).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className={`p-3 border rounded cursor-pointer hover:bg-green-50 ${
                        product.stock === 0 ? 'bg-red-50 opacity-50' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm">[{product.code}] {product.name}</p>
                          <p className="text-green-600 font-bold">S/ {product.price.toFixed(2)}</p>
                          {product.active_ingredient && (
                            <p className="text-xs text-blue-600">P.A: {product.active_ingredient}</p>
                          )}
                          {product.brand && (
                            <p className="text-xs text-gray-600">
                              {product.is_generic ? '🟢 Genérico' : `🔵 ${product.brand}`}
                            </p>
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
            </div>

            <div className="bg-gradient-to-b from-green-50 to-blue-50 p-4 rounded border-2 border-green-200">
              
              <div className="mb-4">
                <h3 className="font-bold mb-2 text-green-700">CLIENTE</h3>
                <input
                  type="text"
                  value={customerDoc}
                  onChange={(e) => setCustomerDoc(e.target.value)}
                  className="w-full p-2 mb-2 border border-green-300 rounded focus:border-green-500 focus:outline-none"
                  placeholder="DNI/RUC"
                />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border border-green-300 rounded focus:border-green-500 focus:outline-none"
                  placeholder="Nombre/Razón Social"
                />
              </div>

              <div className="mb-4">
                <h3 className="font-bold mb-2 text-green-700">COMPROBANTE</h3>
                <select
                  value={receiptType}
                  onChange={(e) => setReceiptType(e.target.value)}
                  className="w-full p-2 border border-green-300 rounded focus:border-green-500 focus:outline-none"
                >
                  <option value="BOLETA">BOLETA</option>
                  <option value="FACTURA">FACTURA</option>
                  <option value="TICKET">TICKET</option>
                </select>
              </div>

              <div className="mb-4">
                <h3 className="font-bold mb-2 text-green-700">CARRITO ({cart.length} items)</h3>
                <div className="max-h-60 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Carrito vacío</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center mb-2 p-2 bg-white rounded border border-green-200">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-green-600">S/ {item.price.toFixed(2)} c/u</p>
                          {item.is_generic && <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Genérico</span>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="mb-4 p-3 bg-white rounded border border-green-200">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IGV (18%):</span>
                    <span>S/ {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 text-green-700">
                    <span>TOTAL:</span>
                    <span>S/ {total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-bold mb-2 text-green-700">PAGO</h3>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border border-green-300 rounded focus:border-green-500 focus:outline-none"
                >
                  <option value="EFECTIVO">EFECTIVO</option>
                  <option value="TARJETA">TARJETA</option>
                  <option value="YAPE">YAPE</option>
                  <option value="PLIN">PLIN</option>
                </select>
              </div>

              <div className="space-y-2">
                <button
                  onClick={processSale}
                  disabled={cart.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded font-bold hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 transition-all"
                >
                  🖨️ PROCESAR VENTA (F2)
                </button>
                
                <button
                  onClick={() => {
                    setCart([])
                    setCustomerDoc('')
                    setCustomerName('')
                    setSearchResults([])
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-2 rounded hover:from-red-700 hover:to-red-800 transition-all"
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