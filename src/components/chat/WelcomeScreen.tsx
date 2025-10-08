import { Bot } from 'lucide-react'

interface WelcomeScreenProps {
  onExampleClick: (prompt: string) => void
}

interface Example {
  prompt: string
  label: string
}

interface Category {
  name: string
  icon: string
  examples: Example[]
}

const categories: Category[] = [
  {
    name: 'Mindmap',
    icon: '🧠',
    examples: [
      { label: 'French Revolution', prompt: 'Create a mindmap about the French Revolution' },
      { label: 'Industrial Revolution', prompt: 'Create a mindmap about the Industrial Revolution' },
      { label: 'Artificial Intelligence', prompt: 'Create a mindmap about Artificial Intelligence concepts' },
      { label: 'Climate Change', prompt: 'Create a mindmap about Climate Change and its impacts' },
    ],
  },
  {
    name: 'Flowchart',
    icon: '🔄',
    examples: [
      { label: 'AI Money Flows', prompt: 'Create a flowchart showing AI money flows' },
      { label: 'User Authentication', prompt: 'Create a flowchart for user authentication process' },
      { label: 'E-commerce Checkout', prompt: 'Create a flowchart for e-commerce checkout process' },
      { label: 'Software Development', prompt: 'Create a flowchart of software development lifecycle' },
    ],
  },
  {
    name: 'Quadrant',
    icon: '📊',
    examples: [
      { label: 'Product Priority Matrix', prompt: 'Create a quadrant chart for product priority matrix with urgency and importance' },
      { label: 'Risk Assessment', prompt: 'Create a quadrant chart for risk assessment with impact vs likelihood' },
      { label: 'Market Analysis', prompt: 'Create a quadrant chart for market analysis with market share vs growth' },
      { label: 'Customer Segmentation', prompt: 'Create a quadrant chart for customer segmentation with engagement vs reach' },
    ],
  },
  {
    name: 'Pie',
    icon: '🥧',
    examples: [
      { label: 'US Population by Ethnicity', prompt: 'Create a pie chart of US population by ethnicity' },
      { label: 'Global Energy Sources', prompt: 'Create a pie chart showing global energy sources distribution' },
      { label: 'Tech Market Share', prompt: 'Create a pie chart of smartphone market share' },
      { label: 'Budget Allocation', prompt: 'Create a pie chart for company budget allocation' },
    ],
  },
  {
    name: 'Sankey',
    icon: '🌊',
    examples: [
      { label: 'Alphabet Income Statement', prompt: 'Create a Sankey diagram for Alphabet income statement' },
      { label: 'Meta Income Statement', prompt: 'Create a Sankey diagram for Meta income statement' },
      { label: 'Energy Flow', prompt: 'Create a Sankey diagram showing global energy flow' },
      { label: 'Website Traffic Flow', prompt: 'Create a Sankey diagram for website traffic flow' },
    ],
  },
]

export function WelcomeScreen({ onExampleClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-600 text-center px-6 py-8 overflow-y-auto">
      <Bot size={56} className="mb-4 text-gray-400" />
      <p className="text-xl font-semibold mb-2 text-gray-900">Welcome to Zipna!</p>
      <p className="text-base max-w-md text-gray-600 mb-8">
        Choose a category and example to get started
      </p>

      {/* Categories Grid */}
      <div className="w-full max-w-6xl space-y-8">
        {categories.map((category) => (
          <div key={category.name}>
            {/* Category Header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{category.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            </div>

            {/* Examples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => onExampleClick(example.prompt)}
                  className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 rounded-xl p-6 text-left transition-all duration-300 group shadow-sm hover:shadow-md transform hover:-translate-y-1"
                >
                  <p className="text-base font-semibold text-gray-800 group-hover:text-blue-700 leading-relaxed">
                    {example.label}
                  </p>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-2xl group-hover:from-blue-200/40 group-hover:to-purple-200/40 transition-all duration-300 -mr-10 -mt-10"></div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

