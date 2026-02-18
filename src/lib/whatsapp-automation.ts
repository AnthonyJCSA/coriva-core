// Sistema de WhatsApp Automático para Cobros y Recordatorios
// Genera mensajes automáticos y URLs de WhatsApp

interface Customer {
  id: string
  name: string
  phone: string
  debt: number
}

interface Sale {
  id: string
  customer_id: string
  total: number
  paid: number
  date: string
}

export class WhatsAppAutomation {
  private whatsappNumber: string

  constructor(businessWhatsApp: string = '51913916967') {
    this.whatsappNumber = businessWhatsApp
  }

  // Genera URL de WhatsApp con mensaje precargado
  private generateWhatsAppURL(phone: string, message: string): string {
    const cleanPhone = phone.replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }

  // Recordatorio de deuda
  generateDebtReminder(customer: Customer, businessName: string): {
    url: string
    message: string
  } {
    const message = `Hola ${customer.name} 👋

Te recordamos que tienes una deuda pendiente de S/ ${customer.debt.toFixed(2)} con ${businessName}.

¿Podrías realizar el pago hoy? 

Puedes pagar por:
💳 Transferencia
💵 Efectivo en tienda
📱 Yape/Plin

¡Gracias por tu preferencia! 😊`

    return {
      url: this.generateWhatsAppURL(customer.phone, message),
      message
    }
  }

  // Confirmación de pago recibido
  generatePaymentConfirmation(customer: Customer, amount: number, businessName: string): {
    url: string
    message: string
  } {
    const message = `¡Hola ${customer.name}! ✅

Confirmamos que recibimos tu pago de S/ ${amount.toFixed(2)}.

${customer.debt > 0 
  ? `Deuda restante: S/ ${customer.debt.toFixed(2)}`
  : '¡Tu cuenta está al día! 🎉'
}

Gracias por tu pago puntual.

Atentamente,
${businessName}`

    return {
      url: this.generateWhatsAppURL(customer.phone, message),
      message
    }
  }

  // Alerta de stock bajo (para proveedor)
  generateStockAlert(productName: string, currentStock: number, supplierPhone: string): {
    url: string
    message: string
  } {
    const message = `Hola 👋

Necesitamos reabastecer urgente:

📦 Producto: ${productName}
📊 Stock actual: ${currentStock} unidades
⚠️ Nivel crítico

¿Cuándo podrías enviarnos más stock?

Gracias`

    return {
      url: this.generateWhatsAppURL(supplierPhone, message),
      message
    }
  }

  // Promoción/Oferta
  generatePromotion(customer: Customer, promotion: string, businessName: string): {
    url: string
    message: string
  } {
    const message = `¡Hola ${customer.name}! 🎉

Tenemos una oferta especial para ti:

${promotion}

Válido solo hoy. ¡No te lo pierdas!

${businessName}
📍 [Tu dirección]
📞 [Tu teléfono]`

    return {
      url: this.generateWhatsAppURL(customer.phone, message),
      message
    }
  }

  // Recordatorio de venta pendiente
  generateSaleReminder(customer: Customer, sale: Sale, businessName: string): {
    url: string
    message: string
  } {
    const pending = sale.total - sale.paid
    const daysAgo = Math.floor((Date.now() - new Date(sale.date).getTime()) / (1000 * 60 * 60 * 24))

    const message = `Hola ${customer.name} 👋

Te recordamos tu compra del ${new Date(sale.date).toLocaleDateString('es-PE')} (hace ${daysAgo} días):

💰 Total: S/ ${sale.total.toFixed(2)}
✅ Pagado: S/ ${sale.paid.toFixed(2)}
⚠️ Pendiente: S/ ${pending.toFixed(2)}

¿Podrías completar el pago?

${businessName}`

    return {
      url: this.generateWhatsAppURL(customer.phone, message),
      message
    }
  }

  // Envío masivo (genera lista de URLs)
  generateBulkReminders(customers: Customer[], businessName: string): {
    customer_name: string
    phone: string
    debt: number
    whatsapp_url: string
  }[] {
    return customers
      .filter(c => c.debt > 0)
      .map(customer => {
        const reminder = this.generateDebtReminder(customer, businessName)
        return {
          customer_name: customer.name,
          phone: customer.phone,
          debt: customer.debt,
          whatsapp_url: reminder.url
        }
      })
      .sort((a, b) => b.debt - a.debt)
  }

  // Programar recordatorios automáticos
  scheduleAutomaticReminders(customers: Customer[], businessName: string): {
    immediate: any[]
    in_3_days: any[]
    in_7_days: any[]
  } {
    const now = Date.now()
    
    return {
      immediate: customers.filter(c => c.debt > 100).map(c => ({
        customer: c.name,
        action: 'send_now',
        url: this.generateDebtReminder(c, businessName).url
      })),
      in_3_days: customers.filter(c => c.debt > 50 && c.debt <= 100).map(c => ({
        customer: c.name,
        action: 'send_in_3_days',
        url: this.generateDebtReminder(c, businessName).url
      })),
      in_7_days: customers.filter(c => c.debt > 0 && c.debt <= 50).map(c => ({
        customer: c.name,
        action: 'send_in_7_days',
        url: this.generateDebtReminder(c, businessName).url
      }))
    }
  }
}

// Uso:
// const whatsapp = new WhatsAppAutomation('51913916967')
// const reminder = whatsapp.generateDebtReminder(customer, 'Mi Bodega')
// window.open(reminder.url, '_blank')
