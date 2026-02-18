'use client'

import { useState } from 'react'
import OnboardingWelcome from '@/components/OnboardingWelcome'
import OnboardingWizard from './OnboardingWizard'
import { Organization } from '@/types'

interface OnboardingFlowProps {
  onComplete: (org: Organization, products: any[], isDemo: boolean) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [stage, setStage] = useState<'welcome' | 'wizard' | 'demo'>('welcome')
  const [businessType, setBusinessType] = useState<string>()

  const handleDemo = () => {
    // Crear organización demo con datos precargados
    const demoOrg: Organization = {
      id: 'org_demo',
      slug: 'demo',
      name: 'Bodega Demo',
      business_type: 'retail',
      ruc: '20123456789',
      address: 'Av. Demo 123, Lima',
      phone: '999888777',
      email: 'demo@coriva.com',
      settings: { currency: 'S/', tax_rate: 0.18 },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const demoProducts = [
      { id: 'prod_1', code: 'COCA001', name: 'Coca Cola 1L', price: 5.50, stock: 48, min_stock: 10, category: 'Bebidas', unit: 'unit' },
      { id: 'prod_2', code: 'INCA001', name: 'Inca Kola 1L', price: 5.00, stock: 36, min_stock: 10, category: 'Bebidas', unit: 'unit' },
      { id: 'prod_3', code: 'AGUA001', name: 'Agua San Luis 625ml', price: 1.50, stock: 120, min_stock: 20, category: 'Bebidas', unit: 'unit' },
      { id: 'prod_4', code: 'PAN001', name: 'Pan Francés', price: 0.30, stock: 200, min_stock: 50, category: 'Panadería', unit: 'unit' },
      { id: 'prod_5', code: 'LECHE001', name: 'Leche Gloria 1L', price: 4.80, stock: 24, min_stock: 10, category: 'Lácteos', unit: 'unit' },
      { id: 'prod_6', code: 'ARROZ001', name: 'Arroz Costeño 1kg', price: 4.20, stock: 15, min_stock: 10, category: 'Abarrotes', unit: 'unit' },
      { id: 'prod_7', code: 'AZUC001', name: 'Azúcar Blanca 1kg', price: 3.50, stock: 8, min_stock: 10, category: 'Abarrotes', unit: 'unit' },
      { id: 'prod_8', code: 'ACEI001', name: 'Aceite Primor 1L', price: 9.90, stock: 12, min_stock: 5, category: 'Abarrotes', unit: 'unit' },
      { id: 'prod_9', code: 'GALL001', name: 'Galletas Soda Field', price: 2.50, stock: 45, min_stock: 15, category: 'Snacks', unit: 'unit' },
      { id: 'prod_10', code: 'CHOC001', name: 'Chocolate Sublime', price: 1.80, stock: 60, min_stock: 20, category: 'Snacks', unit: 'unit' }
    ]

    onComplete(demoOrg, demoProducts, true)
  }

  const handleWizardComplete = (org: Organization, products: any[]) => {
    onComplete(org, products, false)
  }

  if (stage === 'welcome') {
    return (
      <OnboardingWelcome
        onComplete={() => setStage('wizard')}
        onDemo={handleDemo}
      />
    )
  }

  if (stage === 'wizard') {
    return (
      <OnboardingWizard
        onComplete={handleWizardComplete}
        businessType={businessType}
      />
    )
  }

  return null
}
