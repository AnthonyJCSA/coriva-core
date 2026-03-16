-- ============================================================
-- Coriva Core — Migración: Tienda Virtual + IA
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ── PEDIDOS TIENDA VIRTUAL ──────────────────────────────────
CREATE TABLE IF NOT EXISTS corivacore_orders (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id      UUID REFERENCES corivacore_organizations(id) ON DELETE CASCADE,
    order_number VARCHAR(20) NOT NULL,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    channel     VARCHAR(20) DEFAULT 'whatsapp', -- whatsapp | web | manual
    status      VARCHAR(20) DEFAULT 'pending',  -- pending | confirmed | transit | delivered | cancelled
    subtotal    DECIMAL(10,2) DEFAULT 0,
    total       DECIMAL(10,2) NOT NULL,
    notes       TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(org_id, order_number)
);

-- ── ITEMS DE PEDIDOS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS corivacore_order_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id    UUID REFERENCES corivacore_orders(id) ON DELETE CASCADE,
    product_id  UUID REFERENCES corivacore_products(id),
    product_name VARCHAR(200),
    quantity    INTEGER NOT NULL,
    unit_price  DECIMAL(10,2) NOT NULL,
    subtotal    DECIMAL(10,2) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── CONFIGURACIÓN TIENDA VIRTUAL ────────────────────────────
CREATE TABLE IF NOT EXISTS corivacore_store_config (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID REFERENCES corivacore_organizations(id) ON DELETE CASCADE UNIQUE,
    store_name      VARCHAR(100),
    whatsapp_number VARCHAR(20),
    welcome_message TEXT,
    delivery_type   VARCHAR(50) DEFAULT 'pickup', -- pickup | delivery_2km | delivery_5km
    is_visible      BOOLEAN DEFAULT true,
    wa_orders       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── HISTORIAL ASISTENTE IA ──────────────────────────────────
CREATE TABLE IF NOT EXISTS corivacore_ai_logs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id      UUID REFERENCES corivacore_organizations(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES corivacore_users(id),
    prompt      TEXT NOT NULL,
    response    TEXT,
    tokens_used INTEGER DEFAULT 0,
    model       VARCHAR(50) DEFAULT 'gpt-4o-mini',
    context     JSONB DEFAULT '{}',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── CAMPAÑAS DE COMUNICACIÓN ────────────────────────────────
CREATE TABLE IF NOT EXISTS corivacore_campaigns (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id          UUID REFERENCES corivacore_organizations(id) ON DELETE CASCADE,
    channel         VARCHAR(20) NOT NULL, -- whatsapp | email
    template_type   VARCHAR(50),          -- promo | inactive | stock | catalog
    message         TEXT NOT NULL,
    subject         VARCHAR(200),         -- solo para email
    recipients_count INTEGER DEFAULT 0,
    sent_count      INTEGER DEFAULT 0,
    read_count      INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'sent',
    created_by      VARCHAR(100),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── ÍNDICES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_org      ON corivacore_orders(org_id);
CREATE INDEX IF NOT EXISTS idx_orders_status   ON corivacore_orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date     ON corivacore_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_logs_org     ON corivacore_ai_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_date    ON corivacore_ai_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_org   ON corivacore_campaigns(org_id);

-- ── FUNCIÓN: generar número de pedido ───────────────────────
CREATE OR REPLACE FUNCTION generate_order_number(p_org_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    v_count INTEGER;
    v_number VARCHAR(20);
BEGIN
    SELECT COUNT(*) + 1 INTO v_count
    FROM corivacore_orders
    WHERE org_id = p_org_id;

    v_number := 'W-' || LPAD(v_count::TEXT, 4, '0');
    RETURN v_number;
END;
$$ LANGUAGE plpgsql;

-- ── RLS (Row Level Security) ─────────────────────────────────
ALTER TABLE corivacore_orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE corivacore_order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE corivacore_store_config  ENABLE ROW LEVEL SECURITY;
ALTER TABLE corivacore_ai_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE corivacore_campaigns     ENABLE ROW LEVEL SECURITY;

-- Políticas: acceso solo a la propia organización
-- (ajustar según tu configuración de auth en Supabase)

-- ── DATOS INICIALES STORE CONFIG ────────────────────────────
-- Se crea automáticamente al registrar una organización
-- INSERT INTO corivacore_store_config (org_id, store_name) 
-- SELECT id, name FROM corivacore_organizations WHERE slug = 'tu-slug';
