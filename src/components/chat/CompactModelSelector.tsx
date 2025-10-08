import { useState, useRef, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { AI_MODELS } from '../../lib/aiModels'
import { OpenAI, Anthropic, Perplexity, Google, XAI } from '@lobehub/icons'
import { Sparkles } from 'lucide-react'

interface CompactModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function CompactModelSelector({ selectedModel, onModelChange }: CompactModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0]

  const getModelIcon = (provider: string) => {
    const iconProps = { size: 18, className: "flex-shrink-0" }
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
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="max-h-80 overflow-y-auto">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left ${
                  selectedModel === model.id ? 'bg-blue-50' : ''
                }`}
              >
                {getModelIcon(model.provider)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">{model.name}</span>
                    {selectedModel === model.id && (
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botón compacto */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
        title={`Modelo: ${currentModel.name}`}
      >
        {getModelIcon(currentModel.provider)}
        <span className="font-medium text-gray-700 max-w-[100px] truncate">{currentModel.name}</span>
        <ChevronUp
          size={14}
          className={`text-gray-500 transition-transform ${isOpen ? '' : 'rotate-180'}`}
        />
      </button>
    </div>
  )
}

