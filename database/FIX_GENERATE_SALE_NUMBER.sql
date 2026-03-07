-- ============================================
-- RECREAR FUNCIÓN generate_sale_number CON TIPO TEXT
-- ============================================

DROP FUNCTION IF EXISTS generate_sale_number(TEXT);
DROP FUNCTION IF EXISTS generate_sale_number(UUID);

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

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Función generate_sale_number recreada con tipo TEXT';
END $$;
