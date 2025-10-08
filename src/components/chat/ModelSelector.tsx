import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Sparkles } from 'lucide-react'
import { AI_MODELS } from '../../lib/aiModels'
import { OpenAI, Anthropic, Perplexity, Google, XAI } from '@lobehub/icons'

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0]

  const getModelIcon = (provider: string, size = 24) => {
    const iconProps = { size, className: "flex-shrink-0" }
    switch (provider) {
      case 'openai':
        return <OpenAI {...iconProps} />
      case 'anthropic':
        return <Anthropic {...iconProps} />
      case 'google':
        return <Google {...iconProps} />
      case 'xai':
        return <XAI {...iconProps} />
      case 'perplexity':
        return <Perplexity {...iconProps} />
      default:
        return <Sparkles {...iconProps} />
    }
  }

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white hover:border-gray-300 transition-all shadow-sm hover:shadow-md group"
      >
        {getModelIcon(currentModel.provider, 24)}
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-900">{currentModel.name}</span>
          <span className="text-xs text-gray-500">{currentModel.provider}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 group-hover:text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 backdrop-blur-xl">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200/50">
            <h3 className="text-sm font-semibold text-gray-900">Selecciona un modelo de IA</h3>
            <p className="text-xs text-gray-600 mt-0.5">Elige el modelo según tus necesidades</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  selectedModel === model.id ? 'bg-blue-50/50' : ''
                }`}
              >
                {/* Icono del modelo */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedModel === model.id
                        ? 'bg-blue-100 ring-2 ring-blue-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    {getModelIcon(model.provider, 20)}
                  </div>
                </div>

                {/* Info del modelo */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{model.name}</span>
                    {selectedModel === model.id && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{model.description}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-500">
                      {model.contextWindow.toLocaleString()} tokens
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      ${model.pricePerMillion}/1M tokens
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-200/50">
            <p className="text-xs text-gray-500 text-center">
              💡 <span className="font-medium">Auto</span> selecciona el mejor modelo automáticamente
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

