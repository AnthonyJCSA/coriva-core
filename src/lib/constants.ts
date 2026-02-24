export const COPY = {
  hero: {
    eyebrow: "🚀 Más de 10,000 negocios ya confían en Coriva",
    headline: "Vende más, pierde menos.",
    subheadline: "Tu negocio en piloto automático.",
    description: "Coriva controla tu inventario, caja y ventas mientras tú te enfocas en crecer. Con IA que predice desabastecimientos y WhatsApp que cobra por ti.",
    ctaPrimary: "Empieza a vender en 60 segundos",
    ctaSecondary: "Ver demo en vivo",
    trust: ["Sin tarjeta de crédito", "Gratis por 30 días", "Soporte en español"]
  },
  benefits: {
    title: "Los problemas que resuelves desde hoy",
    items: [
      {
        icon: "🕐",
        title: "Ahorra 10 horas a la semana",
        description: "Ya no pierdas tiempo contando inventario o cerrando caja manualmente. Coriva lo hace por ti en segundos."
      },
      {
        icon: "💰",
        title: "Controla cada sol que entra y sale",
        description: "Sabe exactamente cuánto debes, cuánto te deben y cuánto tienes en caja. Sin sorpresas a fin de mes."
      },
      {
        icon: "📦",
        title: "Nunca más pierdas ventas por falta de stock",
        description: "La IA te avisa 3 días antes de que se acabe un producto. Tus clientes siempre encuentran lo que buscan."
      },
      {
        icon: "📊",
        title: "Toma decisiones con datos reales",
        description: "Reportes claros que te dicen qué vender más, qué eliminar y cuándo comprar. Sin Excel, sin complicaciones."
      }
    ]
  },
  socialProof: {
    title: "Negocios como el tuyo ya están creciendo con Coriva",
    testimonials: [
      {
        quote: "Antes perdía 2 horas diarias cerrando caja. Ahora Coriva lo hace en 30 segundos.",
        author: "María González",
        business: "Bodega El Ahorro",
        location: "Lima",
        avatar: "MG"
      },
      {
        quote: "La IA me avisó que se acababa mi producto estrella. Reabastecí a tiempo y vendí el doble.",
        author: "Carlos Ruiz",
        business: "Fashion Store",
        location: "Arequipa",
        avatar: "CR"
      },
      {
        quote: "WhatsApp cobra por mí. Mis clientes pagan más rápido y yo no persigo deudas.",
        author: "Ana Torres",
        business: "Salón Glamour",
        location: "Cusco",
        avatar: "AT"
      }
    ]
  },
  comparison: {
    title: "¿Por qué Coriva es la mejor opción?",
    features: [
      { name: "Velocidad de venta", coriva: "< 5 segundos", treinta: "~15 segundos", winner: true },
      { name: "IA predictiva (alertas de stock)", coriva: "✅ Sí", treinta: "❌ No", winner: true },
      { name: "Cobros automáticos por WhatsApp", coriva: "✅ Sí", treinta: "❌ No", winner: true },
      { name: "Escaneo de códigos de barras", coriva: "✅ Sí", treinta: "⚠️ Limitado", winner: true },
      { name: "Reportes con IA", coriva: "✅ Sí", treinta: "❌ No", winner: true },
      { name: "Control de caja en tiempo real", coriva: "✅ Sí", treinta: "⚠️ Básico", winner: true },
      { name: "Usuarios ilimitados", coriva: "✅ Gratis", treinta: "💰 De pago", winner: true },
      { name: "Multi-sucursal", coriva: "✅ Sí", treinta: "❌ No", winner: true }
    ],
    cta: "Prueba Coriva gratis por 30 días"
  },
  useCases: {
    title: "Diseñado para tu tipo de negocio",
    cases: [
      {
        icon: "🛒",
        title: "Bodega o Minimarket",
        description: "Controla 500+ productos, vende rápido y nunca te quedes sin stock.",
        link: "/casos-de-uso/bodega"
      },
      {
        icon: "👕",
        title: "Tienda de Ropa",
        description: "Gestiona tallas, colores y temporadas. Sabe qué se vende y qué no.",
        link: "/casos-de-uso/tienda-ropa"
      },
      {
        icon: "💇",
        title: "Salón de Belleza",
        description: "Agenda citas, vende productos y cobra servicios en un solo lugar.",
        link: "/casos-de-uso/salon-belleza"
      },
      {
        icon: "🍔",
        title: "Restaurante o Cafetería",
        description: "Toma pedidos rápido, controla ingredientes y cierra caja sin errores.",
        link: "/casos-de-uso/restaurante"
      }
    ]
  },
  pricing: {
    banner: "🔥 Oferta de lanzamiento: 50% OFF en tu primer año. Solo quedan 47 cupos.",
    plans: [
      {
        name: "Starter",
        price: 0,
        period: "mes",
        description: "Perfecto para empezar",
        features: [
          "1 usuario",
          "100 productos",
          "Hasta 100 ventas al mes",
          "Reportes básicos",
          "Soporte por email"
        ],
        cta: "Empezar gratis",
        popular: false
      },
      {
        name: "Pro",
        price: 49,
        originalPrice: 99,
        period: "mes",
        description: "El más popular",
        features: [
          "5 usuarios",
          "Productos ilimitados",
          "Dominio personalizado GRATIS el primer año",
          "IA predictiva",
          "Alerta de Stock",
          "Inventario Inteligente",
          "Reportes avanzados",
          "Soporte prioritario"
        ],
        cta: "Prueba 30 días gratis",
        popular: true
      },
      {
        name: "Premium",
        price: 149,
        period: "mes",
        description: "Para empresas",
        features: [
          "Usuarios ilimitados",
          "Multi-sucursal",
          "Dominio personalizado",
          "API personalizada",
          "Onboarding dedicado",
          "Soporte 24/7"
        ],
        cta: "Hablar con ventas",
        popular: false
      }
    ],
    guarantee: "💯 Garantía de 30 días. Si no te gusta, te devolvemos tu dinero."
  },
  faq: {
    title: "Preguntas frecuentes",
    questions: [
      {
        q: "¿Es realmente gratis?",
        a: "Sí. El plan Starter es 100% gratis para siempre. Sin trucos."
      },
      {
        q: "¿Necesito tarjeta de crédito para probar?",
        a: "No. Puedes usar Coriva gratis por 30 días sin ingresar ningún dato de pago."
      },
      {
        q: "¿Qué pasa si ya uso Treinta?",
        a: "Migramos tus datos en menos de 24 horas. Sin costo adicional."
      },
      {
        q: "¿Funciona sin internet?",
        a: "Sí. Coriva funciona offline y sincroniza cuando vuelve la conexión."
      },
      {
        q: "¿Puedo cancelar cuando quiera?",
        a: "Sí. Sin contratos, sin penalizaciones. Cancelas con un clic."
      },
      {
        q: "¿Cómo funciona la IA?",
        a: "La IA analiza tu historial de ventas y te avisa antes de que se acabe un producto."
      }
    ]
  },
  finalCTA: {
    headline: "Únete a los 10,000+ negocios que ya crecen con Coriva",
    subheadline: "Empieza gratis. Sin tarjeta. Sin compromiso.",
    ctaPrimary: "Crear mi cuenta gratis",
    ctaSecondary: "Ver demo en vivo",
    trust: ["Configuración en 60 segundos", "Soporte en español", "Cancela cuando quieras"]
  }
}
