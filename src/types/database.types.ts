// Database types — sincronizados con migration_v2_complete.sql

export interface DBProduct {
  id: string
  org_id: string
  code: string
  name: string
  category?: string
  price: number
  cost?: number
  stock: number
  min_stock?: number
  unit?: string
  description?: string
  brand?: string
  laboratory?: string
  active_ingredient?: string
  supplier?: string
  expiry_date?: string
  barcode?: string
  location?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface DBCustomer {
  id: string
  org_id: string
  name: string
  document_type?: string
  document_number?: string
  phone?: string
  email?: string
  address?: string
  birth_date?: string
  notes?: string
  total_purchases?: number
  total_spent?: number
  last_purchase_at?: string
  segment?: 'nuevo' | 'regular' | 'frecuente' | 'vip'
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface DBSale {
  id: string
  org_id: string
  sale_number: string
  customer_id?: string
  customer_name?: string
  receipt_type: string
  payment_method: string
  subtotal: number
  tax: number
  discount?: number
  total: number
  amount_paid?: number
  change_amount?: number
  status?: string
  notes?: string
  cancelled_at?: string
  cancelled_by?: string
  cancel_reason?: string
  created_at?: string
  created_by?: string
}

export interface DBSaleItem {
  id: string
  sale_id: string
  product_id?: string
  product_code?: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
  created_at?: string
}

export interface DBCashMovement {
  id: string
  org_id: string
  type: 'opening' | 'closing' | 'sale' | 'expense' | 'adjustment' | 'refund'
  amount: number
  balance?: number
  description?: string
  category?: string
  reference_id?: string
  created_at?: string
  created_by?: string
}

export interface DBInvoice {
  id: string
  org_id: string
  sale_id?: string
  invoice_number: string
  series: string
  correlative: number
  type: 'FACTURA' | 'BOLETA' | 'NOTA_CREDITO' | 'NOTA_DEBITO'
  client_name: string
  client_doc_type?: string
  client_doc?: string
  client_address?: string
  client_email?: string
  subtotal: number
  igv: number
  total: number
  currency?: string
  status: 'PENDIENTE' | 'EMITIDA' | 'ACEPTADA' | 'RECHAZADA' | 'ANULADA'
  sunat_status: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA'
  sunat_response?: Record<string, any>
  pdf_url?: string
  xml_url?: string
  credit_days?: number
  due_date?: string
  created_at?: string
  created_by?: string
}

export interface DBInvoiceCredit {
  id: string
  invoice_id: string
  org_id: string
  part: number
  amount: number
  due_date: string
  paid: boolean
  paid_at?: string
  paid_by?: string
  created_at?: string
}

export interface DBInvoiceSeries {
  id: string
  org_id: string
  type: string
  series: string
  last_number: number
  is_active: boolean
}

// RPC return types
export interface SalesDayRow {
  sale_date: string
  total_amount: number
  sale_count: number
}

export interface TopProductRow {
  product_id: string
  product_name: string
  total_qty: number
  total_revenue: number
}

export interface CashSummaryRow {
  opening_amount: number
  sales_amount: number
  expenses_amount: number
  refunds_amount: number
  current_balance: number
}

export interface ExpiringProductRow {
  id: string
  name: string
  expiry_date: string
  stock: number
  days_left: number
}
