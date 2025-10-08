import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Download, FileDown } from 'lucide-react';

interface MermaidRendererProps {
  code: string;
}

// Inicializar Mermaid una sola vez
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
  },
});

export function MermaidRenderer({ code: initialCode }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isRendering, setIsRendering] = useState(false);
  const [activeTab, setActiveTab] = useState<'view' | 'code'>('view');
  const [editableCode, setEditableCode] = useState(initialCode);
  const [codeToRender, setCodeToRender] = useState(initialCode);

  // Actualizar código editable cuando cambia el prop
  useEffect(() => {
    setEditableCode(initialCode);
    setCodeToRender(initialCode);
  }, [initialCode]);

  // Renderizar diagrama
  useEffect(() => {
    if (!codeToRender || !containerRef.current || activeTab !== 'view') {
      return;
    }

    let isCancelled = false;

    const renderDiagram = async () => {
      if (isRendering) return;

      try {
        setIsRendering(true);
        
        const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        const { svg } = await mermaid.render(uniqueId, codeToRender);
        
        if (isCancelled) return;

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error rendering diagram:', err);
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="text-red-600 p-4 bg-red-50 rounded-lg">
                <p class="font-semibold mb-2">Diagram Error</p>
                <p class="text-sm">${err instanceof Error ? err.message : 'Error rendering diagram'}</p>
              </div>
            `;
          }
        }
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [codeToRender, activeTab]);

  const handleApplyCode = () => {
    setCodeToRender(editableCode);
    setActiveTab('view');
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => setZoom(1);

  const handleDownloadPNG = async () => {
    if (!containerRef.current) return;
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const svgRect = svgElement.getBoundingClientRect();
      canvas.width = svgRect.width * 2;
      canvas.height = svgRect.height * 2;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.download = `zipna-diagram-${Date.now()}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
          }
        });
        
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (err) {
      console.error('Error downloading PNG:', err);
    }
  };

  const handleDownloadSVG = () => {
    if (!containerRef.current) return;
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.download = `zipna-diagram-${Date.now()}.svg`;
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading SVG:', err);
    }
  };


  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 pt-3 border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('view')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'view'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 border-b-0'
          }`}
        >
          View
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'code'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 border-b-0'
          }`}
        >
          Code
        </button>
      </div>

      {activeTab === 'view' ? (
        <>
          {/* Toolbar - Solo en View */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={18} className="text-gray-700" />
              </button>
              <span className="text-sm text-gray-600 font-medium min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={18} className="text-gray-700" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors ml-2"
                title="Reset Zoom"
              >
                <RotateCcw size={18} className="text-gray-700" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPNG}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                title="Download PNG"
              >
                <Download size={16} />
                <span className="hidden sm:inline">PNG</span>
              </button>
              <button
                onClick={handleDownloadSVG}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm font-medium"
                title="Download SVG"
              >
                <FileDown size={16} />
                <span className="hidden sm:inline">SVG</span>
              </button>
            </div>
          </div>

          {/* Diagram Container */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="flex items-center justify-center min-h-full">
              <div
                ref={containerRef}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out',
                }}
                className="mermaid-container"
              />
            </div>
          </div>
        </>
      ) : (
        /* Code Editor */
        <div className="flex-1 flex flex-col p-4 bg-gray-50">
          <textarea
            value={editableCode}
            onChange={(e) => setEditableCode(e.target.value)}
            className="flex-1 bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            spellCheck={false}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                setEditableCode(codeToRender);
                setActiveTab('view');
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyCode}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              Apply & View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
