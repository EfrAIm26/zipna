import { ChatContainer } from './components/chat/ChatContainer';
import { MermaidRenderer } from './components/diagram/MermaidRenderer';
import { useChatStore } from './store/chatStore';
import { Sparkles, FileText } from 'lucide-react';
import './App.css';

function App() {
  const { currentDiagram } = useChatStore();

  console.log('🎯 [App] Rendering with currentDiagram:', currentDiagram ? 'EXISTS' : 'NULL');
  console.log('📐 [App] Diagram length:', currentDiagram?.length || 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header fijo */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="text-blue-500" size={28} />
            <h1 className="text-2xl font-semibold text-gray-900">
              Zipna
            </h1>
          </div>
          <p className="text-center text-sm text-gray-600 mt-1">
            Crea diagramas Mermaid con IA - De texto a visualización
          </p>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chat Panel */}
        <div className="lg:w-[40%] border-r border-gray-200 flex flex-col h-[calc(100vh-120px)]">
          <ChatContainer />
        </div>

        {/* Diagram Panel */}
        <div className="lg:w-[60%] flex flex-col h-[calc(100vh-120px)]">
          {currentDiagram ? (
            <MermaidRenderer code={currentDiagram} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
              <FileText size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                El diagrama aparecerá aquí
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Describe un proceso o flujo en el chat y la IA generará un diagrama Mermaid que se mostrará en este panel.
              </p>
              <div className="mt-8 bg-white rounded-xl p-5 border border-gray-200 max-w-sm">
                <p className="text-xs font-semibold text-gray-700 mb-3">💡 Sugerencia:</p>
                <p className="text-xs text-gray-600">
                  Prueba escribiendo: <span className="font-mono bg-gray-100 px-2 py-1 rounded">"Proceso para hacer una pizza"</span>
                </p>
                <button
                  onClick={() => {
                    const testCode = `flowchart TD
    A[Test] --> B[Works!]
    B --> C[Success]`;
                    console.log('🧪 [Test Button] Setting test diagram');
                    useChatStore.getState().setCurrentDiagram(testCode);
                  }}
                  className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  🧪 Test Mermaid (Hardcoded)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 text-xs text-gray-500 border-t border-gray-200 bg-white">
        <p>Powered by OpenRouter • Mermaid.js • React + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;