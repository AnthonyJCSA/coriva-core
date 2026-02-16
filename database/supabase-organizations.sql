-- Tabla de organizaciones para Supabase
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  business_type TEXT NOT NULL,
  ruc TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{"currency": "S/", "tax_rate": 0.18}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_is_active ON organizations(is_active);

-- RLS (Row Level Security)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Política: Permitir inserción pública (para registro)
CREATE POLICY "Allow public insert" ON organizations
  FOR INSERT
  WITH CHECK (true);

-- Política: Permitir lectura pública (para demo)
CREATE POLICY "Allow public read" ON organizations
  FOR SELECT
  USING (true);
