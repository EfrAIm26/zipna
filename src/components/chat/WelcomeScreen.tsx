import { useState } from 'react'

interface WelcomeScreenProps {
  onExampleClick: (prompt: string) => void
}

interface Example {
  prompt: string
  label: string
}

interface Category {
  name: string
  image: string
  examples: Example[]
}

const categories: Category[] = [
  {
    name: 'Mindmap',
    image: '/mindmap-example.png',
    examples: [
      { label: 'French Revolution', prompt: 'Create a mindmap about the French Revolution' },
      { label: 'Industrial Revolution', prompt: 'Create a mindmap about the Industrial Revolution' },
      { label: 'Artificial Intelligence', prompt: 'Create a mindmap about Artificial Intelligence concepts' },
      { label: 'Climate Change', prompt: 'Create a mindmap about Climate Change and its impacts' },
    ],
  },
  {
    name: 'Flowchart',
    image: '/flowchart-example.png',
    examples: [
      { label: 'AI Money Flows', prompt: 'Create a flowchart showing AI money flows' },
      { label: 'User Authentication', prompt: 'Create a flowchart for user authentication process' },
      { label: 'E-commerce Checkout', prompt: 'Create a flowchart for e-commerce checkout process' },
      { label: 'Software Development', prompt: 'Create a flowchart of software development lifecycle' },
    ],
  },
  {
    name: 'Quadrant',
    image: '/quadrant-example.png',
    examples: [
      { label: 'Product Priority Matrix', prompt: 'Create a quadrant chart for product priority matrix with urgency and importance' },
      { label: 'Risk Assessment', prompt: 'Create a quadrant chart for risk assessment with impact vs likelihood' },
      { label: 'Market Analysis', prompt: 'Create a quadrant chart for market analysis with market share vs growth' },
      { label: 'Customer Segmentation', prompt: 'Create a quadrant chart for customer segmentation with engagement vs reach' },
    ],
  },
  {
    name: 'Pie',
    image: '/pie-example.png',
    examples: [
      { label: 'US Population by Ethnicity', prompt: 'Create a pie chart of US population by ethnicity' },
      { label: 'Global Energy Sources', prompt: 'Create a pie chart showing global energy sources distribution' },
      { label: 'Tech Market Share', prompt: 'Create a pie chart of smartphone market share' },
      { label: 'Budget Allocation', prompt: 'Create a pie chart for company budget allocation' },
    ],
  },
  {
    name: 'Sankey',
    image: '/sankey-example.png',
    examples: [
      { label: 'Alphabet Income Statement', prompt: 'Create a Sankey diagram for Alphabet income statement' },
      { label: 'Meta Income Statement', prompt: 'Create a Sankey diagram for Meta income statement' },
      { label: 'Energy Flow', prompt: 'Create a Sankey diagram showing global energy flow' },
      { label: 'Website Traffic Flow', prompt: 'Create a Sankey diagram for website traffic flow' },
    ],
  },
]

export function WelcomeScreen({ onExampleClick }: WelcomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<number>(0)

  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      <div className="flex flex-col items-center justify-center">
        {/* Logo and Title */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src="/favicon-zipna.ico.png"
            alt="Zipna"
            className="w-16 h-16 mb-4 object-contain"
          />
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent text-center">
            How can I help you?
          </h2>
        </div>

        {/* Categories */}
        <div className="flex gap-6 mb-8 flex-wrap justify-center items-center">
        {categories.map((category, idx) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(idx)}
            className={`group relative transition-all duration-300 flex flex-col items-center ${
              selectedCategory === idx ? 'scale-105' : 'scale-100 hover:scale-102'
            }`}
          >
            <div
              className={`relative overflow-hidden rounded-xl p-1 transition-all duration-300 ${
                selectedCategory === idx
                  ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-cyan-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                  : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:shadow-lg'
              }`}
            >
              <div className="bg-white rounded-lg p-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
            <p
              className={`mt-3 text-sm font-semibold ${
                selectedCategory === idx ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              {category.name}
            </p>
          </button>
        ))}
      </div>

        {/* Examples */}
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-2 gap-5">
          {categories[selectedCategory].examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => onExampleClick(example.prompt)}
              className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 border-2 border-gray-200 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] rounded-xl p-6 text-left transition-all duration-300 group shadow-sm hover:shadow-lg transform hover:-translate-y-1"
            >
              <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 leading-relaxed">
                {example.label}
              </p>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-xl group-hover:from-blue-200/30 group-hover:to-purple-200/30 transition-all duration-300 -mr-8 -mt-8"></div>
            </button>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}

