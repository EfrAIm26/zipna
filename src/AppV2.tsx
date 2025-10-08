import { useState } from 'react'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { LoginPage } from './components/auth/LoginPage'
import { Sidebar } from './components/sidebar/Sidebar'
import { ChatContainerV2 } from './components/chat/ChatContainerV2'
import { MermaidRenderer } from './components/diagram/MermaidRenderer'
import { useChatStore } from './store/chatStore'
import { Sparkles, Loader2, PanelRightClose, PanelRightOpen } from 'lucide-react'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()
  const { currentDiagram } = useChatStore()
  const [showDiagramPanel, setShowDiagramPanel] = useState(true)

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center overflow-hidden fixed inset-0">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <Loader2 size={64} className="animate-spin text-blue-600 relative" />
          </div>
          <p className="text-gray-700 mt-6 font-medium text-lg">Loading Zipna...</p>
        </div>
      </div>
    )
  }

  // Login page
  if (!user) {
    return <LoginPage />
  }

  // Main app
  const hasDiagram = !!currentDiagram

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden fixed inset-0">
      {/* Sidebar - FIJO, sin scroll */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - FIJO, sin scroll */}
        <header className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={18} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Zipna</h1>
              </div>
            </div>

            {/* Toggle diagram panel button - siempre visible */}
            <button
              onClick={() => setShowDiagramPanel(!showDiagramPanel)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              {showDiagramPanel ? (
                <>
                  <PanelRightClose size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-700">Hide</span>
                </>
              ) : (
                <>
                  <PanelRightOpen size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-700">Show</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content area - flex-1 para ocupar el resto del espacio */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Chat panel - con scroll SOLO en mensajes */}
          <div
            className={`transition-all duration-300 flex-shrink-0 ${
              showDiagramPanel && hasDiagram ? 'w-[45%]' : 'w-full'
            } border-r border-gray-200 bg-white overflow-hidden flex flex-col`}
          >
            <ChatContainerV2 />
          </div>

          {/* Diagram panel - FIJO, sin scroll */}
          {showDiagramPanel && (
            <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
              {hasDiagram ? (
                <MermaidRenderer code={currentDiagram} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-500 text-sm">Your diagram will appear here</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AppV2() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default AppV2

