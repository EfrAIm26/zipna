# 🧪 Guía de Pruebas - OpenRouter API

## ✅ Cambios Implementados

He actualizado el código para usar **Gemini 2.0 Flash** (gratis, rápido, de calidad) y agregado logs detallados para debugging.

### Cambios:
1. ✅ Modelo cambiado a `google/gemini-2.0-flash-exp:free`
2. ✅ Logs detallados para ver si está usando mock o API real
3. ✅ Mejor detección de API key
4. ✅ Mensajes claros en consola

---

## 🔑 Configurar API Key

### Paso 1: Obtener API Key de OpenRouter

1. Ve a https://openrouter.ai/
2. Regístrate o inicia sesión
3. Ve a https://openrouter.ai/keys
4. Crea una nueva API key
5. Copia la key (empieza con `sk-or-v1-...`)

### Paso 2: Crear/Editar `.env.local`

1. En la raíz del proyecto (mismo nivel que `package.json`), abre o crea `.env.local`
2. Agrega esta línea (reemplaza con tu API key real):

```
VITE_OPENROUTER_API_KEY=sk-or-v1-tu-api-key-completa-aqui
```

**IMPORTANTE:**
- ✅ NO uses comillas: `VITE_OPENROUTER_API_KEY=sk-or-v1-...`
- ❌ NO: `VITE_OPENROUTER_API_KEY="sk-or-v1-..."`
- ✅ Sin espacios antes o después del `=`
- ✅ El archivo debe llamarse exactamente `.env.local` (con el punto al inicio)

### Paso 3: Reiniciar el Servidor

**MUY IMPORTANTE:** Vite NO detecta cambios en `.env.local` automáticamente.

```powershell
# 1. Mata TODOS los procesos Node
taskkill /F /IM node.exe

# 2. Espera 2 segundos
Start-Sleep -Seconds 2

# 3. Reinicia el servidor
pnpm dev
```

---

## 🧪 Cómo Probar

### Test 1: Verificar que lee la API key

1. Abre http://localhost:5173
2. Abre la consola del navegador (F12 → Console)
3. Escribe cualquier cosa en el chat, ejemplo: `"test"`
4. **Busca estos logs:**

```
🔍 [OpenRouter] Checking API key...
🔍 [OpenRouter] API key exists: true
🔍 [OpenRouter] API key length: 64 (o similar)
🔍 [OpenRouter] API key prefix: sk-or-v1-
```

**Si dice `API key exists: false` o `length: 0`:**
- ❌ La API key NO se está leyendo
- Verifica que el archivo se llame `.env.local` (no `.env`)
- Verifica que la variable sea `VITE_OPENROUTER_API_KEY` (con VITE_ al inicio)
- Reinicia el servidor con `taskkill /F /IM node.exe` y `pnpm dev`

**Si dice `API key exists: true`:**
- ✅ La API key se está leyendo correctamente
- Debe decir `✅ [OpenRouter] Usando API REAL`
- Continúa al Test 2

### Test 2: Hacer llamada real a OpenRouter

1. Escribe en el chat: `"Crea un diagrama del proceso de autenticación de usuarios"`
2. **Espera la respuesta** (puede tardar 5-10 segundos)
3. **Busca estos logs en consola:**

```
📤 [OpenRouter] Enviando mensaje: Crea un diagrama...
📦 [OpenRouter] Response received: {...}
✅ [OpenRouter] Content received, length: XXX
📝 [OpenRouter] Preview: ```mermaid...
```

**Si ves estos logs:**
- ✅ **¡FUNCIONA!** OpenRouter está respondiendo
- El diagrama debe renderizarse automáticamente

**Si ves errores:**
- ❌ `Error 401`: API key inválida (verifica en OpenRouter)
- ❌ `Error 429`: Límite de requests excedido (espera un momento)
- ❌ `Error 500`: Error del servidor de OpenRouter (intenta de nuevo)

---

## 🎯 Modelos Disponibles

Actualmente estamos usando:
- **`google/gemini-2.0-flash-exp:free`** - Gratis, rápido, de calidad

Otros modelos que puedes probar (edita `src/lib/openrouter.ts` línea 49):

```typescript
// Gratis y rápidos:
model: 'google/gemini-2.0-flash-exp:free'  // Recomendado
model: 'meta-llama/llama-3.1-8b-instruct:free'

// De pago (mejores):
model: 'anthropic/claude-sonnet-4-20250514'  // El mejor para diagramas
model: 'google/gemini-pro-1.5'  // Bueno y barato
model: 'openai/gpt-4o-mini'  // Rápido y económico
```

---

## 🐛 Problemas Comunes

### Problema: "Sigue usando el mock"

**Solución:**
1. Verifica que `.env.local` exista en la raíz del proyecto
2. Abre `.env.local` y verifica el formato:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-...
   ```
3. **Reinicia el servidor completamente:**
   ```powershell
   taskkill /F /IM node.exe
   pnpm dev
   ```
4. Abre en **nueva pestaña de incógnito** (Ctrl+Shift+N)
5. Verifica los logs en consola

### Problema: "Error 401 Unauthorized"

**Solución:**
1. Tu API key es inválida o expiró
2. Ve a https://openrouter.ai/keys
3. Verifica que la key esté activa
4. Genera una nueva key si es necesario
5. Actualiza `.env.local` y reinicia

### Problema: "No se renderiza el diagrama"

**Solución:**
1. Verifica que el log diga `✅ [OpenRouter] Content received`
2. Verifica que el preview contenga ` ```mermaid`
3. Si el contenido no tiene código Mermaid, el modelo puede estar devolviendo texto plano
4. Intenta con un prompt más claro: "Crea SOLO código mermaid para..."

---

## 📦 Desplegar en Vercel (DESPUÉS de probar localmente)

Una vez que funcione localmente:

1. **Sube a GitHub:**
   ```bash
   git add .
   git commit -m "feat: Integración OpenRouter con Mermaid"
   git push origin main
   ```

2. **Despliega en Vercel:**
   - Ve a https://vercel.com
   - Conecta tu repositorio GitHub
   - En "Environment Variables", agrega:
     - Key: `VITE_OPENROUTER_API_KEY`
     - Value: `sk-or-v1-tu-api-key`
   - Deploy

3. **Verifica en producción:**
   - Abre tu URL de Vercel
   - Prueba enviando un mensaje
   - Verifica logs en Vercel dashboard

---

## ✅ Checklist

Antes de considerar que funciona:

- [ ] `.env.local` existe con API key correcta
- [ ] Servidor reiniciado (`taskkill /F /IM node.exe` + `pnpm dev`)
- [ ] Logs en consola dicen "API key exists: true"
- [ ] Logs dicen "✅ [OpenRouter] Usando API REAL"
- [ ] Al enviar mensaje, aparece "📤 [OpenRouter] Enviando mensaje"
- [ ] Aparece "✅ [OpenRouter] Content received"
- [ ] El diagrama se renderiza visualmente (no solo texto)

---

**Última actualización:** $(Get-Date -Format "yyyy-MM-dd HH:mm")


