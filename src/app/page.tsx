'use client'

import { useState, useEffect } from 'react'
import { Organization, User, Product, CartItem, Sale } from '../types'
import { productService, saleService, cashService } from '../lib/storage'
import CashRegisterModule from './CashRegisterModule'
import InventoryModule from './InventoryModule'
import ReportsModule from './ReportsModule'
import CustomersModule from './CustomersModule'
import SettingsModule from './SettingsModule'
import OnboardingWizard from './OnboardingWizard'
import UsersModule from './UsersModule'
import NotificationsPanel from './NotificationsPanel'
import { canAccessModule } from '../lib/permissions'

// Demo data
const DEMO_ORGS: Organization[] = [
  {
    id: '1',
    name: 'Demo Store',
    slug: 'demo-store',
    business_type: 'retail',
    settings: { currency: 'S/', tax_rate: 0.18 },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  demo: {
    password: 'demo123',
    user: {
      id: '1',
      organization_id: '1',
      username: 'demo',
      email: 'demo@coriva.com',
      full_name: 'Usuario Demo',
      role: 'ADMIN',
      is_active: true,
      created_at: new Date().toISOString()
    }
  }
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', organization_id: '1', code: 'PROD001', name: 'Producto 1', category: 'General', price: 25.50, cost: 18.00, stock: 50, min_stock: 10, unit: 'unit', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', organization_id: '1', code: 'PROD002', name: 'Producto 2', category: 'General', price: 15.80, cost: 12.00, stock: 80, min_stock: 15, unit: 'unit', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', organization_id: '1', code: 'PROD003', name: 'Producto 3', category: 'General', price: 8.50, cost: 6.00, stock: 100, min_stock: 20, unit: 'unit', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', organization_id: '1', code: 'PROD004', name: 'Producto 4', category: 'General', price: 45.60, cost: 35.00, stock: 40, min_stock: 8, unit: 'unit', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
]

export default function CorivaPOS() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeModule, setActiveModule] = useState('pos')
  
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchCode, setSearchCode] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'TARJETA' | 'YAPE' | 'PLIN' | 'TRANSFERENCIA'>('EFECTIVO')
  const [receiptType, setReceiptType] = useState<'BOLETA' | 'FACTURA' | 'TICKET'>('BOLETA')
  const [amountPaid, setAmountPaid] = useState('')

  // Initialize demo data
  useEffect(() => {
    const initData = async () => {
      const existingProducts = await productService.getAll()
      if (existingProducts.length === 0) {
        for (const product of INITIAL_PRODUCTS) {
          await productService.createProduct(product)
        }
      }
    }
    initData()
  }, [])

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
      loadSales()
    }
  }, [isAuthenticated])

  const loadProducts = async () => {
    const data = await productService.getAll()
    setProducts(data as Product[])
  }

  const loadSales = async () => {
    const data = await saleService.getAll()
    setSales(data as Sale[])
  }

  const handleOnboardingComplete = async (org: Organization, products: any[]) => {
    // Save organization
    localStorage.setItem('coriva_current_org', JSON.stringify(org))
    
    // Save products
    for (const product of products) {
      await productService.createProduct({ ...product, organization_id: org.id })
    }
    
    // Auto login
    const newUser: User = {
      id: `user_${Date.now()}`,
      organization_id: org.id,
      username: 'admin',
      email: org.email || '',
      full_name: 'Administrador',
      role: 'ADMIN',
      is_active: true,
      created_at: new Date().toISOString()
    }
    
    setCurrentUser(newUser)
    setCurrentOrg(org)
    setIsAuthenticated(true)
    setShowOnboarding(false)
    alert('🎉 ¡Bienvenido a Coriva Core!')
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    const demoUser = DEMO_USERS[username]
    if (demoUser && demoUser.password === password) {
      setCurrentUser(demoUser.user)
      setCurrentOrg(DEMO_ORGS[0])
      setIsAuthenticated(true)
    } else {
      setLoginError('Usuario o contraseña incorrectos')
    }
  }

  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchCode.trim()) {
      const results = await productService.searchIntelligent(searchCode)
      setSearchResults(results as Product[])
      
      if (results.length === 1) {
        addToCart(results[0] as Product)
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
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ))
      } else {
        setCart([...cart, { ...product, quantity: 1 }])
      }
    } else {
      alert(`Stock insuficiente. Disponible: ${product.stock}`)
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
        item.id === productId ? { ...item, quantity: newQty } : item
      ))
    } else {
      alert(`Stock insuficiente. Disponible: ${product?.stock}`)
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const opGravadas = subtotal / 1.18
  const tax = subtotal - opGravadas
  const total = subtotal
  const change = amountPaid ? Number(amountPaid) - total : 0

  const printReceipt = (sale: any) => {
    const receiptContent = `
================================
${currentOrg?.name.toUpperCase()}
================================
${currentOrg?.address || ''}
${currentOrg?.ruc ? `RUC: ${currentOrg.ruc}` : ''}
${currentOrg?.phone ? `Tel: ${currentOrg.phone}` : ''}
================================
${receiptType}: ${sale.sale_number}
Fecha: ${new Date().toLocaleString('es-PE')}
${customerName ? `Cliente: ${customerName}` : ''}

================================
CANT  DESCRIPCIÓN      PRECIO
================================
${cart.map(item => {
  const qty = item.quantity.toString().padEnd(4)
  const name = item.name.substring(0, 20).padEnd(20)
  const price = `${currentOrg?.settings.currency} ${(item.price * item.quantity).toFixed(2)}`.padStart(10)
  return `${qty} ${name} ${price}`
}).join('\n')}
================================
OP. GRAVADAS:       ${currentOrg?.settings.currency} ${opGravadas.toFixed(2)}
IGV (18%):          ${currentOrg?.settings.currency} ${tax.toFixed(2)}
TOTAL:              ${currentOrg?.settings.currency} ${total.toFixed(2)}
Pago: ${paymentMethod}${amountPaid ? `\nRecibido:           ${currentOrg?.settings.currency} ${Number(amountPaid).toFixed(2)}` : ''}${change > 0 ? `\nVuelto:             ${currentOrg?.settings.currency} ${change.toFixed(2)}` : ''}

================================
    ¡Gracias por su compra!
${currentOrg?.settings.receipt_footer || ''}
================================`

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Comprobante</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                padding: 10mm;
              }
              pre { white-space: pre-wrap; }
              @media print {
                @page { size: 80mm auto; margin: 0; }
              }
            </style>
          </head>
          <body>
            <pre>${receiptContent}</pre>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 1000);
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const processSale = async () => {
    if (cart.length === 0) {
      alert('Carrito vacío')
      return
    }

    if (paymentMethod === 'EFECTIVO' && (!amountPaid || Number(amountPaid) < total)) {
      alert('El monto recibido debe ser mayor o igual al total')
      return
    }

    const saleData = {
      organization_id: currentOrg!.id,
      customer_name: customerName || 'Cliente General',
      user_id: currentUser!.id,
      receipt_type: receiptType,
      subtotal: opGravadas,
      tax,
      discount: 0,
      total,
      payment_method: paymentMethod,
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }))
    }

    const newSale = await saleService.create(saleData)
    
    // Update stock
    for (const item of cart) {
      await productService.decreaseStock(item.id, item.quantity)
    }
    
    // Update cash session
    const currentSession = await cashService.getCurrentSession()
    if (currentSession) {
      await cashService.updateSession(currentSession.id, {
        total_sales: (currentSession.total_sales || 0) + total
      })
    }
    
    await loadProducts()
    await loadSales()
    
    // Print receipt
    printReceipt(newSale)
    
    alert(`✅ Venta exitosa!\n${newSale.sale_number}\nTotal: ${currentOrg?.settings.currency} ${total.toFixed(2)}${change > 0 ? `\nVuelto: ${currentOrg?.settings.currency} ${change.toFixed(2)}` : ''}`)
    
    setCart([])
    setCustomerName('')
    setSearchResults([])
    setAmountPaid('')
  }

  const updateProduct = async (updatedProduct: Product) => {
    await productService.updateProduct(updatedProduct)
    await loadProducts()
  }

  const deleteProduct = async (id: string) => {
    await productService.deleteProduct(id)
    await loadProducts()
  }

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    await productService.createProduct(newProduct)
    await loadProducts()
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (activeModule === 'pos') {
        if (e.key === 'F1') {
          e.preventDefault()
          setCart([])
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
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [cart, activeModule])

  if (showOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Coriva Core</h1>
            <p className="text-gray-600">Sistema POS Multi-Tenant</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="demo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="demo123"
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Demo: usuario <strong>demo</strong> / contraseña <strong>demo123</strong></p>
            <button
              onClick={() => setShowOnboarding(true)}
              className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
            >
              ¿Nuevo negocio? Regístrate aquí →
            </button>
          </div>
        </div>
      </div>
    )
  }

  const updateOrganization = (org: Organization) => {
    setCurrentOrg(org)
    localStorage.setItem('coriva_current_org', JSON.stringify(org))
  }

  // Render active module
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'cash':
        return <CashRegisterModule currentUser={currentUser} />
      case 'inventory':
        return (
          <InventoryModule 
            products={products}
            onUpdateProduct={updateProduct}
            onAddProduct={addProduct}
            onDeleteProduct={deleteProduct}
            currentUser={currentUser}
          />
        )
      case 'reports':
        return <ReportsModule sales={sales} currentUser={currentUser} />
      case 'customers':
        return <CustomersModule currentUser={currentUser} />
      case 'users':
        return <UsersModule currentUser={currentUser!} organizationId={currentOrg!.id} />
      case 'settings':
        return <SettingsModule currentOrg={currentOrg!} onUpdate={updateOrganization} />
      default:
        return renderPOSModule()
    }
  }

  const renderPOSModule = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          <div className="mb-6">
            <label className="block text-sm font-bold text-blue-700 mb-2">
              BÚSQUEDA DE PRODUCTOS
            </label>
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full p-3 text-lg border-2 border-blue-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="Código o nombre del producto"
              autoComplete="off"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-3 text-blue-700">Resultados:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      addToCart(product)
                      setSearchResults([])
                      setSearchCode('')
                    }}
                    className="p-3 border-2 border-blue-200 rounded cursor-pointer hover:bg-blue-50 bg-white"
                  >
                    <p className="font-bold text-sm">[{product.code}] {product.name}</p>
                    <p className="text-blue-600 font-bold text-lg">{currentOrg?.settings.currency} {product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-bold mb-3 text-blue-700">Productos Disponibles:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`p-3 border rounded cursor-pointer hover:bg-blue-50 ${
                    product.stock === 0 ? 'bg-red-50 opacity-50' : 'bg-white'
                  }`}
                >
                  <p className="font-bold text-sm">[{product.code}] {product.name}</p>
                  <p className="text-blue-600 font-bold">{currentOrg?.settings.currency} {product.price.toFixed(2)}</p>
                  <p className={`text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    Stock: {product.stock}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-50 to-purple-50 p-4 rounded border-2 border-blue-200">
          
          <div className="mb-4">
            <h3 className="font-bold mb-2 text-blue-700">CLIENTE</h3>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border border-blue-300 rounded focus:border-blue-500 focus:outline-none"
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2 text-blue-700">COMPROBANTE</h3>
            <select
              value={receiptType}
              onChange={(e) => setReceiptType(e.target.value as any)}
              className="w-full p-2 border border-blue-300 rounded focus:border-blue-500 focus:outline-none"
            >
              <option value="BOLETA">BOLETA</option>
              <option value="FACTURA">FACTURA</option>
              <option value="TICKET">TICKET</option>
            </select>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2 text-blue-700">CARRITO ({cart.length} items)</h3>
            <div className="max-h-60 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Carrito vacío</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2 p-2 bg-white rounded border border-blue-200">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-blue-600">{currentOrg?.settings.currency} {item.price.toFixed(2)} c/u</p>
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
            <div className="mb-4 p-3 bg-white rounded border border-blue-200">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{currentOrg?.settings.currency} {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>OP. Gravadas:</span>
                <span>{currentOrg?.settings.currency} {opGravadas.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>IGV (18%):</span>
                <span>{currentOrg?.settings.currency} {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 text-blue-700">
                <span>TOTAL:</span>
                <span>{currentOrg?.settings.currency} {total.toFixed(2)}</span>
              </div>
              
              {paymentMethod === 'EFECTIVO' && (
                <div className="mt-3 pt-3 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto Recibido:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                  {amountPaid && Number(amountPaid) >= total && (
                    <div className="mt-2 p-2 bg-green-50 rounded">
                      <div className="flex justify-between font-bold text-green-700">
                        <span>VUELTO:</span>
                        <span>{currentOrg?.settings.currency} {change.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  {amountPaid && Number(amountPaid) < total && (
                    <div className="mt-2 p-2 bg-red-50 rounded">
                      <div className="text-red-700 text-sm">
                        Falta: {currentOrg?.settings.currency} {(total - Number(amountPaid)).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <h3 className="font-bold mb-2 text-blue-700">PAGO</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full p-2 border border-blue-300 rounded focus:border-blue-500 focus:outline-none"
            >
              <option value="EFECTIVO">EFECTIVO</option>
              <option value="TARJETA">TARJETA</option>
              <option value="YAPE">YAPE</option>
              <option value="PLIN">PLIN</option>
              <option value="TRANSFERENCIA">TRANSFERENCIA</option>
            </select>
          </div>

          <div className="space-y-2">
            <button
              onClick={processSale}
              disabled={cart.length === 0 || (paymentMethod === 'EFECTIVO' && (!amountPaid || Number(amountPaid) < total))}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded font-bold hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 transition-all"
            >
              🖨️ PROCESAR VENTA (F2)
            </button>
            
            <button
              onClick={() => {
                setCart([])
                setCustomerName('')
                setSearchResults([])
                setAmountPaid('')
              }}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-2 rounded hover:from-red-700 hover:to-red-800 transition-all"
            >
              🗑️ LIMPIAR (F1)
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">🚀 {currentOrg?.name} - Coriva Core</h1>
              <p className="text-sm opacity-90">
                {activeModule === 'pos' ? 'F1: Nueva Venta | F2: Procesar | ESC: Limpiar' : 'Sistema Multi-Tenant SaaS'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">{currentUser?.full_name}</p>
              <p className="text-xs opacity-75">{currentUser?.role}</p>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded mt-1 hover:bg-opacity-30"
              >
                Cerrar Sesión
              </button>
            </div>
            <NotificationsPanel products={products} sales={sales} />
          </div>

          <div className="flex space-x-2">
            {canAccessModule(currentUser!.role, 'pos') && (
              <button
                onClick={() => setActiveModule('pos')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeModule === 'pos' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                💰 Punto de Venta
              </button>
            )}
            
            {canAccessModule(currentUser!.role, 'cash') && (
              <button
                onClick={() => setActiveModule('cash')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeModule === 'cash' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                💵 Caja
              </button>
            )}
            
            {canAccessModule(currentUser!.role, 'inventory') && (
              <button
                onClick={() => setActiveModule('inventory')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeModule === 'inventory' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                📦 Inventario
              </button>
            )}
            
            {canAccessModule(currentUser!.role, 'reports') && (
              <button
                onClick={() => setActiveModule('reports')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeModule === 'reports' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                📈 Reportes
              </button>
            )}
            
            {canAccessModule(currentUser!.role, 'customers') && (
              <button
                onClick={() => setActiveModule('customers')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeModule === 'customers' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                👥 Clientes
              </button>
            )}
            
            {canAccessModule(currentUser!.role, 'users') && (
              <button
                onClick={() => setActiveModule('users')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeModule === 'users' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                👤 Usuarios
              </button>
            )}
            
            {canAccessModule(currentUser!.role, 'settings') && (
              <button
                onClick={() => setActiveModule('settings')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeModule === 'settings' 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                ⚙️ Configuración
              </button>
            )}
          </div>
        </div>

        <div className="bg-white shadow-lg">
          {renderActiveModule()}
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/51962257626?text=Hola,%20necesito%20ayuda%20con%20Coriva%20Core"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110 z-50"
        title="Soporte por WhatsApp"
      >
        💬
      </a>
    </div>
  )
}
