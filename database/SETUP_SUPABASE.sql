-- ============================================
-- CORIVA CORE - SETUP COMPLETO SUPABASE
-- Ejecutar en: Supabase SQL Editor
-- ============================================

-- 0. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS corivacore_organizations (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  business_type VARCHAR(50),
  ruc VARCHAR(20),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  logo_url TEXT,
  settings JSONB DEFAULT '{"currency": "S/", "tax_rate": 0.18}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_corivacore_organizations_slug ON corivacore_organizations(slug);

-- 0.1 USERS TABLE
CREATE TABLE IF NOT EXISTS corivacore_users (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES corivacore_organizations(id),
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255),
  full_name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'ADMIN',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_corivacore_users_org_id ON corivacore_users(org_id);
CREATE INDEX IF NOT EXISTS idx_corivacore_users_username ON corivacore_users(username);

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS corivacore_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER DEFAULT 10,
  unit VARCHAR(50) DEFAULT 'unit',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT corivacore_products_org_code_unique UNIQUE(org_id, code)
);

CREATE INDEX IF NOT EXISTS idx_corivacore_products_org_id ON corivacore_products(org_id);
CREATE INDEX IF NOT EXISTS idx_corivacore_products_org_active ON corivacore_products(org_id, is_active);

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS corivacore_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  document_type VARCHAR(20),
  document_number VARCHAR(50),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_corivacore_customers_org_id ON corivacore_customers(org_id);

-- 3. SALES TABLE
CREATE TABLE IF NOT EXISTS corivacore_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  sale_number VARCHAR(50) NOT NULL,
  customer_id UUID,
  customer_name VARCHAR(255),
  receipt_type VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(10,2),
  change_amount DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255),
  
  CONSTRAINT corivacore_sales_org_number_unique UNIQUE(org_id, sale_number)
);

CREATE INDEX IF NOT EXISTS idx_corivacore_sales_org_id ON corivacore_sales(org_id);
CREATE INDEX IF NOT EXISTS idx_corivacore_sales_org_date ON corivacore_sales(org_id, created_at DESC);

-- 4. SALE_ITEMS TABLE
CREATE TABLE IF NOT EXISTS corivacore_sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL,
  product_id TEXT,
  product_code VARCHAR(50),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_corivacore_sale_items_sale_id ON corivacore_sale_items(sale_id);

-- 5. CASH_MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS corivacore_cash_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  balance DECIMAL(10,2),
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_corivacore_cash_movements_org_id ON corivacore_cash_movements(org_id);
CREATE INDEX IF NOT EXISTS idx_corivacore_cash_movements_org_date ON corivacore_cash_movements(org_id, created_at DESC);

-- TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_corivacore_products_updated_at ON corivacore_products;
CREATE TRIGGER update_corivacore_products_updated_at
  BEFORE UPDATE ON corivacore_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_corivacore_customers_updated_at ON corivacore_customers;
CREATE TRIGGER update_corivacore_customers_updated_at
  BEFORE UPDATE ON corivacore_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_corivacore_organizations_updated_at ON corivacore_organizations;
CREATE TRIGGER update_corivacore_organizations_updated_at
  BEFORE UPDATE ON corivacore_organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_corivacore_users_updated_at ON corivacore_users;
CREATE TRIGGER update_corivacore_users_updated_at
  BEFORE UPDATE ON corivacore_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Deshabilitado para desarrollo)
ALTER TABLE corivacore_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE corivacore_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE corivacore_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE corivacore_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE corivacore_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE corivacore_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE corivacore_cash_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for organizations" ON corivacore_organizations;
CREATE POLICY "Enable all for organizations" ON corivacore_organizations FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for users" ON corivacore_users;
CREATE POLICY "Enable all for users" ON corivacore_users FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for products" ON corivacore_products;
CREATE POLICY "Enable all for products" ON corivacore_products FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for customers" ON corivacore_customers;
CREATE POLICY "Enable all for customers" ON corivacore_customers FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for sales" ON corivacore_sales;
CREATE POLICY "Enable all for sales" ON corivacore_sales FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for sale_items" ON corivacore_sale_items;
CREATE POLICY "Enable all for sale_items" ON corivacore_sale_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for cash_movements" ON corivacore_cash_movements;
CREATE POLICY "Enable all for cash_movements" ON corivacore_cash_movements FOR ALL USING (true);

-- FUNCIÓN PARA GENERAR NÚMERO DE VENTA
CREATE OR REPLACE FUNCTION generate_sale_number(p_org_id TEXT)
RETURNS VARCHAR AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM corivacore_sales
  WHERE org_id = p_org_id
    AND DATE(created_at) = CURRENT_DATE;
  
  RETURN 'V-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD((v_count + 1)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- FUNCIÓN PARA DECREMENTAR STOCK
CREATE OR REPLACE FUNCTION decrement_product_stock(p_product_id TEXT, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE corivacore_products
  SET stock = stock - p_quantity,
      updated_at = NOW()
  WHERE id::TEXT = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- DATOS DE PRUEBA (Usuario demo para org_1772836382137)
INSERT INTO corivacore_users (id, org_id, username, password_hash, email, full_name, role)
VALUES ('user_demo', 'org_1772836382137', 'demo', 'demo123', 'demo@coriva.com', 'Usuario Demo', 'ADMIN')
ON CONFLICT (username) DO NOTHING;
