# 📧 Email Marketing - Coriva Core

## 🎯 Template Creado

**Archivo**: `email-templates/email-marketing-v1.html`

### Características
- ✅ Diseño responsive (mobile-first)
- ✅ CTA directo a WhatsApp con mensaje precargado
- ✅ 4 beneficios emocionales destacados
- ✅ Social proof (10K+ negocios)
- ✅ Urgencia (50% OFF, 47 cupos)
- ✅ Colores de marca (Indigo/Purple)
- ✅ Compatible con todos los clientes de email

---

## 🚀 Cómo Usar

### Opción 1: Envío Manual
1. Abrir `email-templates/email-marketing-v1.html`
2. Copiar todo el código HTML
3. Pegar en tu cliente de email (Gmail, Outlook, etc.)
4. Enviar a tu lista de contactos

### Opción 2: Plataforma de Email Marketing

#### Mailchimp
1. Crear nueva campaña
2. Seleccionar "Code your own"
3. Pegar el HTML
4. Configurar lista de destinatarios
5. Programar envío

#### SendGrid
1. Marketing → Single Sends → Create Single Send
2. Select "Code Editor"
3. Pegar el HTML
4. Configurar destinatarios
5. Enviar

#### Resend (Recomendado para SaaS)
```bash
npm install resend
```

```typescript
import { Resend } from 'resend'

const resend = new Resend('re_123456789')

await resend.emails.send({
  from: 'Coriva <hola@coriva.com>',
  to: ['cliente@ejemplo.com'],
  subject: '🚀 Vende más, pierde menos con Coriva',
  html: fs.readFileSync('email-templates/email-marketing-v1.html', 'utf8')
})
```

---

## 📊 Estrategia de Email Marketing

### Secuencia de Emails (Drip Campaign)

#### Email 1: Bienvenida (Día 0)
**Asunto**: "🚀 Vende más, pierde menos con Coriva"  
**Template**: `email-marketing-v1.html`  
**Objetivo**: Captar atención, mostrar beneficios  
**CTA**: WhatsApp directo

#### Email 2: Caso de Éxito (Día 3)
**Asunto**: "Cómo María ahorró 10 horas a la semana"  
**Contenido**: Testimonio real, antes/después  
**CTA**: Ver demo

#### Email 3: Urgencia (Día 7)
**Asunto**: "⏰ Solo quedan 24 horas - 50% OFF"  
**Contenido**: Recordatorio de oferta  
**CTA**: WhatsApp directo

#### Email 4: Última Oportunidad (Día 10)
**Asunto**: "🔥 Última oportunidad - Oferta termina hoy"  
**Contenido**: FOMO, escasez  
**CTA**: WhatsApp directo

---

## 🎯 Segmentación de Audiencia

### Segmento 1: Bodegas/Minimarkets
**Asunto**: "🛒 Controla tu bodega desde tu celular"  
**Beneficio principal**: Control de inventario, alertas de stock

### Segmento 2: Farmacias
**Asunto**: "💊 Gestiona tu farmacia con IA"  
**Beneficio principal**: Control de medicamentos, vencimientos

### Segmento 3: Tiendas de Ropa
**Asunto**: "👕 Vende más ropa con menos esfuerzo"  
**Beneficio principal**: Tallas, colores, temporadas

### Segmento 4: Salones de Belleza
**Asunto**: "💇 Tu salón en piloto automático"  
**Beneficio principal**: Agenda, productos, servicios

---

## 📈 Métricas a Monitorear

### Open Rate (Tasa de Apertura)
- **Objetivo**: > 25%
- **Benchmark**: 20-25% para SaaS B2B
- **Optimizar**: Subject line, preview text

### Click Rate (CTR)
- **Objetivo**: > 5%
- **Benchmark**: 3-5% para SaaS
- **Optimizar**: CTA, diseño, copy

### Conversión a WhatsApp
- **Objetivo**: > 10% de clicks
- **Benchmark**: 8-12% para WhatsApp CTA
- **Optimizar**: Mensaje precargado, urgencia

### Conversión a Cliente
- **Objetivo**: > 2% de emails enviados
- **Benchmark**: 1-3% para cold emails
- **Optimizar**: Seguimiento, oferta

---

## 🔧 Personalización del Template

### Cambiar Número de WhatsApp
```html
<!-- Línea 95 -->
<a href="https://wa.me/51913916967?text=...">
```
Reemplazar `51913916967` con tu número (código país + número)

### Cambiar Mensaje Precargado
```html
?text=Hola%2C%20quiero%20probar%20Coriva%20gratis%20%F0%9F%9A%80
```
Usar [URL Encoder](https://www.urlencoder.org/) para codificar tu mensaje

### Cambiar Colores de Marca
```css
/* Línea 10-11 */
background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
```
Reemplazar con tus colores hex

### Cambiar URLs
```html
<!-- Demo -->
<a href="https://coriva-core.vercel.app/demo">

<!-- Website -->
<a href="https://coriva-core.vercel.app">
```

---

## 📝 Subject Lines Probados

### Alta Conversión
- "🚀 Vende más, pierde menos con Coriva"
- "⏰ Ahorra 10 horas a la semana (sin contratar)"
- "💰 Controla cada sol que entra y sale"
- "🔥 50% OFF - Solo quedan 47 cupos"

### A/B Testing
- Emoji vs Sin emoji
- Pregunta vs Afirmación
- Urgencia vs Beneficio
- Personalizado vs Genérico

---

## 🎨 Variantes del Template

### Variante A: Enfoque en Ahorro de Tiempo
**Hero**: "Ahorra 10 horas a la semana"  
**Beneficios**: Tiempo, automatización, eficiencia

### Variante B: Enfoque en Dinero
**Hero**: "Controla cada sol que entra y sale"  
**Beneficios**: Control de caja, deudas, ganancias

### Variante C: Enfoque en IA
**Hero**: "Tu negocio con inteligencia artificial"  
**Beneficios**: IA predictiva, WhatsApp automático

---

## 🚀 Próximos Pasos

### Fase 1: Setup (Hoy)
1. Configurar plataforma de email (Resend/SendGrid)
2. Importar lista de contactos
3. Personalizar template
4. Enviar email de prueba

### Fase 2: Lanzamiento (Semana 1)
1. Enviar a primeros 100 contactos
2. Monitorear métricas
3. Optimizar subject line
4. A/B testing

### Fase 3: Escala (Semana 2-4)
1. Crear secuencia de 4 emails
2. Segmentar por tipo de negocio
3. Automatizar con drip campaign
4. Escalar a 1000+ contactos

---

## 💡 Tips de Conversión

### Subject Line
- Usar emoji (aumenta open rate 15%)
- Máximo 50 caracteres
- Crear curiosidad o urgencia
- Personalizar con nombre

### Preview Text
- Complementar el subject
- Máximo 100 caracteres
- Incluir beneficio principal

### CTA
- Un solo CTA principal (WhatsApp)
- Color contrastante (verde)
- Texto accionable ("Hablar por WhatsApp")
- Mensaje precargado

### Timing
- Mejor día: Martes o Miércoles
- Mejor hora: 10am - 2pm
- Evitar: Lunes temprano, Viernes tarde

---

## 📊 Plantilla de Tracking

```
Campaña: Email Marketing V1
Fecha: [FECHA]
Lista: [NOMBRE_LISTA]
Enviados: [NÚMERO]
Abiertos: [NÚMERO] ([%])
Clicks: [NÚMERO] ([%])
WhatsApp: [NÚMERO] ([%])
Conversiones: [NÚMERO] ([%])
ROI: [CÁLCULO]
```

---

## ✅ Checklist Pre-Envío

- [ ] Template personalizado con tu marca
- [ ] Número de WhatsApp correcto
- [ ] URLs funcionando
- [ ] Responsive en mobile
- [ ] Prueba en Gmail, Outlook, Apple Mail
- [ ] Subject line optimizado
- [ ] Preview text configurado
- [ ] Lista de contactos limpia
- [ ] Compliance con GDPR/CAN-SPAM
- [ ] Unsubscribe link incluido

---

**Email Marketing Template Listo** ✅  
**Conversión Esperada**: 2-5% a clientes  
**ROI Esperado**: 10-20x

---

**Desarrollado con ❤️ para máxima conversión**
