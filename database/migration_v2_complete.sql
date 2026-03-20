-- ============================================================
-- CORIVA CORE — MIGRATION V2
-- Ejecutar en Supabase SQL Editor
-- Agrega campos faltantes, índices, triggers y funciones
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. PRODUCTOS — campos farmacia y metadata extendida
-- ─────────────────────────────────────────────────────────────
ALTER TABLE corivacore_products
  ADD COLUMN IF NOT EXISTS description    TEXT,
  ADD COLUMN IF NOT EXISTS unit           VARCHAR(50)  DEFAULT 'unidad',
  ADD COLUMN IF NOT EXISTS brand          VARCHAR(100),
  ADD COLUMN IF NOT EXISTS laboratory     VARCHAR(100),
  ADD COLUMN IF NOT EXISTS active_ingredient VARCHAR(255),
  ADD COLUMN IF NOT EXISTS supplier       VARCHAR(150),
  ADD COLUMN IF NOT EXISTS expiry_date    DATE,
  ADD COLUMN IF NOT EXISTS barcode        VARCHAR(100),
  ADD COLUMN IF NOT EXISTS location       VARCHAR(100); -- pasillo/estante

CREATE INDEX IF NOT EXISTS idx_corivacore_products_barcode
  ON corivacore_products(barcode) WHERE barcode IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_corivacore_products_expiry
  ON corivacore_products(expiry_date) WHERE expiry_date IS NOT NULL;

-- ─────────────────────────────────────────────────────────────
-- 2. VENTAS — vincular cliente real + campos faltantes
-- ─────────────────────────────────────────────────────────────
ALTER TABLE corivacore_sales
  ADD COLUMN IF NOT EXISTS customer_id    TEXT,
  ADD COLUMN IF NOT EXISTS discount       DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes          TEXT,
  ADD COLUMN IF NOT EXISTS cancelled_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancelled_by   VARCHAR(255),
  ADD COLUMN IF NOT EXISTS cancel_reason  TEXT;

CREATE INDEX IF NOT EXISTS idx_corivacore_sales_customer
  ON corivacore_sales(customer_id) WHERE customer_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────
-- 3. CLIENTES — campos para CRM real
-- ─────────────────────────────────────────────────────────────
ALTER TABLE corivacore_customers
  ADD COLUMN IF NOT EXISTS total_purchases  INTEGER      DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_spent      DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_purchase_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS segment          VARCHAR(20)  DEFAULT 'nuevo',
  ADD COLUMN IF NOT EXISTS notes            TEXT,
  ADD COLUMN IF NOT EXISTS birth_date       DATE;

-- ─────────────────────────────────────────────────────────────
-- 4. MOVIMIENTOS DE CAJA — tipo egreso
-- ─────────────────────────────────────────────────────────────
-- El campo type ya existe, solo documentamos los valores válidos:
-- 'opening' | 'closing' | 'sale' | 'expense' | 'adjustment' | 'refund'

ALTER TABLE corivacore_cash_movements
  ADD COLUMN IF NOT EXISTS category VARCHAR(50); -- 'insumos','servicios','personal', etc.

-- ─────────────────────────────────────────────────────────────
-- 5. TABLA: COMPROBANTES (Facturación)
-- Vincula ventas con comprobantes electrónicos
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS corivacore_invoices (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          TEXT        NOT NULL,
  sale_id         UUID,                          -- venta origen (puede ser null si es manual)
  invoice_number  VARCHAR(20) NOT NULL,          -- F001-00001 / B001-00001
  series          VARCHAR(10) NOT NULL,          -- F001 / B001
  correlative     INTEGER     NOT NULL,
  type            VARCHAR(20) NOT NULL,          -- FACTURA | BOLETA | NOTA_CREDITO | NOTA_DEBITO
  client_name     VARCHAR(255) NOT NULL,
  client_doc_type VARCHAR(10),                   -- RUC | DNI | CE
  client_doc      VARCHAR(20),
  client_address  TEXT,
  client_email    VARCHAR(255),
  subtotal        DECIMAL(10,2) NOT NULL DEFAULT 0,
  igv             DECIMAL(10,2) NOT NULL DEFAULT 0,
  total           DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency        VARCHAR(5)   DEFAULT 'PEN',
  status          VARCHAR(20)  DEFAULT 'PENDIENTE', -- PENDIENTE | EMITIDA | ACEPTADA | RECHAZADA | ANULADA
  sunat_status    VARCHAR(20)  DEFAULT 'PENDIENTE',
  sunat_response  JSONB,                         -- respuesta CDR de SUNAT/OSE
  pdf_url         TEXT,
  xml_url         TEXT,
  credit_days     INTEGER      DEFAULT 0,        -- 0 = contado
  due_date        DATE,
  created_at      TIMESTAMPTZ  DEFAULT NOW(),
  created_by      VARCHAR(255),
  CONSTRAINT corivacore_invoices_org_series_corr UNIQUE(org_id, series, correlative)
);

CREATE INDEX IF NOT EXISTS idx_corivacore_invoices_org    ON corivacore_invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_corivacore_invoices_sale   ON corivacore_invoices(sale_id);
CREATE INDEX IF NOT EXISTS idx_corivacore_invoices_status ON corivacore_invoices(status);

ALTER TABLE corivacore_invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for invoices" ON corivacore_invoices;
CREATE POLICY "Enable all for invoices" ON corivacore_invoices FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────
-- 6. TABLA: CUOTAS DE CRÉDITO
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS corivacore_invoice_credits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id  UUID        NOT NULL REFERENCES corivacore_invoices(id) ON DELETE CASCADE,
  org_id      TEXT        NOT NULL,
  part        INTEGER     NOT NULL,              -- número de cuota
  amount      DECIMAL(10,2) NOT NULL,
  due_date    DATE        NOT NULL,
  paid        BOOLEAN     DEFAULT false,
  paid_at     TIMESTAMPTZ,
  paid_by     VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_corivacore_credits_invoice ON corivacore_invoice_credits(invoice_id);
CREATE INDEX IF NOT EXISTS idx_corivacore_credits_org     ON corivacore_invoice_credits(org_id);
CREATE INDEX IF NOT EXISTS idx_corivacore_credits_due     ON corivacore_invoice_credits(due_date) WHERE paid = false;

ALTER TABLE corivacore_invoice_credits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for invoice_credits" ON corivacore_invoice_credits;
CREATE POLICY "Enable all for invoice_credits" ON corivacore_invoice_credits FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────
-- 7. TABLA: SERIES DE COMPROBANTES por organización
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS corivacore_invoice_series (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      TEXT        NOT NULL,
  type        VARCHAR(20) NOT NULL,              -- FACTURA | BOLETA | NOTA_CREDITO
  series      VARCHAR(10) NOT NULL,              -- F001 | B001
  last_number INTEGER     DEFAULT 0,
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT corivacore_series_unique UNIQUE(org_id, series)
);

ALTER TABLE corivacore_invoice_series ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for invoice_series" ON corivacore_invoice_series;
CREATE POLICY "Enable all for invoice_series" ON corivacore_invoice_series FOR ALL USING (true);

-- Insertar series por defecto al crear organización (se llama manualmente o via trigger)
-- INSERT INTO corivacore_invoice_series (org_id, type, series) VALUES
--   ('ORG_ID', 'FACTURA', 'F001'),
--   ('ORG_ID', 'BOLETA',  'B001'),
--   ('ORG_ID', 'NOTA_CREDITO', 'FC01');

-- ─────────────────────────────────────────────────────────────
-- 8. FUNCIÓN: Generar número de comprobante correlativo
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_invoice_number(p_org_id TEXT, p_series VARCHAR)
RETURNS TABLE(invoice_number VARCHAR, correlative INTEGER) AS $$
DECLARE
  v_next INTEGER;
BEGIN
  UPDATE corivacore_invoice_series
  SET last_number = last_number + 1
  WHERE org_id = p_org_id AND series = p_series
  RETURNING last_number INTO v_next;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Serie % no encontrada para org %', p_series, p_org_id;
  END IF;

  RETURN QUERY SELECT
    (p_series || '-' || LPAD(v_next::TEXT, 8, '0'))::VARCHAR,
    v_next;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- 9. FUNCIÓN: Actualizar estadísticas del cliente tras una venta
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_customer_stats(p_customer_id TEXT, p_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE corivacore_customers
  SET
    total_purchases  = total_purchases + 1,
    total_spent      = total_spent + p_amount,
    last_purchase_at = NOW(),
    segment = CASE
      WHEN total_spent + p_amount >= 500 THEN 'vip'
      WHEN total_purchases + 1 >= 5      THEN 'frecuente'
      WHEN total_purchases + 1 = 1       THEN 'nuevo'
      ELSE 'regular'
    END,
    updated_at = NOW()
  WHERE id = p_customer_id;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- 10. TRIGGER: Al crear una venta, actualizar stats del cliente
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_sale_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_id IS NOT NULL AND NEW.status = 'completed' THEN
    PERFORM update_customer_stats(NEW.customer_id, NEW.total);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sale_customer_stats ON corivacore_sales;
CREATE TRIGGER trg_sale_customer_stats
  AFTER INSERT ON corivacore_sales
  FOR EACH ROW EXECUTE FUNCTION trigger_sale_customer_stats();

-- ─────────────────────────────────────────────────────────────
-- 11. TRIGGER: Al anular una venta, revertir stock
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_sale_cancel_revert_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo actuar cuando cambia de 'completed' a 'cancelled'
  IF OLD.status = 'completed' AND NEW.status = 'cancelled' THEN
    UPDATE corivacore_products p
    SET stock = p.stock + si.quantity,
        updated_at = NOW()
    FROM corivacore_sale_items si
    WHERE si.sale_id = NEW.id
      AND si.product_id::TEXT = p.id::TEXT;

    -- Revertir stats del cliente
    IF NEW.customer_id IS NOT NULL THEN
      UPDATE corivacore_customers
      SET
        total_purchases = GREATEST(0, total_purchases - 1),
        total_spent     = GREATEST(0, total_spent - NEW.total),
        updated_at      = NOW()
      WHERE id = NEW.customer_id;
    END IF;

    -- Registrar movimiento de caja como reembolso
    INSERT INTO corivacore_cash_movements
      (org_id, type, amount, description, reference_id, created_by)
    VALUES
      (NEW.org_id, 'refund', -NEW.total, 'Anulación venta ' || NEW.sale_number, NEW.id, NEW.cancelled_by);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sale_cancel ON corivacore_sales;
CREATE TRIGGER trg_sale_cancel
  AFTER UPDATE ON corivacore_sales
  FOR EACH ROW EXECUTE FUNCTION trigger_sale_cancel_revert_stock();

-- ─────────────────────────────────────────────────────────────
-- 12. FUNCIÓN: Dashboard — ventas por día (últimos 7 días)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_sales_last_7_days(p_org_id TEXT)
RETURNS TABLE(sale_date DATE, total_amount DECIMAL, sale_count INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(created_at)          AS sale_date,
    COALESCE(SUM(total), 0)   AS total_amount,
    COUNT(*)::INTEGER         AS sale_count
  FROM corivacore_sales
  WHERE org_id = p_org_id
    AND status = 'completed'
    AND created_at >= NOW() - INTERVAL '7 days'
  GROUP BY DATE(created_at)
  ORDER BY sale_date ASC;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- 13. FUNCIÓN: Top productos más vendidos
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_top_products(p_org_id TEXT, p_limit INTEGER DEFAULT 5)
RETURNS TABLE(
  product_id   TEXT,
  product_name VARCHAR,
  total_qty    BIGINT,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    si.product_id::TEXT,
    si.product_name,
    SUM(si.quantity)              AS total_qty,
    SUM(si.subtotal)              AS total_revenue
  FROM corivacore_sale_items si
  JOIN corivacore_sales s ON s.id = si.sale_id
  WHERE s.org_id = p_org_id
    AND s.status = 'completed'
    AND s.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY si.product_id, si.product_name
  ORDER BY total_qty DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- 14. FUNCIÓN: Resumen de caja del día
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_cash_summary(p_org_id TEXT)
RETURNS TABLE(
  opening_amount  DECIMAL,
  sales_amount    DECIMAL,
  expenses_amount DECIMAL,
  refunds_amount  DECIMAL,
  current_balance DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN type = 'opening'    THEN amount ELSE 0 END), 0) AS opening_amount,
    COALESCE(SUM(CASE WHEN type = 'sale'       THEN amount ELSE 0 END), 0) AS sales_amount,
    COALESCE(SUM(CASE WHEN type = 'expense'    THEN amount ELSE 0 END), 0) AS expenses_amount,
    COALESCE(SUM(CASE WHEN type = 'refund'     THEN ABS(amount) ELSE 0 END), 0) AS refunds_amount,
    COALESCE(SUM(CASE
      WHEN type IN ('opening', 'sale')  THEN amount
      WHEN type IN ('expense', 'refund') THEN -ABS(amount)
      ELSE 0
    END), 0) AS current_balance
  FROM corivacore_cash_movements
  WHERE org_id = p_org_id
    AND DATE(created_at) = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- 15. FUNCIÓN: Productos próximos a vencer (farmacia)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_expiring_products(p_org_id TEXT, p_days INTEGER DEFAULT 30)
RETURNS TABLE(
  id           UUID,
  name         VARCHAR,
  expiry_date  DATE,
  stock        INTEGER,
  days_left    INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.expiry_date,
    p.stock,
    (p.expiry_date - CURRENT_DATE)::INTEGER AS days_left
  FROM corivacore_products p
  WHERE p.org_id = p_org_id
    AND p.expiry_date IS NOT NULL
    AND p.expiry_date <= CURRENT_DATE + p_days
    AND p.is_active = true
    AND p.stock > 0
  ORDER BY p.expiry_date ASC;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- 16. TRIGGER: Crear series de comprobantes al registrar org
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_create_default_series()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO corivacore_invoice_series (org_id, type, series) VALUES
    (NEW.id, 'FACTURA',      'F001'),
    (NEW.id, 'BOLETA',       'B001'),
    (NEW.id, 'NOTA_CREDITO', 'FC01')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_org_default_series ON corivacore_organizations;
CREATE TRIGGER trg_org_default_series
  AFTER INSERT ON corivacore_organizations
  FOR EACH ROW EXECUTE FUNCTION trigger_create_default_series();

-- ─────────────────────────────────────────────────────────────
-- 17. ÍNDICES adicionales para performance
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_corivacore_sales_status
  ON corivacore_sales(org_id, status);

CREATE INDEX IF NOT EXISTS idx_corivacore_customers_segment
  ON corivacore_customers(org_id, segment);

CREATE INDEX IF NOT EXISTS idx_corivacore_customers_last_purchase
  ON corivacore_customers(last_purchase_at DESC) WHERE last_purchase_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_corivacore_products_low_stock
  ON corivacore_products(org_id, stock, min_stock) WHERE is_active = true;

-- ─────────────────────────────────────────────────────────────
-- 18. VISTA: Ventas con cliente y comprobante
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW corivacore_sales_full AS
SELECT
  s.*,
  c.name          AS customer_full_name,
  c.document_type AS customer_doc_type,
  c.document_number AS customer_doc_number,
  c.phone         AS customer_phone,
  i.invoice_number,
  i.sunat_status  AS invoice_sunat_status
FROM corivacore_sales s
LEFT JOIN corivacore_customers c ON c.id::TEXT = s.customer_id
LEFT JOIN corivacore_invoices  i ON i.sale_id  = s.id;

-- ─────────────────────────────────────────────────────────────
-- FIN DEL SCRIPT
-- ─────────────────────────────────────────────────────────────
