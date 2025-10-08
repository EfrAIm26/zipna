// Helpers para funcionalidades de chat

/**
 * Genera un título de chat basado en el primer mensaje del usuario
 * @param message - Primer mensaje del usuario
 * @returns Título generado (max 50 caracteres)
 */
export function generateChatTitle(message: string): string {
  // Limpiar el mensaje
  const cleaned = message.trim().replace(/\s+/g, ' ')
  
  // Si es muy corto, usar tal cual
  if (cleaned.length <= 50) {
    return cleaned
  }
  
  // Truncar a 50 caracteres y agregar puntos suspensivos
  return cleaned.substring(0, 47) + '...'
}

/**
 * Actualiza el título de un chat si aún es el título por defecto
 * @param currentTitle - Título actual del chat
 * @param _firstMessage - Primer mensaje del usuario (no usado actualmente)
 * @returns true si debe actualizarse
 */
export function shouldUpdateChatTitle(currentTitle: string, _firstMessage: string): boolean {
  const defaultTitles = ['Nuevo Chat', 'New Chat', 'Chat sin título']
  return defaultTitles.includes(currentTitle)
}

