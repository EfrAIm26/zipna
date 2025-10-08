// Utilidades generales

export interface ExtractedContent {
  mermaidCode: string | null;
  explanation: string;
}

/**
 * Extrae código Mermaid y explicación de un texto
 * @param text - Texto que puede contener ```mermaid...``` y explicación
 * @returns Objeto con código Mermaid y explicación separados
 */
export function extractContent(text: string): ExtractedContent {
  console.log('🔍 [extractContent] Input text:', text.substring(0, 200));
  
  // Buscar bloque de código mermaid
  const mermaidRegex = /```mermaid\s*([\s\S]*?)```/i;
  const match = text.match(mermaidRegex);
  
  if (match && match[1]) {
    const mermaidCode = match[1].trim();
    
    // Extraer todo el texto DESPUÉS del bloque de código
    const afterCodeIndex = text.indexOf('```', match.index! + 10) + 3;
    const explanation = text.substring(afterCodeIndex).trim();
    
    console.log('✅ [extractContent] Mermaid code extracted, length:', mermaidCode.length);
    console.log('📝 [extractContent] Explanation length:', explanation.length);
    
    return {
      mermaidCode,
      explanation: explanation || '✅ Diagrama generado exitosamente'
    };
  }
  
  // Si no hay bloques de código, verificar si es código Mermaid directo
  const trimmedText = text.trim();
  if (
    trimmedText.startsWith('graph') ||
    trimmedText.startsWith('flowchart') ||
    trimmedText.startsWith('sequenceDiagram') ||
    trimmedText.startsWith('classDiagram') ||
    trimmedText.startsWith('stateDiagram') ||
    trimmedText.startsWith('erDiagram') ||
    trimmedText.startsWith('journey') ||
    trimmedText.startsWith('gantt') ||
    trimmedText.startsWith('pie') ||
    trimmedText.startsWith('mindmap')
  ) {
    console.log('✅ [extractContent] Detected direct Mermaid code');
    return {
      mermaidCode: trimmedText,
      explanation: '✅ Diagrama generado exitosamente'
    };
  }
  
  // No hay código Mermaid, todo es explicación/texto
  console.log('ℹ️ [extractContent] No Mermaid code found, returning as explanation');
  return {
    mermaidCode: null,
    explanation: text
  };
}

/**
 * Mantener compatibilidad con código existente
 */
export function extractMermaidCode(text: string): string | null {
  return extractContent(text).mermaidCode;
}

/**
 * Genera un ID único para elementos
 */
export function generateId(): string {
  return `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

