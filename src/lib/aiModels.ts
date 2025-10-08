// Configuración de modelos de AI disponibles

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'xai' | 'perplexity';
  description: string;
  contextWindow: number;
  pricePerMillion: number;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'auto',
    name: 'Auto',
    provider: 'openai',
    description: 'Selección automática',
    contextWindow: 128000,
    pricePerMillion: 0.15,
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: 'Rápido y económico',
    contextWindow: 128000,
    pricePerMillion: 0.15,
  },
  {
    id: 'anthropic/claude-sonnet-4.5',
    name: 'Claude 4.5 Sonnet',
    provider: 'anthropic',
    description: 'Razonamiento avanzado',
    contextWindow: 1000000,
    pricePerMillion: 3.0,
  },
  {
    id: 'x-ai/grok-4-fast',
    name: 'Grok 4 Fast',
    provider: 'xai',
    description: 'Modelo de xAI',
    contextWindow: 2000000,
    pricePerMillion: 0.5,
  },
  {
    id: 'perplexity/llama-3.1-sonar-large-128k-online',
    name: 'Perplexity',
    provider: 'perplexity',
    description: 'Con internet',
    contextWindow: 127072,
    pricePerMillion: 1.0,
  },
  {
    id: 'google/gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    provider: 'google',
    description: 'Rápido y ligero',
    contextWindow: 1000000,
    pricePerMillion: 0.1,
  },
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'google',
    description: 'Avanzado de Google',
    contextWindow: 1000000,
    pricePerMillion: 0.3,
  },
];

export const DEFAULT_MODEL = 'auto';

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((model) => model.id === id);
}

export function getActualModel(selectedModel: string): string {
  // Si es "auto", usar GPT-4o Mini por defecto
  if (selectedModel === 'auto') {
    return 'openai/gpt-4o-mini';
  }
  return selectedModel;
}

