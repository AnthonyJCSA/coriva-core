// Export utilities for Excel and PDF

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    alert('No hay datos para exportar')
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

export const exportSalesToCSV = (sales: any[]) => {
  const data = sales.map(sale => ({
    'Número': sale.sale_number,
    'Fecha': new Date(sale.created_at).toLocaleString('es-PE'),
    'Cliente': sale.customer_name || 'Cliente General',
    'Total': sale.total,
    'Método Pago': sale.payment_method,
    'Estado': sale.status === 'CANCELLED' ? 'ANULADA' : 'ACTIVA'
  }))
  
  exportToCSV(data, 'ventas')
}

export const exportInventoryToCSV = (products: any[]) => {
  const data = products.map(p => ({
    'Código': p.code,
    'Nombre': p.name,
    'Categoría': p.category || '',
    'Precio': p.price,
    'Costo': p.cost || '',
    'Stock': p.stock,
    'Stock Mínimo': p.min_stock
  }))
  
  exportToCSV(data, 'inventario')
}

export const exportCustomersToCSV = (customers: any[]) => {
  const data = customers.map(c => ({
    'Tipo Doc': c.document_type,
    'Número': c.document_number,
    'Nombre': c.full_name,
    'Teléfono': c.phone || '',
    'Email': c.email || '',
    'Compras': c.total_purchases
  }))
  
  exportToCSV(data, 'clientes')
}

export const printReceipt = (content: string) => {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Comprobante</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              padding: 10mm;
            }
            pre { white-space: pre-wrap; }
            @media print {
              @page { size: 80mm auto; margin: 0; }
            }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
        </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
      setTimeout(() => printWindow.close(), 1000)
    }, 500)
  }
}
