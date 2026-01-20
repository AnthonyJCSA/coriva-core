-- BOTICAS BELLAFARMA Database Schema
-- Sistema FarmaZi POS

-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMINISTRADOR', 'FARMACEUTICO', 'VENDEDOR')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Products with brand/generic variants
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  active_ingredient VARCHAR(200),
  brand VARCHAR(100),
  is_generic BOOLEAN DEFAULT false,
  presentation VARCHAR(100),
  concentration VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  category VARCHAR(100),
  laboratory VARCHAR(100),
  requires_prescription BOOLEAN DEFAULT false,
  expiry_date DATE,
  batch_number VARCHAR(50),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type VARCHAR(20) DEFAULT 'DNI',
  document_number VARCHAR(20) UNIQUE,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  birth_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sales
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  user_id UUID REFERENCES users(id),
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'EFECTIVO',
  receipt_type VARCHAR(20) DEFAULT 'BOLETA',
  status VARCHAR(20) DEFAULT 'COMPLETED',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sale Items
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inventory Movements
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('IN', 'OUT', 'ADJUSTMENT')),
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50),
  reference_id UUID,
  notes TEXT,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert demo users
INSERT INTO users (username, password, name, email, role) VALUES
('admin', 'admin123', 'Administrador', 'admin@bellafarma.com', 'ADMINISTRADOR'),
('farmaceutico', 'farm123', 'Juan Pérez', 'farmaceutico@bellafarma.com', 'FARMACEUTICO'),
('vendedor', 'vend123', 'María García', 'vendedor@bellafarma.com', 'VENDEDOR');

-- Insert demo products with intelligent search capabilities
INSERT INTO products (code, name, active_ingredient, brand, is_generic, presentation, concentration, price, cost, stock, laboratory) VALUES
-- Amoxicilina variants
('AMX001', 'Amoxidal 500mg', 'Amoxicilina', 'Amoxidal', false, 'Cápsulas', '500mg', 25.50, 18.00, 50, 'Laboratorios AC Farma'),
('AMX002', 'Amoxicilina Genérica 500mg', 'Amoxicilina', 'Genérico', true, 'Cápsulas', '500mg', 15.80, 12.00, 80, 'Laboratorios Nacionales'),
('AMX003', 'Flemoxin Solutab 500mg', 'Amoxicilina', 'Flemoxin', false, 'Tabletas dispersables', '500mg', 35.90, 28.00, 30, 'Astellas Pharma'),

-- Paracetamol variants
('PAR001', 'Panadol 500mg', 'Paracetamol', 'Panadol', false, 'Tabletas', '500mg', 8.50, 6.00, 100, 'GSK'),
('PAR002', 'Paracetamol Genérico 500mg', 'Paracetamol', 'Genérico', true, 'Tabletas', '500mg', 4.20, 3.00, 150, 'Laboratorios Nacionales'),
('PAR003', 'Tylenol 500mg', 'Paracetamol', 'Tylenol', false, 'Cápsulas', '500mg', 12.80, 9.50, 75, 'Johnson & Johnson'),

-- Ibuprofeno variants
('IBU001', 'Advil 400mg', 'Ibuprofeno', 'Advil', false, 'Cápsulas', '400mg', 18.90, 14.00, 60, 'Pfizer'),
('IBU002', 'Ibuprofeno Genérico 400mg', 'Ibuprofeno', 'Genérico', true, 'Tabletas', '400mg', 9.50, 7.00, 90, 'Laboratorios Nacionales'),

-- Omeprazol variants
('OME001', 'Losec 20mg', 'Omeprazol', 'Losec', false, 'Cápsulas', '20mg', 45.60, 35.00, 40, 'AstraZeneca'),
('OME002', 'Omeprazol Genérico 20mg', 'Omeprazol', 'Genérico', true, 'Cápsulas', '20mg', 22.30, 16.00, 70, 'Laboratorios Nacionales');

-- Insert demo customer
INSERT INTO customers (document_number, name, phone, address) VALUES
('12345678', 'Cliente General', '987654321', 'Lima, Perú');

-- Views for reporting
CREATE OR REPLACE VIEW daily_sales AS
SELECT 
  DATE(created_at) as sale_date,
  COUNT(*) as total_sales,
  SUM(total) as total_amount,
  AVG(total) as average_sale
FROM sales 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

CREATE OR REPLACE VIEW top_products AS
SELECT 
  p.name,
  p.brand,
  p.active_ingredient,
  SUM(si.quantity) as total_sold,
  SUM(si.subtotal) as total_revenue
FROM products p
JOIN sale_items si ON p.id = si.product_id
JOIN sales s ON si.sale_id = s.id
WHERE s.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.id, p.name, p.brand, p.active_ingredient
ORDER BY total_sold DESC
LIMIT 10;

CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
  code,
  name,
  brand,
  stock,
  min_stock,
  (stock - min_stock) as stock_difference
FROM products 
WHERE stock <= min_stock AND active = true
ORDER BY stock_difference ASC;

-- Function for intelligent product search
CREATE OR REPLACE FUNCTION search_products_intelligent(search_term TEXT)
RETURNS TABLE (
  id UUID,
  code VARCHAR,
  name VARCHAR,
  active_ingredient VARCHAR,
  brand VARCHAR,
  is_generic BOOLEAN,
  price DECIMAL,
  stock INTEGER,
  match_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.code,
    p.name,
    p.active_ingredient,
    p.brand,
    p.is_generic,
    p.price,
    p.stock,
    CASE 
      WHEN LOWER(p.code) = LOWER(search_term) THEN 100
      WHEN LOWER(p.name) LIKE LOWER('%' || search_term || '%') THEN 90
      WHEN LOWER(p.active_ingredient) LIKE LOWER('%' || search_term || '%') THEN 80
      WHEN LOWER(p.brand) LIKE LOWER('%' || search_term || '%') THEN 70
      ELSE 0
    END as match_score
  FROM products p
  WHERE p.active = true
    AND (
      LOWER(p.code) LIKE LOWER('%' || search_term || '%') OR
      LOWER(p.name) LIKE LOWER('%' || search_term || '%') OR
      LOWER(p.active_ingredient) LIKE LOWER('%' || search_term || '%') OR
      LOWER(p.brand) LIKE LOWER('%' || search_term || '%')
    )
  ORDER BY match_score DESC, p.is_generic ASC, p.price ASC;
END;
$$ LANGUAGE plpgsql;