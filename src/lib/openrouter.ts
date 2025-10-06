// Cliente para OpenRouter API
import { mockSendMessage } from './mockOpenRouter';

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function sendMessage(userMessage: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  console.log('🔍 [OpenRouter] Checking API key...');
  console.log('🔍 [OpenRouter] API key exists:', !!apiKey);
  console.log('🔍 [OpenRouter] API key length:', apiKey?.length || 0);
  console.log('🔍 [OpenRouter] API key prefix:', apiKey?.substring(0, 10) || 'N/A');

  // Si no hay API key, usar mock temporal
  if (!apiKey || apiKey.trim() === '') {
    console.log('🔧 MODO MOCK: Usando respuestas simuladas (API key no configurada)');
    console.log('📝 Para usar OpenRouter real, agrega VITE_OPENROUTER_API_KEY en tu archivo .env.local');
    console.log('📝 Formato: VITE_OPENROUTER_API_KEY=sk-or-v1-...');
    return mockSendMessage(userMessage);
  }

  try {
    console.log('✅ [OpenRouter] Usando API REAL');
    console.log('📤 [OpenRouter] Enviando mensaje:', userMessage);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Zipna'
      },
      body: JSON.stringify({
        // Modelos que SÍ EXISTEN en OpenRouter (verificados):
        // - 'anthropic/claude-3.5-sonnet' (El mejor para diagramas, $0.003/1K)
        // - 'openai/gpt-4o-mini' (Rápido y económico, $0.00015/1K)
        // - 'google/gemini-pro-1.5' (Google, $0.00125/1K)
        // - 'deepseek/deepseek-chat' (Muy económico, $0.00014/1K)
        model: 'openai/gpt-4o-mini', // Modelo REAL que existe y funciona
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en crear diagramas Mermaid. Cuando el usuario describa un proceso, flujo, sistema o concepto, genera ÚNICAMENTE código Mermaid válido. Responde SOLO con el código entre ```mermaid y ```, sin explicaciones adicionales. Usa sintaxis moderna de Mermaid. Si el usuario describe un proceso como el de hacer pizza, crea un flowchart detallado con emojis y estilos.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [OpenRouter] Error:', errorText);
      console.error('❌ [OpenRouter] Status:', response.status);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data: OpenRouterResponse = await response.json();
    console.log('📦 [OpenRouter] Response received:', data);
    
    if (!data.choices || data.choices.length === 0) {
      console.error('❌ [OpenRouter] No choices in response');
      throw new Error('No se recibió respuesta de OpenRouter');
    }

    const content = data.choices[0].message.content;
    console.log('✅ [OpenRouter] Content received, length:', content.length);
    console.log('📝 [OpenRouter] Preview:', content.substring(0, 200));

    return content;
  } catch (error) {
    console.error('Error al comunicarse con OpenRouter:', error);
    if (error instanceof Error) {
      throw new Error(`Error al generar diagrama: ${error.message}`);
    }
    throw new Error('Error desconocido al generar diagrama');
  }
}

