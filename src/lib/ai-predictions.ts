// Sistema de IA Predictiva para Alertas de Stock
// Analiza historial de ventas y predice cuándo se agotará un producto

interface Sale {
  date: string
  items: { product_id: string; quantity: number }[]
}

interface Product {
  id: string
  name: string
  stock: number
  min_stock: number
}

interface StockPrediction {
  product_id: string
  product_name: string
  current_stock: number
  daily_avg_sales: number
  days_until_stockout: number
  predicted_stockout_date: string
  alert_level: 'critical' | 'warning' | 'ok'
  recommendation: string
}

export class StockPredictionAI {
  // Analiza ventas de los últimos 30 días
  private analyzeSalesHistory(productId: string, sales: Sale[]): number {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentSales = sales.filter(sale => new Date(sale.date) >= thirtyDaysAgo)
    
    let totalSold = 0
    recentSales.forEach(sale => {
      sale.items.forEach(item => {
        if (item.product_id === productId) {
          totalSold += item.quantity
        }
      })
    })

    return totalSold / 30 // Promedio diario
  }

  // Predice cuándo se agotará el stock
  predictStockout(product: Product, sales: Sale[]): StockPrediction {
    const dailyAvgSales = this.analyzeSalesHistory(product.id, sales)
    
    if (dailyAvgSales === 0) {
      return {
        product_id: product.id,
        product_name: product.name,
        current_stock: product.stock,
        daily_avg_sales: 0,
        days_until_stockout: 999,
        predicted_stockout_date: 'N/A',
        alert_level: 'ok',
        recommendation: 'Sin ventas recientes'
      }
    }

    const daysUntilStockout = Math.floor(product.stock / dailyAvgSales)
    const stockoutDate = new Date()
    stockoutDate.setDate(stockoutDate.getDate() + daysUntilStockout)

    let alertLevel: 'critical' | 'warning' | 'ok' = 'ok'
    let recommendation = ''

    if (daysUntilStockout <= 3) {
      alertLevel = 'critical'
      recommendation = `¡URGENTE! Reabastecer HOY. Se agota en ${daysUntilStockout} días.`
    } else if (daysUntilStockout <= 7) {
      alertLevel = 'warning'
      recommendation = `Reabastecer pronto. Se agota en ${daysUntilStockout} días.`
    } else {
      recommendation = `Stock suficiente por ${daysUntilStockout} días.`
    }

    return {
      product_id: product.id,
      product_name: product.name,
      current_stock: product.stock,
      daily_avg_sales: Math.round(dailyAvgSales * 10) / 10,
      days_until_stockout: daysUntilStockout,
      predicted_stockout_date: stockoutDate.toLocaleDateString('es-PE'),
      alert_level: alertLevel,
      recommendation
    }
  }

  // Obtiene todas las alertas críticas
  getCriticalAlerts(products: Product[], sales: Sale[]): StockPrediction[] {
    return products
      .map(product => this.predictStockout(product, sales))
      .filter(prediction => prediction.alert_level === 'critical')
      .sort((a, b) => a.days_until_stockout - b.days_until_stockout)
  }

  // Obtiene recomendaciones de compra
  getPurchaseRecommendations(products: Product[], sales: Sale[]): {
    product_name: string
    current_stock: number
    recommended_purchase: number
    reason: string
  }[] {
    return products
      .map(product => {
        const prediction = this.predictStockout(product, sales)
        const recommendedPurchase = Math.ceil(prediction.daily_avg_sales * 30) // Stock para 30 días
        
        return {
          product_name: product.name,
          current_stock: product.stock,
          recommended_purchase: recommendedPurchase,
          reason: `Vendes ${prediction.daily_avg_sales} unidades/día. Stock recomendado: ${recommendedPurchase} unidades (30 días)`
        }
      })
      .filter(rec => rec.recommended_purchase > rec.current_stock)
      .sort((a, b) => (b.recommended_purchase - b.current_stock) - (a.recommended_purchase - a.current_stock))
  }
}

// Uso:
// const ai = new StockPredictionAI()
// const predictions = ai.getCriticalAlerts(products, sales)
// const recommendations = ai.getPurchaseRecommendations(products, sales)
