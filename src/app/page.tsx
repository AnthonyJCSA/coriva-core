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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Coriva Core</h1>
            <p className="text-blue-200 text-lg">Sistema POS Multi-Tenant</p>
          </div>

          {/* Login card */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Ingresa tu usuario"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Ingresa tu contraseña"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium text-red-800">{loginError}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Iniciar Sesión</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Credenciales de Demo
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-lg">
                  <p className="text-gray-500">Usuario</p>
                  <p className="font-mono font-bold text-gray-900">demo</p>
                </div>
                <div className="bg-white p-2 rounded-lg">
                  <p className="text-gray-500">Contraseña</p>
                  <p className="font-mono font-bold text-gray-900">demo123</p>
                </div>
              </div>
            </div>

            {/* Register link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowOnboarding(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center space-x-1 group"
              >
                <span>¿Nuevo negocio? Regístrate aquí</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-blue-200">
            <p>© 2025 Coriva Core. Sistema POS profesional.</p>
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
