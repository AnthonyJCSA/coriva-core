import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key no configurada' }, { status: 500 })
    }

    const systemPrompt = `Eres el asistente IA de Coriva Core, un sistema POS SaaS para negocios pequeños y medianos en Latinoamérica.
Tu rol es ayudar al dueño del negocio a:
- Analizar ventas y predecir tendencias
- Alertar sobre stock bajo y recomendar pedidos
- Crear mensajes para clientes por WhatsApp o email
- Sugerir promociones basadas en datos reales
- Responder preguntas sobre el negocio

Contexto actual del negocio:
${context ? JSON.stringify(context, null, 2) : 'Sin datos disponibles aún'}

Responde siempre en español, de forma concisa y accionable. Usa emojis para hacer las respuestas más visuales.
Si tienes datos del contexto, úsalos para dar respuestas personalizadas y específicas.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return NextResponse.json({ error: err.error?.message || 'Error OpenAI' }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.choices[0]?.message?.content || 'Sin respuesta'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
