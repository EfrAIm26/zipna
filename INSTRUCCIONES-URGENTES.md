# 🚨 INSTRUCCIONES URGENTES - 3 PASOS

## ✅ **PASO 1: Obtén tu API Key** (2 minutos)

1. **Abre:** https://openrouter.ai/keys
2. **Inicia sesión** o regístrate (gratis)
3. **Haz clic** en "Create Key"
4. **COPIA** la API key completa (empieza con `sk-or-v1-...`)

## ✅ **PASO 2: Edita `.env.local`** (30 segundos)

1. **Abre el archivo** `.env.local` (está en la raíz del proyecto)
2. **Verás esto:**
   ```
   VITE_OPENROUTER_API_KEY=REEMPLAZA_ESTO_CON_TU_API_KEY
   ```

3. **REEMPLAZA** `REEMPLAZA_ESTO_CON_TU_API_KEY` con tu API key real

**EJEMPLO:**

❌ **MAL (antes):**
```
VITE_OPENROUTER_API_KEY=REEMPLAZA_ESTO_CON_TU_API_KEY
```

✅ **BIEN (después):**
```
VITE_OPENROUTER_API_KEY=sk-or-v1-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdef
```

4. **GUARDA** el archivo (Ctrl+S)

## ✅ **PASO 3: Reinicia el Servidor** (30 segundos)

```powershell
taskkill /F /IM node.exe
Start-Sleep -Seconds 2
pnpm dev
```

---

## 🧪 **VERIFICA QUE FUNCIONA**

1. **Abre:** http://localhost:5173
2. **Presiona F12** → Console
3. **Escribe "test"** en el chat
4. **Busca en la consola:**

### ✅ **SI FUNCIONA (debe decir esto):**
```
🔍 [OpenRouter] API key exists: true
🔍 [OpenRouter] API key length: 64 (o similar)
✅ [OpenRouter] Usando API REAL
📤 [OpenRouter] Enviando mensaje: test
```

### ❌ **SI NO FUNCIONA (dice esto):**
```
🔍 [OpenRouter] API key exists: false
🔧 MODO MOCK: Usando respuestas simuladas
```

---

## 📝 **SOBRE EL ÍCONO DE TACHADURA**

**¿Por qué `.env.local` tiene un círculo con tachón?**

✅ **ES NORMAL**. Significa que está en `.gitignore` (NO se subirá a GitHub).  
✅ **ES CORRECTO**. Así proteges tu API key de ser pública.  
✅ **NO ES UN ERROR**. Es una característica de seguridad.

El problema NO era el ícono, era que el archivo estaba **VACÍO**.

---

## 🎯 **RESUMEN**

1. ✅ **Archivo creado:** `.env.local` ahora tiene contenido
2. ⏳ **Tu turno:** Reemplaza `REEMPLAZA_ESTO_CON_TU_API_KEY` con tu API key real
3. ⏳ **Reinicia:** `taskkill /F /IM node.exe` y `pnpm dev`
4. ⏳ **Verifica:** Logs deben decir "API key exists: true"

---

**SIN ESTOS 3 PASOS, NO FUNCIONARÁ.**

El código está correcto. El modelo está correcto. Solo falta TU API KEY.


