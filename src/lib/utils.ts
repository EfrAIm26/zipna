// Utilidades generales

/**
 * Extrae código Mermaid de un texto que puede contener bloques de código
 * @param text - Texto que puede contener ```mermaid...```
 * @returns Código Mermaid sin los delimitadores, o null si no se encuentra
 */
export function extractMermaidCode(text: string): string | null {
  console.log('🔍 [extractMermaidCode] Input text:', text.substring(0, 200));
  
  // Buscar bloque de código mermaid
  const mermaidRegex = /```mermaid\s*([\s\S]*?)```/i;
  const match = text.match(mermaidRegex);
  
  if (match && match[1]) {
    const extracted = match[1].trim();
    console.log('✅ [extractMermaidCode] Extracted from block:', extracted.substring(0, 100));
    return extracted;
  }
  
  // Si no hay bloques de código, verificar si es código Mermaid directo
  // (por si la IA responde sin los delimitadores)
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
    console.log('✅ [extractMermaidCode] Detected direct Mermaid code');
    return trimmedText;
  }
  
  console.log('❌ [extractMermaidCode] No Mermaid code found');
  return null;
}

/**
 * Genera un ID único para elementos
 */
export function generateId(): string {
  return `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

