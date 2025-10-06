// Mock temporal de OpenRouter mientras debuggeamos la API key
// Simula respuestas de la IA con código Mermaid válido

const MOCK_RESPONSES: Record<string, string> = {
  pizza: `\`\`\`mermaid
flowchart TD
    Start([🍕 Inicio]) --> Gather[🛒 Reunir Ingredientes]
    Gather --> Dough[🥖 Preparar Masa]
    Dough --> Extend[👐 Extender Masa]
    Extend --> Sauce[🍅 Agregar Salsa]
    Sauce --> Cheese[🧀 Agregar Queso]
    Cheese --> Toppings[🥓🍄 Agregar Toppings]
    Toppings --> Bake[🔥 Hornear 15-20 min<br/>a 220°C]
    Bake --> Cool[⏱️ Enfriar 2-3 min]
    Cool --> Serve[🍽️ Servir Caliente]
    Serve --> End([😋 ¡A Disfrutar!])
    
    style Start fill:#e8f5e9
    style End fill:#fff9c4
    style Bake fill:#ffebee
\`\`\``,

  autenticacion: `\`\`\`mermaid
flowchart TD
    A[👤 Usuario Ingresa] --> B{¿Tiene Cuenta?}
    B -->|No| C[📝 Formulario Registro]
    B -->|Sí| D[🔐 Formulario Login]
    
    C --> E[Validar Datos]
    D --> F[Verificar Credenciales]
    
    E --> G{¿Datos Válidos?}
    F --> H{¿Credenciales<br/>Correctas?}
    
    G -->|No| C
    G -->|Sí| I[💾 Crear Cuenta en BD]
    
    H -->|No| J[❌ Mostrar Error]
    J --> D
    H -->|Sí| K[🎫 Generar Token JWT]
    
    I --> K
    K --> L[✅ Guardar Sesión]
    L --> M[🎉 Redirigir a Dashboard]
    
    style A fill:#e3f2fd
    style M fill:#c8e6c9
    style J fill:#ffcdd2
\`\`\``,

  pedido: `\`\`\`mermaid
flowchart LR
    A[🛍️ Nuevo Pedido] --> B[📦 En Preparación]
    B --> C[🚚 En Camino]
    C --> D[📍 En Reparto]
    D --> E[✅ Entregado]
    
    B --> F[❌ Cancelado]
    C --> F
    D --> F
    
    E --> G[⭐ Calificar]
    
    style A fill:#e1f5fe
    style E fill:#c8e6c9
    style F fill:#ffcdd2
    style G fill:#fff9c4
\`\`\``,

  default: `\`\`\`mermaid
flowchart LR
    A[📋 Inicio del Proceso] --> B[⚙️ Paso 1:<br/>Análisis]
    B --> C[🔄 Paso 2:<br/>Procesamiento]
    C --> D[✨ Paso 3:<br/>Resultado]
    D --> E[✅ Fin]
    
    style A fill:#e3f2fd
    style E fill:#c8e6c9
\`\`\``,
};

export async function mockSendMessage(userMessage: string): Promise<string> {
  // Simula delay de API real
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Detectar keywords y retornar respuesta apropiada
  if (lowerMessage.includes('pizza')) {
    return MOCK_RESPONSES.pizza;
  } else if (
    lowerMessage.includes('autenticacion') ||
    lowerMessage.includes('autenticación') ||
    lowerMessage.includes('login') ||
    lowerMessage.includes('usuario') ||
    lowerMessage.includes('registro')
  ) {
    return MOCK_RESPONSES.autenticacion;
  } else if (
    lowerMessage.includes('pedido') ||
    lowerMessage.includes('orden') ||
    lowerMessage.includes('compra') ||
    lowerMessage.includes('delivery')
  ) {
    return MOCK_RESPONSES.pedido;
  } else {
    return MOCK_RESPONSES.default;
  }
}


