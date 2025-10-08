// Cliente para OpenRouter API
import { mockSendMessage } from './mockOpenRouter';
import { getActualModel } from './aiModels';

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface SendMessageOptions {
  model?: string;
  attachedFiles?: Array<{ name: string; content: string }>;
}

// Detectar si el usuario quiere un diagrama o solo texto
function detectIntention(message: string): 'diagram' | 'text' {
  const lowerMessage = message.toLowerCase();
  
  // Palabras clave para diagramas
  const diagramKeywords = [
    'diagrama', 'mapa', 'flujo', 'flowchart', 'proceso', 'arquitectura',
    'esquema', 'diseño', 'modelo', 'estructura', 'visualiza', 'dibuja',
    'grafica', 'mermaid', 'secuencia', 'clase', 'entidad', 'relación',
    'mindmap', 'mental', 'gantt', 'timeline', 'pie', 'chart', 'quadrant',
    'sankey', 'flow', 'income', 'statement', 'matrix', 'reach', 'engagement',
    'population', 'ethnicity', 'revolution'
  ];
  
  // Palabras clave para texto
  const textKeywords = [
    'explica', 'qué es', 'cómo funciona', 'define', 'responde',
    'dime', 'cuéntame', 'escribe', 'redacta', 'ayúdame', 'necesito saber'
  ];
  
  // Contar coincidencias
  const diagramCount = diagramKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
  const textCount = textKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
  
  // Si hay más palabras de diagrama, es un diagrama
  if (diagramCount > textCount && diagramCount > 0) {
    return 'diagram';
  }
  
  // Si claramente pide solo texto
  if (textCount > 0) {
    return 'text';
  }
  
  // Por defecto, si no está claro, asumir que quiere texto
  return 'text';
}

export async function sendMessage(
  userMessage: string,
  options: SendMessageOptions = {}
): Promise<{ content: string; isDiagram: boolean }> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const { model = 'auto', attachedFiles = [] } = options;

  console.log('🔍 [OpenRouter] Checking API key...');
  console.log('🔍 [OpenRouter] API key exists:', !!apiKey);
  console.log('🔍 [OpenRouter] Selected model:', model);

  // Detectar intención del usuario
  const intention = detectIntention(userMessage);
  const isDiagram = intention === 'diagram';
  
  console.log('🎯 [OpenRouter] Detected intention:', intention);

  // Si no hay API key, usar mock temporal
  if (!apiKey || apiKey.trim() === '') {
    console.log('🔧 MODO MOCK: Usando respuestas simuladas (API key no configurada)');
    const mockResponse = await mockSendMessage(userMessage);
    return { content: mockResponse, isDiagram };
  }

  try {
    console.log('✅ [OpenRouter] Usando API REAL');
    
    // Preparar contenido con archivos adjuntos
    let fullMessage = userMessage;
    if (attachedFiles.length > 0) {
      fullMessage += '\n\n📎 Archivos adjuntos:\n';
      attachedFiles.forEach(file => {
        fullMessage += `\n**${file.name}**:\n${file.content}\n`;
      });
    }

    // System prompt según la intención
    const systemPrompt = isDiagram
      ? `You are an expert at creating Mermaid diagrams. When the user describes a process, flow, system, or concept:
      
1. Generate valid Mermaid code between \`\`\`mermaid and \`\`\`.
2. After the code, provide a detailed explanation of the diagram with:
   - 📊 Descriptive title
   - 🎯 Main components (with emojis)
   - 🔄 Key flows or relationships
   - 💡 Important insights
   
Use emojis, markdown formatting, and make it visual and easy to understand.

**Important Mermaid Diagram Types:**

**Flowchart:**
\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
\`\`\`

**Mindmap:**
\`\`\`mermaid
mindmap
  root((Central Idea))
    Topic 1
      Subtopic 1.1
      Subtopic 1.2
    Topic 2
      Subtopic 2.1
\`\`\`

**Pie Chart:**
\`\`\`mermaid
pie title Distribution
    "Category A" : 45
    "Category B" : 30
    "Category C" : 25
\`\`\`

**Quadrant Chart** (for 2x2 matrices):
\`\`\`mermaid
quadrantChart
    title Product Priority Matrix
    x-axis Low Urgency --> High Urgency
    y-axis Low Importance --> High Importance
    quadrant-1 Do First
    quadrant-2 Schedule
    quadrant-3 Delegate
    quadrant-4 Eliminate
    Feature A: [0.7, 0.8]
    Feature B: [0.3, 0.6]
    Feature C: [0.8, 0.3]
\`\`\`

**Sankey Diagram** (for flow analysis):
\`\`\`mermaid
%%{init: {"theme": "base", "themeVariables": {"fontSize": "16px"}}}%%
sankey-beta

Revenue,Operating Expenses,50
Revenue,Cost of Goods Sold,30
Revenue,Net Income,20
Operating Expenses,Marketing,20
Operating Expenses,R&D,15
Operating Expenses,Admin,15
\`\`\`

Choose the most appropriate diagram type based on the user's request. For quadrants, use clear axis labels and position items appropriately. For Sankey, show clear flows with proper source, target, and value triplets.`
      : `You are a helpful and conversational AI assistant. Respond clearly, concisely, and professionally. Use emojis when appropriate to make responses more friendly. If the user asks for help with something specific, provide detailed information and relevant examples.`;

    const actualModel = getActualModel(model);
    console.log('🤖 [OpenRouter] Using model:', actualModel);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Zipna'
      },
      body: JSON.stringify({
        model: actualModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: fullMessage
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [OpenRouter] Error:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data: OpenRouterResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No se recibió respuesta de OpenRouter');
    }

    const content = data.choices[0].message.content;
    console.log('✅ [OpenRouter] Content received, isDiagram:', isDiagram);

    return { content, isDiagram };
  } catch (error) {
    console.error('Error al comunicarse con OpenRouter:', error);
    if (error instanceof Error) {
      throw new Error(`Error al generar respuesta: ${error.message}`);
    }
    throw new Error('Error desconocido al generar respuesta');
  }
}

