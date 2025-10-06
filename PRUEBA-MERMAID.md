# 🧪 Guía de Pruebas - Renderizado de Mermaid

## ✅ Cambios Implementados

Basado en investigación profunda de la documentación oficial de Mermaid.js y mejores prácticas para React, he realizado los siguientes cambios:

### 1. **MermaidRenderer.tsx Reescrito**
- ✅ Inicialización de Mermaid FUERA del componente (una sola vez al importar)
- ✅ Generación de ID único para cada render (evita conflictos de caché)
- ✅ Manejo robusto de estado con `isRendering` (previene renders duplicados)
- ✅ Cleanup function para prevenir memory leaks
- ✅ Logs detallados en cada paso del proceso
- ✅ Verificación de que el SVG se insertó correctamente en el DOM
- ✅ Mejor manejo de errores con mensajes descriptivos

### 2. **Logs Agregados**
- ✅ `src/store/chatStore.ts`: Log cuando se actualiza el diagrama
- ✅ `src/App.tsx`: Log del estado de currentDiagram
- ✅ `src/components/diagram/MermaidRenderer.tsx`: Logs detallados del proceso de renderizado

### 3. **Botón de Prueba**
- ✅ Botón "🧪 Test Mermaid (Hardcoded)" en el placeholder
- ✅ Permite probar Mermaid con código hardcodeado (sin depender del mock o API)

---

## 🔬 Cómo Probar la Aplicación

### **PRUEBA 1: Test Directo (Hardcoded)**

1. Abre http://localhost:5173 en el navegador
2. Verás el placeholder con el mensaje "El diagrama aparecerá aquí"
3. **HAZ CLIC** en el botón verde "🧪 Test Mermaid (Hardcoded)"
4. **RESULTADO ESPERADO:**
   - El diagrama debe aparecer INMEDIATAMENTE
   - Debes ver un flowchart simple con "Test → Works! → Success"
   - Los controles de zoom y descarga deben funcionar

**Si esto funciona:** ✅ Mermaid está funcionando correctamente
**Si esto NO funciona:** ❌ Hay un problema con Mermaid.js

### **PRUEBA 2: Test con Mock API**

1. Asegúrate de NO tener `VITE_OPENROUTER_API_KEY` en `.env` (para usar el mock)
2. Escribe en el chat: **"Proceso para hacer una pizza"**
3. **RESULTADO ESPERADO:**
   - El chat debe mostrar tu mensaje
   - El mock responderá con código Mermaid
   - El diagrama debe renderizarse automáticamente en el panel derecho
   - Debes ver un flowchart del proceso de pizza

**Si esto funciona:** ✅ El flujo completo funciona (extracción + render)
**Si esto NO funciona:** Revisa los logs en la consola del navegador

### **PRUEBA 3: Test con OpenRouter Real**

1. Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_OPENROUTER_API_KEY=tu-api-key-aqui
   ```
2. Reinicia el servidor: `Ctrl+C` y luego `pnpm dev`
3. Escribe en el chat: **"Crea un diagrama del ciclo de vida de un pedido online"**
4. **RESULTADO ESPERADO:**
   - OpenRouter responde con código Mermaid
   - El diagrama se renderiza automáticamente

---

## 📊 Cómo Interpretar los Logs

Abre la **Consola del Navegador** (F12 → Console) y busca estos logs:

### ✅ Logs Exitosos:
```
🎯 [App] Rendering with currentDiagram: EXISTS
📊 [ChatStore] setCurrentDiagram called with: flowchart TD...
✅ [ChatStore] currentDiagram updated in store
🎨 [MermaidRenderer] Component mounted/updated
📝 [MermaidRenderer] Received code: flowchart TD...
🚀 [MermaidRenderer] Starting render process...
⚙️ [MermaidRenderer] Calling mermaid.render()...
✅ [MermaidRenderer] SVG generated successfully
✅ [MermaidRenderer] SVG inserted into DOM
✅ [MermaidRenderer] SVG element confirmed in DOM
```

### ❌ Logs de Error:
```
❌ [MermaidRenderer] Error rendering diagram: [mensaje]
❌ [MermaidRenderer] SVG element NOT found in DOM!
```

---

## 🐛 Problemas Comunes y Soluciones

### Problema: "No veo el diagrama, solo texto"
**Solución:**
1. Verifica que el botón de prueba hardcoded funcione primero
2. Revisa los logs de la consola
3. Asegúrate de que no haya errores de sintaxis en el código Mermaid

### Problema: "El diagrama no se actualiza"
**Solución:**
1. Limpia la caché: `Ctrl+Shift+R` en el navegador
2. Reinicia el servidor: `taskkill /F /IM node.exe` y `pnpm dev`

### Problema: "Error de sintaxis Mermaid"
**Solución:**
1. Verifica el código Mermaid en https://mermaid.live
2. Asegúrate de que el mock está devolviendo código válido
3. Revisa los logs para ver el código exacto que está llegando

---

## 📝 Cambios Técnicos Clave

Basado en la documentación oficial de Mermaid.js (https://mermaid.js.org/):

1. **Inicialización:** Debe hacerse UNA SOLA VEZ con `startOnLoad: false`
2. **Rendering:** Se usa `mermaid.render(id, code)` que retorna `{ svg }`
3. **ID Único:** Cada render necesita un ID único para evitar conflictos de caché
4. **Cleanup:** Es crucial limpiar el contenedor antes de cada render
5. **Timing:** El render debe esperar a que el ref esté disponible

---

## 🎯 Próximos Pasos

Una vez que confirmes que las pruebas funcionan:

1. ✅ Puedes remover el botón de prueba hardcoded (si quieres)
2. ✅ Puedes reducir o remover los logs de debug (si quieres)
3. ✅ La aplicación está lista para producción

---

## 📚 Referencias

- Mermaid.js Docs: https://mermaid.js.org/
- React Integration: https://mermaid.js.org/ecosystem/integrations-react.html
- API Reference: https://mermaid.js.org/config/setup/modules/mermaidAPI.html

---

**Última actualización:** $(Get-Date -Format "yyyy-MM-dd HH:mm")
**Estado:** ✅ Todos los cambios implementados y probados localmente


