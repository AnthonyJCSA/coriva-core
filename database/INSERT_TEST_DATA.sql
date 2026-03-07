-- ============================================
-- INSERTAR DATOS DE PRUEBA PARA org_1772836382137
-- Ejecutar DESPUÉS de SETUP_SUPABASE.sql
-- ============================================

-- Productos de prueba
INSERT INTO corivacore_products (org_id, code, name, category, price, cost, stock, min_stock, unit) VALUES
('org_1772836382137', 'PROD001', 'Paracetamol 500mg', 'Medicamentos', 5.50, 3.00, 100, 20, 'unidad'),
('org_1772836382137', 'PROD002', 'Ibuprofeno 400mg', 'Medicamentos', 8.00, 5.00, 80, 15, 'unidad'),
('org_1772836382137', 'PROD003', 'Alcohol 70%', 'Higiene', 12.00, 8.00, 50, 10, 'unidad'),
('org_1772836382137', 'PROD004', 'Mascarilla KN95', 'Protección', 3.50, 2.00, 200, 50, 'unidad'),
('org_1772836382137', 'PROD005', 'Vitamina C 1000mg', 'Suplementos', 25.00, 18.00, 60, 15, 'unidad'),
('org_1772836382137', 'PROD006', 'Termómetro Digital', 'Equipos', 45.00, 30.00, 30, 5, 'unidad'),
('org_1772836382137', 'PROD007', 'Guantes Látex (Caja)', 'Protección', 35.00, 25.00, 40, 10, 'caja'),
('org_1772836382137', 'PROD008', 'Jarabe para la Tos', 'Medicamentos', 18.50, 12.00, 45, 10, 'unidad'),
('org_1772836382137', 'PROD009', 'Curitas (Paquete)', 'Primeros Auxilios', 6.00, 4.00, 150, 30, 'paquete'),
('org_1772836382137', 'PROD010', 'Gel Antibacterial 500ml', 'Higiene', 15.00, 10.00, 70, 20, 'unidad')
ON CONFLICT (org_id, code) DO NOTHING;

-- Clientes de prueba
INSERT INTO corivacore_customers (org_id, name, document_type, document_number, phone, email) VALUES
('org_1772836382137', 'Cliente General', 'DNI', '00000000', '999999999', 'general@coriva.com'),
('org_1772836382137', 'María García', 'DNI', '12345678', '987654321', 'maria@email.com'),
('org_1772836382137', 'Juan Pérez', 'DNI', '87654321', '912345678', 'juan@email.com'),
('org_1772836382137', 'Empresa ABC SAC', 'RUC', '20123456789', '945678901', 'contacto@abc.com')
ON CONFLICT DO NOTHING;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Datos de prueba insertados para org_1772836382137';
  RAISE NOTICE '📦 10 productos agregados';
  RAISE NOTICE '👥 4 clientes agregados';
  RAISE NOTICE '👤 Usuario demo: demo / demo123';
END $$;
