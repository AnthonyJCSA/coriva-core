export type Locale = 'es' | 'en'
export type Currency = 'PEN' | 'USD' | 'MXN' | 'COP' | 'CLP' | 'ARS' | 'BRL' | 'EUR'

export const LOCALES = {
  es: {
    hero: {
      eyebrow: "🚀 Más de 10,000 negocios ya confían en Coriva",
      headline: "Vende más, pierde menos.",
      subheadline: "Tu negocio en piloto automático.",
      description: "Coriva controla tu inventario, caja y ventas mientras tú te enfocas en crecer. Con IA que predice desabastecimientos y WhatsApp que cobra por ti.",
      ctaPrimary: "Empieza a vender en 60 segundos",
      ctaSecondary: "Ver demo en vivo",
      trust: ["Sin tarjeta de crédito", "Gratis por 30 días", "Soporte en español"]
    },
    pricing: {
      title: "Precios simples y transparentes",
      subtitle: "Elige el plan perfecto para tu negocio",
      monthly: "mes",
      yearly: "año",
      save: "Ahorra",
      guarantee: "💯 Garantía de 30 días. Si no te gusta, te devolvemos tu dinero.",
      popular: "🔥 Más Popular",
      starter: { name: "Starter", desc: "Perfecto para empezar" },
      pro: { name: "Pro", desc: "El más popular" },
      premium: { name: "Premium", desc: "Para empresas" },
      cta: { free: "Empezar gratis", trial: "Prueba 30 días gratis", sales: "Hablar con ventas" }
    },
    common: {
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      search: "Buscar..."
    }
  },
  en: {
    hero: {
      eyebrow: "🚀 10,000+ businesses trust Coriva",
      headline: "Sell more, lose less.",
      subheadline: "Your business on autopilot.",
      description: "Coriva manages your inventory, cash, and sales while you focus on growth. AI predicts stockouts. WhatsApp collects payments for you.",
      ctaPrimary: "Start selling in 60 seconds",
      ctaSecondary: "Watch live demo",
      trust: ["No credit card", "Free for 30 days", "24/7 support"]
    },
    pricing: {
      title: "Simple, transparent pricing",
      subtitle: "Choose the perfect plan for your business",
      monthly: "month",
      yearly: "year",
      save: "Save",
      guarantee: "💯 30-day money-back guarantee. No questions asked.",
      popular: "🔥 Most Popular",
      starter: { name: "Starter", desc: "Perfect to get started" },
      pro: { name: "Pro", desc: "Most popular" },
      premium: { name: "Premium", desc: "For enterprises" },
      cta: { free: "Start free", trial: "Try 30 days free", sales: "Talk to sales" }
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      search: "Search..."
    }
  }
}

export const CURRENCIES = {
  PEN: { symbol: 'S/', name: 'Soles Peruanos', country: 'PE', flag: '🇵🇪' },
  USD: { symbol: '$', name: 'US Dollars', country: 'US', flag: '🇺🇸' },
  MXN: { symbol: '$', name: 'Pesos Mexicanos', country: 'MX', flag: '🇲🇽' },
  COP: { symbol: '$', name: 'Pesos Colombianos', country: 'CO', flag: '🇨🇴' },
  CLP: { symbol: '$', name: 'Pesos Chilenos', country: 'CL', flag: '🇨🇱' },
  ARS: { symbol: '$', name: 'Pesos Argentinos', country: 'AR', flag: '🇦🇷' },
  BRL: { symbol: 'R$', name: 'Reais Brasileños', country: 'BR', flag: '🇧🇷' },
  EUR: { symbol: '€', name: 'Euros', country: 'EU', flag: '🇪🇺' }
}

export const PRICING_BY_CURRENCY = {
  PEN: { starter: 0, pro: 49, premium: 149, proYearly: 470, premiumYearly: 1430 },
  USD: { starter: 0, pro: 13, premium: 39, proYearly: 125, premiumYearly: 375 },
  MXN: { starter: 0, pro: 249, premium: 749, proYearly: 2390, premiumYearly: 7190 },
  COP: { starter: 0, pro: 49000, premium: 149000, proYearly: 470000, premiumYearly: 1430000 },
  CLP: { starter: 0, pro: 11900, premium: 35900, proYearly: 114240, premiumYearly: 344640 },
  ARS: { starter: 0, pro: 12900, premium: 38900, proYearly: 123840, premiumYearly: 373440 },
  BRL: { starter: 0, pro: 69, premium: 209, proYearly: 662, premiumYearly: 2006 },
  EUR: { starter: 0, pro: 12, premium: 36, proYearly: 115, premiumYearly: 346 }
}

export function detectUserLocale(): Locale {
  if (typeof window === 'undefined') return 'es'
  const lang = navigator.language.split('-')[0]
  return lang === 'en' ? 'en' : 'es'
}

export function detectUserCurrency(): Currency {
  if (typeof window === 'undefined') return 'PEN'
  const locale = navigator.language
  const countryMap: Record<string, Currency> = {
    'es-PE': 'PEN', 'es-MX': 'MXN', 'es-CO': 'COP', 'es-CL': 'CLP',
    'es-AR': 'ARS', 'pt-BR': 'BRL', 'en-US': 'USD', 'en-GB': 'EUR'
  }
  return countryMap[locale] || 'USD'
}

export function formatPrice(amount: number, currency: Currency): string {
  const curr = CURRENCIES[currency]
  return `${curr.symbol}${amount.toLocaleString()}`
}
