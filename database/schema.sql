-- 💊 FarmaZi Database Schema
-- Sistema integral de farmacia

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 👥 USUARIOS Y ROLES
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role_id INTEGER REFERENCES roles(id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🏪 CONFIGURACIÓN DE FARMACIA
CREATE TABLE pharmacy_config (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ruc VARCHAR(20),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    logo_url VARCHAR(255),
    sunat_user VARCHAR(50),
    sunat_password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🏭 LABORATORIOS/FABRICANTES
CREATE TABLE laboratories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE,
    contact_info JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📦 CATEGORÍAS DE PRODUCTOS
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 💊 PRODUCTOS FARMACÉUTICOS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(50) UNIQUE,
    commercial_name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    active_ingredient TEXT,
    presentation VARCHAR(100), -- tabletas, jarabe, etc.
    concentration VARCHAR(50),
    laboratory_id INTEGER REFERENCES laboratories(id),
    category_id INTEGER REFERENCES categories(id),
    requires_prescription BOOLEAN DEFAULT false,
    is_controlled BOOLEAN DEFAULT false,
    unit_type VARCHAR(20) DEFAULT 'unit', -- unit, ml, gr
    sale_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER,
    description TEXT,
    contraindications TEXT,
    side_effects TEXT,
    storage_conditions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📦 LOTES DE PRODUCTOS
CREATE TABLE product_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    batch_number VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    manufacture_date DATE,
    quantity INTEGER NOT NULL DEFAULT 0,
    cost_price DECIMAL(10,2),
    supplier_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, batch_number)
);

-- 🏢 PROVEEDORES
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    ruc VARCHAR(20),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    payment_terms INTEGER DEFAULT 30, -- días
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 👥 CLIENTES
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type VARCHAR(10) DEFAULT 'DNI',
    document_number VARCHAR(20) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    birth_date DATE,
    gender VARCHAR(10),
    loyalty_points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🧾 VENTAS
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    user_id UUID REFERENCES users(id) NOT NULL,
    sale_type VARCHAR(20) DEFAULT 'BOLETA', -- BOLETA, FACTURA
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL, -- EFECTIVO, TARJETA, YAPE
    payment_reference VARCHAR(100),
    status VARCHAR(20) DEFAULT 'COMPLETED',
    sunat_status VARCHAR(20),
    sunat_response JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🧾 DETALLE DE VENTAS
CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    batch_id UUID REFERENCES product_batches(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🧑⚕️ RECETAS MÉDICAS
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    doctor_name VARCHAR(100),
    doctor_license VARCHAR(50),
    prescription_date DATE NOT NULL,
    image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, DISPENSED, EXPIRED
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 💊 MEDICAMENTOS EN RECETA
CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES prescriptions(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    dispensed_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📦 COMPRAS A PROVEEDORES
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_number VARCHAR(20) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    user_id UUID REFERENCES users(id),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, RECEIVED, CANCELLED
    due_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📦 DETALLE DE COMPRAS
CREATE TABLE purchase_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID REFERENCES purchases(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    batch_number VARCHAR(50),
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📊 MOVIMIENTOS DE INVENTARIO
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    batch_id UUID REFERENCES product_batches(id),
    movement_type VARCHAR(20) NOT NULL, -- IN, OUT, ADJUSTMENT
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(20), -- SALE, PURCHASE, ADJUSTMENT
    reference_id UUID,
    user_id UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔔 NOTIFICACIONES
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📊 ÍNDICES PARA OPTIMIZACIÓN
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_sales_date ON sales(created_at);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_batches_expiry ON product_batches(expiry_date);
CREATE INDEX idx_inventory_product ON inventory_movements(product_id);

-- 🎯 DATOS INICIALES
INSERT INTO roles (name, description, permissions) VALUES
('ADMIN', 'Administrador del sistema', '{"all": true}'),
('FARMACEUTICO', 'Químico farmacéutico', '{"prescriptions": true, "sales": true, "inventory": true}'),
('VENDEDOR', 'Vendedor de mostrador', '{"sales": true, "customers": true}'),
('CLIENTE', 'Cliente del sistema', '{"profile": true}');

INSERT INTO categories (name, description) VALUES
('ANALGÉSICOS', 'Medicamentos para el dolor'),
('ANTIBIÓTICOS', 'Medicamentos antimicrobianos'),
('VITAMINAS', 'Suplementos vitamínicos'),
('DERMATOLÓGICOS', 'Productos para la piel'),
('RESPIRATORIOS', 'Medicamentos para vías respiratorias'),
('DIGESTIVOS', 'Medicamentos para sistema digestivo');

-- 🔧 FUNCIONES ÚTILES
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();