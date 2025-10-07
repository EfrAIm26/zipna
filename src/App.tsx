import { useAuth, AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatContainer } from './components/chat/ChatContainer';
import { MermaidRenderer } from './components/diagram/MermaidRenderer';
import { useChatStore } from './store/chatStore';
import { Sparkles, FileText, Loader2 } from 'lucide-react';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const { currentDiagram } = useChatStore();

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar login
  if (!user) {
    return <LoginPage />;
  }

  // Usuario autenticado - mostrar app principal
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="text-blue-500" size={24} />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Zipna</h1>
                <p className="text-xs text-gray-600">Diagramas Mermaid con IA</p>
              </div>
            </div>
          </div>
        </header>

        {/* Split View: Chat + Diagram */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Panel - 40% */}
          <div className="w-[40%] border-r border-gray-200 bg-white">
            <ChatContainer />
          </div>

          {/* Diagram Panel - 60% */}
          <div className="w-[60%] bg-gray-50">
            {currentDiagram ? (
              <MermaidRenderer code={currentDiagram} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <FileText size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Tu diagrama aparecerá aquí
                </h3>
                <p className="text-sm text-gray-500 text-center max-w-md mb-6">
                  Selecciona un chat y describe un proceso, flujo o sistema. La IA generará un diagrama Mermaid visual.
                </p>
                <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md">
                  <p className="text-xs font-semibold text-gray-700 mb-3">💡 Ejemplos de prompts:</p>
                  <ul className="text-xs text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>"Proceso de autenticación de usuario"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>"Flujo de compra en ecommerce"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>"Arquitectura de una API REST"</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;