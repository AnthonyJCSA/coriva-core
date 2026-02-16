'use client'

import { useState, useEffect } from 'react'
import InventoryModule from './InventoryModule'
import ReportsModule from './ReportsModule'
import CashRegisterModule from './CashRegisterModule'
import { productService, authService, saleService } from '../lib/bellafarma-dynamo'

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
  expiry_date?: string
}

interface CartItem extends Product {
  quantity: number
}

interface Sale {
  id: string
  sale_number: string
  total: number
  created_at: string
  customer_name?: string
  payment_method: string
  items_count: number
}

// Mock data para BOTICAS BELLAFARMA
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', code: 'AMX001', name: 'Amoxidal 500mg', active_ingredient: 'Amoxicilina', brand: 'Amoxidal', is_generic: false, price: 25.50, cost: 18.00, stock: 50, min_stock: 10, category: 'Antibióticos', laboratory: 'AC Farma' },
  { id: '2', code: 'AMX002', name: 'Amoxicilina Genérica 500mg', active_ingredient: 'Amoxicilina', brand: 'Genérico', is_generic: true, price: 15.80, cost: 12.00, stock: 80, min_stock: 15, category: 'Antibióticos', laboratory: 'Nacionales' },
  { id: '3', code: 'PAR001', name: 'Panadol 500mg', active_ingredient: 'Paracetamol', brand: 'Panadol', is_generic: false, price: 8.50, cost: 6.00, stock: 100, min_stock: 20, category: 'Analgésicos', laboratory: 'GSK' },
  { id: '4', code: 'PAR002', name: 'Paracetamol Genérico 500mg', active_ingredient: 'Paracetamol', brand: 'Genérico', is_generic: true, price: 4.20, cost: 3.00, stock: 150, min_stock: 25, category: 'Analgésicos', laboratory: 'Nacionales' },
  { id: '5', code: 'IBU001', name: 'Advil 400mg', active_ingredient: 'Ibuprofeno', brand: 'Advil', is_generic: false, price: 18.90, cost: 14.00, stock: 60, min_stock: 12, category: 'Antiinflamatorios', laboratory: 'Pfizer' },
  { id: '6', code: 'IBU002', name: 'Ibuprofeno Genérico 400mg', active_ingredient: 'Ibuprofeno', brand: 'Genérico', is_generic: true, price: 9.50, cost: 7.00, stock: 90, min_stock: 18, category: 'Antiinflamatorios', laboratory: 'Nacionales' },
  { id: '7', code: 'OME001', name: 'Losec 20mg', active_ingredient: 'Omeprazol', brand: 'Losec', is_generic: false, price: 45.60, cost: 35.00, stock: 40, min_stock: 8, category: 'Digestivos', laboratory: 'AstraZeneca' },
  { id: '8', code: 'OME002', name: 'Omeprazol Genérico 20mg', active_ingredient: 'Omeprazol', brand: 'Genérico', is_generic: true, price: 22.30, cost: 16.00, stock: 70, min_stock: 14, category: 'Digestivos', laboratory: 'Nacionales' }
]

const USERS = {
  admin: { password: 'admin123', name: 'Administrador', role: 'ADMINISTRADOR' },
  farmaceutico: { password: 'farm123', name: 'Juan Pérez', role: 'FARMACEUTICO' },
  vendedor: { password: 'vend123', name: 'María García', role: 'VENDEDOR' }
}

// Función para obtener fecha/hora de Perú
const getPeruDateTime = () => {
  const now = new Date()
  // Perú es UTC-5 (sin horario de verano)
  const peruTime = new Date(now.getTime() - (5 * 60 * 60 * 1000))
  return peruTime
}

// Función para formatear fecha en zona horaria de Perú
const formatPeruDate = (dateString: string) => {
  const utcDate = new Date(dateString)
  const peruDate = new Date(utcDate.getTime() - (5 * 60 * 60 * 1000))
  return peruDate
}

export default function FarmaciaPOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeModule, setActiveModule] = useState('pos')
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [sales, setSales] = useState<Sale[]>([])
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchCode, setSearchCode] = useState('')
  const [customerDoc, setCustomerDoc] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO')
  const [receiptType, setReceiptType] = useState('BOLETA')
  const [amountPaid, setAmountPaid] = useState('')
  const [showChange, setShowChange] = useState(false)

  // Cargar productos y ventas al iniciar
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
      loadSales()
    }
  }, [isAuthenticated])

  const loadProducts = async () => {
    try {
      const data = await productService.getAll()
      setProducts(data as Product[])
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts(INITIAL_PRODUCTS)
    }
  }

  const loadSales = async () => {
    try {
      const data = await saleService.getAll()
      setSales(data as Sale[])
    } catch (error) {
      console.error('Error loading sales:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      // Intentar login con Supabase
      const user = await authService.login(username, password)
      if (user) {
        setCurrentUser({ username, name: user.name, role: user.role })
        setIsAuthenticated(true)
        return
      }
    } catch (error) {
      console.log('Supabase login failed, using demo users')
    }
    
    // Fallback a usuarios demo
    const demoUser = USERS[username as keyof typeof USERS]
    if (demoUser && demoUser.password === password) {
      setCurrentUser({ username, ...demoUser })
      setIsAuthenticated(true)
    } else {
      setLoginError('Usuario o contraseña incorrectos')
    }
  }

  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchCode.trim()) {
      try {
        const results = await productService.searchIntelligent(searchCode)
        setSearchResults(results as Product[])
        
        if (results.length === 1) {
          addToCart(results[0] as Product)
          setSearchCode('')
          setSearchResults([])
        }
      } catch (error) {
        console.error('Search error:', error)
        // Fallback a búsqueda local
        const localResults = products.filter(p => 
          p.code.toLowerCase().includes(searchCode.toLowerCase()) ||
          p.name.toLowerCase().includes(searchCode.toLowerCase()) ||
          p.active_ingredient?.toLowerCase().includes(searchCode.toLowerCase())
        )
        setSearchResults(localResults)
      }
    }
  }

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id)
    const currentQty = existing ? existing.quantity : 0
    const availableStock = Number(product.stock)
    
    console.log('Add to cart debug:', { productId: product.id, availableStock, currentQty, productStock: product.stock })
    
    if (currentQty < availableStock) {
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
      alert(`Stock insuficiente. Disponible: ${availableStock}`)
    }
  }

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item.id !== productId))
      return
    }
    
    // Buscar en productos actuales Y en el carrito
    const product = products.find(p => p.id === productId)
    const cartItem = cart.find(item => item.id === productId)
    
    // Usar el stock más actualizado
    const availableStock = Number(product?.stock || cartItem?.stock || 0)
    
    console.log('Debug stock:', { productId, availableStock, newQty, product: product?.stock, cartItem: cartItem?.stock })
    
    if (availableStock > 0 && newQty <= availableStock) {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQty }
          : item
      ))
    } else {
      alert(`Stock insuficiente. Disponible: ${availableStock}`)
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const opGravadas = subtotal / 1.18
  const tax = subtotal - opGravadas
  const total = subtotal
  const change = amountPaid ? Number(amountPaid) - total : 0

  const processSale = async () => {
    if (cart.length === 0) {
      alert('Carrito vacío')
      return
    }

    try {
      // Mostrar indicador de carga
      const loadingAlert = document.createElement('div')
      loadingAlert.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); 
                    z-index: 9999; text-align: center;">
          <div style="font-size: 18px; margin-bottom: 10px;">🔄 Procesando venta...</div>
          <div style="font-size: 14px; color: #666;">Guardando en AWS DynamoDB</div>
        </div>
      `
      document.body.appendChild(loadingAlert)

      // Crear nueva venta en DynamoDB
      const saleData = {
        customer_id: undefined,
        customer_name: customerName.trim() || undefined, // Solo enviar si hay nombre
        user_id: currentUser?.id,
        receipt_type: receiptType,
        subtotal,
        tax,
        discount: 0,
        total,
        payment_method: paymentMethod,
        items: cart.map(item => {
          const currentProduct = products.find(p => p.id === item.id);
          return {
            product_id: item.id,
            quantity: Number(item.quantity),
            unit_price: Number(item.price),
            subtotal: Number(item.price) * Number(item.quantity),
            current_stock: Number(currentProduct?.stock || 0)
          };
        })
      }

      const sale = await saleService.create(saleData)
      
      // Actualizar stock usando decreaseStock para mejor tracking
      for (const item of cart) {
        await productService.decreaseStock(item.id, Number(item.quantity), 'Venta POS');
      }
      
      // Recargar productos desde DynamoDB
      await loadProducts()

      // Crear objeto de venta
      const newSale: Sale = {
        id: sale.id,
        sale_number: sale.sale_number,
        total,
        created_at: sale.created_at,
        customer_name: customerName || 'Cliente General',
        payment_method: paymentMethod,
        items_count: cart.reduce((sum, item) => sum + item.quantity, 0)
      }

      // Agregar venta a la lista local y recargar desde DB
      setSales([newSale, ...sales])
      await loadSales()

      // Remover indicador de carga
      document.body.removeChild(loadingAlert)

      // Mostrar éxito
      const successAlert = document.createElement('div')
      successAlert.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: #10B981; color: white; padding: 20px; border-radius: 10px; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 9999; text-align: center;">
          <div style="font-size: 20px; margin-bottom: 10px;">✅ ¡Venta Exitosa!</div>
          <div style="font-size: 16px; margin-bottom: 5px;">Boleta: ${sale.sale_number}</div>
          <div style="font-size: 16px; margin-bottom: 10px;">Total: S/ ${total.toFixed(2)}</div>
          <div style="font-size: 12px;">💾 Guardado en AWS DynamoDB</div>
        </div>
      `
      document.body.appendChild(successAlert)
      
      // Auto-cerrar después de 3 segundos
      setTimeout(() => {
        if (document.body.contains(successAlert)) {
          document.body.removeChild(successAlert)
        }
      }, 3000)

      const receipt = generateReceipt(newSale)
      printReceipt(receipt)
      
      setCart([])
      setCustomerDoc('')
      setCustomerName('')
      setSearchResults([])
      setAmountPaid('')
      setShowChange(false)
      
    } catch (error) {
      console.error('Sale error:', error)
      
      // Remover loading si existe
      const loadingAlert = document.querySelector('div[style*="Procesando venta"]')?.parentElement
      if (loadingAlert) document.body.removeChild(loadingAlert)
      
      // Mostrar error
      const errorAlert = document.createElement('div')
      errorAlert.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: #EF4444; color: white; padding: 20px; border-radius: 10px; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 9999; text-align: center;">
          <div style="font-size: 18px; margin-bottom: 10px;">❌ Error en la venta</div>
          <div style="font-size: 14px;">No se pudo guardar en AWS DynamoDB</div>
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="margin-top: 10px; padding: 5px 15px; background: white; color: #EF4444; 
                         border: none; border-radius: 5px; cursor: pointer;">Cerrar</button>
        </div>
      `
      document.body.appendChild(errorAlert)
    }
  }

  const generateReceipt = (sale: Sale) => {
    const peruDate = formatPeruDate(sale.created_at)
    const date = peruDate.toLocaleDateString('es-PE')
    const time = peruDate.toLocaleTimeString('es-PE')
    
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
${receiptType}: ${sale.sale_number}
Fecha: ${date} ${time}
${customerName ? `Cliente: ${customerName}` : ''}
${customerDoc ? `DNI: ${customerDoc}` : ''}

================================
CANT  DESCRIPCIÓN      PRECIO
================================
${cart.map(item => {
  const qty = item.quantity.toString().padEnd(4)
  const name = item.name.substring(0, 20).padEnd(20)
  const price = `S/ ${item.price.toFixed(3)}`.padStart(10)
  return `${qty} ${name} ${price}`
}).join('\n')}
================================
Subtotal:           S/ ${subtotal.toFixed(3)}
OP. GRAVADAS:       S/ ${opGravadas.toFixed(3)}
IGV (18%):          S/ ${tax.toFixed(3)}
TOTAL:              S/ ${total.toFixed(3)}
Pago: ${paymentMethod}${amountPaid ? `\nRecibido:           S/ ${Number(amountPaid).toFixed(3)}` : ''}${change > 0 ? `\nVuelto:             S/ ${change.toFixed(3)}` : ''}

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
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Ticket</title>
            <style>
              * {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box;
              }
              
              html {
                width: 80mm;
                height: auto;
              }
              
              body {
                width: 80mm;
                height: auto;
                font-family: 'Courier New', monospace;
                font-size: 9px;
                line-height: 1.1;
                color: #000;
                background: #fff;
                text-align: center;
              }
              
              .receipt {
                width: 80mm;
                height: auto;
                padding: 2mm;
                white-space: pre-wrap;
                word-wrap: break-word;
                text-align: center;
                display: inline-block;
              }
              
              @media print {
                html, body {
                  width: 80mm !important;
                  height: auto !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                
                .receipt {
                  width: 80mm !important;
                  height: auto !important;
                  margin: 0 auto !important;
                  padding-left: 0 !important;
                  padding-right: 0 !important;
                  box-sizing: border-box;
                }
                
                @page {
                  size: 80mm auto;
                  margin: 0;
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="receipt">${receipt}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      
      setTimeout(() => {
        printWindow.print()
        setTimeout(() => printWindow.close(), 1000)
      }, 500)
    }
  }

  const updateProduct = async (updatedProduct: Product) => {
    try {
      await productService.updateProduct(updatedProduct, currentUser?.id, currentUser?.name)
      await loadProducts()
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await productService.deleteProduct(id, currentUser?.id, currentUser?.name)
      await loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const product = await productService.createProduct(newProduct)
      // Recargar productos desde DynamoDB inmediatamente
      await loadProducts()
      console.log('Product added, products reloaded:', products.length)
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  // Generar ventas demo
  useEffect(() => {
    const demoSales: Sale[] = [
      { id: '1', sale_number: 'BOLETA-001', total: 34.20, created_at: new Date().toISOString(), customer_name: 'Ana García', payment_method: 'EFECTIVO', items_count: 2 },
      { id: '2', sale_number: 'BOLETA-002', total: 15.80, created_at: new Date(Date.now() - 3600000).toISOString(), customer_name: 'Carlos López', payment_method: 'YAPE', items_count: 1 },
      { id: '3', sale_number: 'FACTURA-001', total: 89.40, created_at: new Date(Date.now() - 7200000).toISOString(), customer_name: 'Farmacia San Juan', payment_method: 'TARJETA', items_count: 4 }
    ]
    setSales(demoSales)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (activeModule === 'pos') {
        if (e.key === 'F1') {
          e.preventDefault()
          setCart([])
          setCustomerDoc('')
          setCustomerName('')
          setSearchResults([])
          setAmountPaid('')
          setShowChange(false)
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

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Av. Perú N°3699, Cdra. 36, S.M.P.</p>
            <p>RUC: 10473232583 | Tel: 962257626</p>
            <p className="font-medium text-green-600">Atención 24 horas</p>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar módulo activo
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
      default:
        return renderPOSModule()
    }
  }

  const renderPOSModule = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-green-700">
                BÚSQUEDA INTELIGENTE (Código, Nombre o Principio Activo)
              </label>
              <button
                onClick={loadProducts}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                🔄 Recargar Productos
              </button>
            </div>
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
                        <p className="text-green-600 font-bold text-lg">S/ {product.price.toFixed(3)}</p>
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
              {products.slice(0, 8).map((product) => (
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
                      <p className="text-green-600 font-bold">S/ {product.price.toFixed(3)}</p>
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
                      <p className="text-xs text-green-600">S/ {item.price.toFixed(3)} c/u</p>
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
                <span>S/ {subtotal.toFixed(3)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>OP. Gravadas:</span>
                <span>S/ {opGravadas.toFixed(3)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>IGV (18%):</span>
                <span>S/ {tax.toFixed(3)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 text-green-700">
                <span>TOTAL:</span>
                <span>S/ {total.toFixed(3)}</span>
              </div>
              
              {/* Campo para monto pagado */}
              {paymentMethod === 'EFECTIVO' && (
                <div className="mt-3 pt-3 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto Recibido:</label>
                  <input
                    type="number"
                    step="0.001"
                    value={amountPaid}
                    onChange={(e) => {
                      setAmountPaid(e.target.value)
                      setShowChange(e.target.value !== '')
                    }}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    placeholder="0.000"
                  />
                  {showChange && amountPaid && Number(amountPaid) >= total && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <div className="flex justify-between font-bold text-blue-700">
                        <span>VUELTO:</span>
                        <span>S/ {change.toFixed(3)}</span>
                      </div>
                    </div>
                  )}
                  {showChange && amountPaid && Number(amountPaid) < total && (
                    <div className="mt-2 p-2 bg-red-50 rounded">
                      <div className="text-red-700 text-sm">
                        Falta: S/ {(total - Number(amountPaid)).toFixed(3)}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              disabled={cart.length === 0 || (paymentMethod === 'EFECTIVO' && (!amountPaid || Number(amountPaid) < total))}
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
                setAmountPaid('')
                setShowChange(false)
              }}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-2 rounded hover:from-red-700 hover:to-red-800 transition-all"
            >
              🗑️ LIMPIAR (F1)
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('printer-configured')
                alert('Configuración de impresora reiniciada. La próxima venta mostrará el diálogo de impresión.')
              }}
              className="w-full bg-gray-500 text-white p-1 rounded text-sm hover:bg-gray-600 transition-all"
            >
              ⚙️ Reconfigurar Impresora
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header con navegación */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">💊 BOTICAS BELLAFARMA - FarmaZi</h1>
              <p className="text-sm opacity-90">
                {activeModule === 'pos' ? 'F1: Nueva Venta | F2: Procesar | ESC: Limpiar' : 'Sistema Integral de Farmacia'}
              </p>
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

          {/* Navegación por módulos */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveModule('pos')}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                activeModule === 'pos' 
                  ? 'bg-white text-green-600' 
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
            >
              💰 Punto de Venta
            </button>
            
            {(currentUser?.role === 'ADMINISTRADOR' || currentUser?.role === 'FARMACEUTICO') && (
              <button
                onClick={() => setActiveModule('cash')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeModule === 'cash' 
                    ? 'bg-white text-green-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                💵 Caja
              </button>
            )}
            
            {(currentUser?.role === 'ADMINISTRADOR' || currentUser?.role === 'FARMACEUTICO') && (
              <button
                onClick={() => setActiveModule('inventory')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeModule === 'inventory' 
                    ? 'bg-white text-green-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                📦 Inventario
              </button>
            )}
            
            {(currentUser?.role === 'ADMINISTRADOR' || currentUser?.role === 'FARMACEUTICO') && (
              <button
                onClick={() => setActiveModule('reports')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeModule === 'reports' 
                    ? 'bg-white text-green-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                📈 Reportes
              </button>
            )}
          </div>
        </div>

        {/* Contenido del módulo activo */}
        <div className="bg-white shadow-lg">
          {renderActiveModule()}
        </div>
      </div>
    </div>
  )
}