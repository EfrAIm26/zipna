# 🚀 Setup de Zipna - Generador de Diagramas Mermaid con IA

## ✅ PASO 2 COMPLETADO: Chat UI + Integración OpenRouter

### 📦 Archivos Creados

```
src/
├── lib/
│   └── openrouter.ts          # Cliente API de OpenRouter
├── store/
│   └── chatStore.ts           # Store de Zustand para el chat
├── components/
│   └── chat/
│       ├── ChatInput.tsx      # Input con auto-resize y shortcuts
│       ├── MessageList.tsx    # Lista de mensajes con scroll automático
│       └── ChatContainer.tsx  # Contenedor principal que orquesta todo
└── App.tsx                    # UI principal actualizada
```

### 🔑 Configurar API Key de OpenRouter

1. **Obtén tu API Key:**
   - Ve a [https://openrouter.ai/keys](https://openrouter.ai/keys)
   - Crea una cuenta si no tienes
   - Genera una nueva API key

2. **Configura el archivo .env:**
   ```bash
   # En la raíz del proyecto, crea un archivo .env
   touch .env
   ```

3. **Agrega tu API key:**
   ```env
   VITE_OPENROUTER_API_KEY=sk-or-v1-tu-key-aqui
   ```

4. **Reinicia el servidor:**
   ```bash
   # Detén el servidor (Ctrl+C) y reinicia
   pnpm dev
   ```

### 🎯 Cómo Usar

1. **Abre la aplicación:**
   ```
   http://localhost:5173
   ```

2. **Describe un proceso en lenguaje natural:**
   - "Proceso para hacer una pizza"
   - "Flujo de autenticación de usuarios"
   - "Ciclo de vida de un pedido online"

3. **La IA generará el código Mermaid:**
   - El chat mostrará el código generado
   - (Próximo paso: visualización automática del diagrama)

### 🎨 Features Implementadas

✅ **Cliente OpenRouter** (`src/lib/openrouter.ts`)
- Comunicación con API de OpenRouter
- Usa modelo Claude Sonnet 4
- Sistema prompt optimizado para Mermaid
- Manejo robusto de errores

✅ **Store de Zustand** (`src/store/chatStore.ts`)
- Estado global para mensajes
- IDs únicos con crypto.randomUUID()
- Timestamps automáticos
- Loading y error states

✅ **Componentes de Chat**
- **ChatInput**: 
  - Auto-resize hasta 5 líneas
  - Enter envía, Shift+Enter nueva línea
  - Disabled durante loading
  - Ícono de envío de lucide-react

- **MessageList**: 
  - Scroll automático al último mensaje
  - Estilos diferenciados user/assistant
  - Loading indicator con puntos animados
  - Empty state con ejemplos

- **ChatContainer**:
  - Orquesta input y messages
  - Manejo de errores con UI feedback
  - Integración con OpenRouter
  - Layout responsive

✅ **UI/UX**
- Diseño moderno con Tailwind CSS
- Gradientes y efectos visuales
- Dark mode nativo
- Responsive design
- Iconos de lucide-react

### 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Estado**: Zustand
- **Estilos**: Tailwind CSS v4
- **Iconos**: Lucide React
- **IA**: OpenRouter (Claude Sonnet 4)
- **Diagramas**: Mermaid.js
- **Build**: Vite + SWC

### 📝 Ejemplos de Prompts

```
"Crea un flowchart del proceso para hacer una pizza"
"Muéstrame un diagrama de flujo de cómo funciona el login"
"Diagrama del ciclo de vida de un componente React"
"Mindmap de las características de una app de tareas"
```

### 🐛 Troubleshooting

**Error: "API Key de OpenRouter no configurada"**
- Verifica que el archivo `.env` existe en la raíz
- Verifica que la variable se llama `VITE_OPENROUTER_API_KEY`
- Reinicia el servidor después de crear/editar .env

**Error de red/timeout**
- Verifica tu conexión a internet
- Verifica que la API key sea válida
- Revisa los logs en la consola del navegador

**Hot reload no funciona**
- Detén el servidor (Ctrl+C)
- Limpia la caché: `rm -rf node_modules/.vite`
- Reinicia: `pnpm dev`

### 🎯 Próximos Pasos (PASO 3)

1. Extraer código Mermaid de la respuesta de la IA
2. Integrar visualización del diagrama con Mermaid.js
3. Panel dividido: Chat + Visualización
4. Botones de exportar (PNG/SVG)
5. Historial de diagramas

---

**Desarrollado con ❤️ usando Claude Sonnet 4.5**


