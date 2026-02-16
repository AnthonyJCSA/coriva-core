// Local Storage Service for Demo (replaces AWS DynamoDB)

const STORAGE_KEYS = {
  PRODUCTS: 'coriva_products',
  SALES: 'coriva_sales',
  CASH_SESSIONS: 'coriva_cash_sessions',
  ORGANIZATIONS: 'coriva_organizations',
  USERS: 'coriva_users'
}

// Helper functions
const getFromStorage = (key: string) => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

const saveToStorage = (key: string, data: any) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

// Product Service
export const productService = {
  async getAll() {
    return getFromStorage(STORAGE_KEYS.PRODUCTS)
  },

  async getById(id: string) {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS)
    return products.find((p: any) => p.id === id)
  },

  async createProduct(product: any) {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS)
    const newProduct = {
      ...product,
      id: `prod_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    products.push(newProduct)
    saveToStorage(STORAGE_KEYS.PRODUCTS, products)
    return newProduct
  },

  async updateProduct(product: any) {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS)
    const index = products.findIndex((p: any) => p.id === product.id)
    if (index !== -1) {
      products[index] = { ...product, updated_at: new Date().toISOString() }
      saveToStorage(STORAGE_KEYS.PRODUCTS, products)
    }
    return product
  },

  async updateStock(productId: string, newStock: number) {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS)
    const index = products.findIndex((p: any) => p.id === productId)
    if (index !== -1) {
      products[index].stock = newStock
      products[index].updated_at = new Date().toISOString()
      saveToStorage(STORAGE_KEYS.PRODUCTS, products)
    }
  },

  async decreaseStock(productId: string, quantity: number) {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS)
    const index = products.findIndex((p: any) => p.id === productId)
    if (index !== -1) {
      products[index].stock = Math.max(0, products[index].stock - quantity)
      products[index].updated_at = new Date().toISOString()
      saveToStorage(STORAGE_KEYS.PRODUCTS, products)
    }
  },

  async deleteProduct(id: string) {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS)
    const filtered = products.filter((p: any) => p.id !== id)
    saveToStorage(STORAGE_KEYS.PRODUCTS, filtered)
  },

  async searchIntelligent(query: string) {
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS)
    const q = query.toLowerCase()
    return products.filter((p: any) => 
      p.code.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
  }
}

// Sale Service
export const saleService = {
  async getAll() {
    return getFromStorage(STORAGE_KEYS.SALES)
  },

  async getById(id: string) {
    const sales = getFromStorage(STORAGE_KEYS.SALES)
    return sales.find((s: any) => s.id === id)
  },

  async create(sale: any) {
    const sales = getFromStorage(STORAGE_KEYS.SALES)
    const count = sales.length + 1
    const newSale = {
      ...sale,
      id: `sale_${Date.now()}`,
      sale_number: `${sale.receipt_type || 'BOLETA'}-${String(count).padStart(4, '0')}`,
      status: 'COMPLETED',
      created_at: new Date().toISOString()
    }
    sales.unshift(newSale)
    saveToStorage(STORAGE_KEYS.SALES, sales)
    return newSale
  },

  async cancel(id: string, userId: string, userName: string, reason: string) {
    const sales = getFromStorage(STORAGE_KEYS.SALES)
    const index = sales.findIndex((s: any) => s.id === id)
    if (index !== -1) {
      sales[index].status = 'CANCELLED'
      sales[index].annulment_reason = reason
      sales[index].annulled_by = userName
      sales[index].annulled_at = new Date().toISOString()
      saveToStorage(STORAGE_KEYS.SALES, sales)
    }
  }
}

// Cash Service
export const cashService = {
  async getCurrentSession() {
    const sessions = getFromStorage(STORAGE_KEYS.CASH_SESSIONS)
    return sessions.find((s: any) => s.status === 'ABIERTA') || null
  },

  async create(session: any) {
    const sessions = getFromStorage(STORAGE_KEYS.CASH_SESSIONS)
    sessions.push(session)
    saveToStorage(STORAGE_KEYS.CASH_SESSIONS, sessions)
    return session
  },

  async updateSession(id: string, updates: any) {
    const sessions = getFromStorage(STORAGE_KEYS.CASH_SESSIONS)
    const index = sessions.findIndex((s: any) => s.id === id)
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates }
      saveToStorage(STORAGE_KEYS.CASH_SESSIONS, sessions)
    }
  },

  async addCancelledSale(sessionId: string, amount: number) {
    const sessions = getFromStorage(STORAGE_KEYS.CASH_SESSIONS)
    const index = sessions.findIndex((s: any) => s.id === sessionId)
    if (index !== -1) {
      sessions[index].total_cancelled = (sessions[index].total_cancelled || 0) + amount
      saveToStorage(STORAGE_KEYS.CASH_SESSIONS, sessions)
    }
  }
}

// Auth Service
export const authService = {
  async login(username: string, password: string) {
    const users = getFromStorage(STORAGE_KEYS.USERS)
    return users.find((u: any) => u.username === username && u.password === password)
  }
}
