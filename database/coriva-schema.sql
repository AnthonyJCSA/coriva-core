-- 🚀 Coriva Core Database Schema
-- Sistema POS Multi-Tenant SaaS

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 🏢 ORGANIZACIONES (TENANTS)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    business_type VARCHAR(50), -- pharmacy, hardware, clothing, barbershop, etc.
    ruc VARCHAR(20),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    logo_url VARCHAR(255),
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 👥 USUARIOS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'VENDEDOR', -- ADMIN, MANAGER, VENDEDOR
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, username)
);

-- 📦 PRODUCTOS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'unit',
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, code)
);

-- 👥 CLIENTES
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    document_type VARCHAR(10) DEFAULT 'DNI',
    document_number VARCHAR(20),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, document_number)
);

-- 🧾 VENTAS
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    sale_number VARCHAR(20) NOT NULL,
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(100),
    user_id UUID REFERENCES users(id),
    receipt_type VARCHAR(20) DEFAULT 'BOLETA',
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, sale_number)
);

-- 🧾 DETALLE DE VENTAS
CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📊 MOVIMIENTOS DE INVENTARIO
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    movement_type VARCHAR(20) NOT NULL, -- IN, OUT, ADJUSTMENT
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(20),
    reference_id UUID,
    user_id UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📊 ÍNDICES
CREATE INDEX idx_products_org ON products(organization_id);
CREATE INDEX idx_sales_org ON sales(organization_id);
CREATE INDEX idx_sales_date ON sales(created_at);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_customers_org ON customers(organization_id);

-- 🎯 DATOS DEMO
INSERT INTO organizations (name, slug, business_type) VALUES
('Demo Store', 'demo-store', 'retail'),
('Farmacia Demo', 'farmacia-demo', 'pharmacy'),
('Ferretería Demo', 'ferreteria-demo', 'hardware');

-- Usuario demo (password: demo123)
INSERT INTO users (organization_id, username, email, password_hash, full_name, role) 
SELECT id, 'demo', 'demo@coriva.com', '$2a$10$demo', 'Usuario Demo', 'ADMIN'
FROM organizations WHERE slug = 'demo-store';
