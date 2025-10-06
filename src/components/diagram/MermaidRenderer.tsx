import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Download, FileDown } from 'lucide-react';

interface MermaidRendererProps {
  code: string;
}

// Inicializar Mermaid una sola vez al importar el módulo
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

export function MermaidRenderer({ code }: MermaidRendererProps) {
  console.log('🎨 [MermaidRenderer] Component mounted/updated');
  console.log('📝 [MermaidRenderer] Received code:', code);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!code || !containerRef.current) {
      console.log('⚠️ [MermaidRenderer] No code or container ref');
      return;
    }

    let isCancelled = false;

    const renderDiagram = async () => {
      if (isRendering) {
        console.log('⏳ [MermaidRenderer] Already rendering, skipping...');
        return;
      }

      try {
        setIsRendering(true);
        setError(null);
        
        console.log('🚀 [MermaidRenderer] Starting render process...');
        console.log('📋 [MermaidRenderer] Code length:', code.length);
        
        // Generar ID único para cada render
        const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log('🆔 [MermaidRenderer] Generated ID:', uniqueId);

        // Limpiar contenedor
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // IMPORTANTE: Usar mermaid.render() con la API moderna
        console.log('⚙️ [MermaidRenderer] Calling mermaid.render()...');
        const { svg } = await mermaid.render(uniqueId, code);
        
        console.log('✅ [MermaidRenderer] SVG generated successfully');
        console.log('📏 [MermaidRenderer] SVG length:', svg.length);
        
        // Verificar si el componente todavía está montado
        if (isCancelled) {
          console.log('🚫 [MermaidRenderer] Render cancelled (component unmounted)');
          return;
        }

        // Insertar SVG en el DOM
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          console.log('✅ [MermaidRenderer] SVG inserted into DOM');
          
          // Verificar que el SVG realmente se insertó
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            console.log('✅ [MermaidRenderer] SVG element confirmed in DOM');
          } else {
            console.error('❌ [MermaidRenderer] SVG element NOT found in DOM!');
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('❌ [MermaidRenderer] Error rendering diagram:', err);
          console.error('❌ [MermaidRenderer] Error details:', {
            message: err instanceof Error ? err.message : String(err),
            code: code.substring(0, 200),
          });
          setError(err instanceof Error ? err.message : 'Error al renderizar el diagrama');
        }
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };

    renderDiagram();

    // Cleanup function
    return () => {
      console.log('🧹 [MermaidRenderer] Cleanup');
      isCancelled = true;
    };
  }, [code]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
  };

  const handleDownloadPNG = async () => {
    if (!containerRef.current) return;
    
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    try {
      // Crear canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Obtener dimensiones del SVG
      const svgRect = svgElement.getBoundingClientRect();
      canvas.width = svgRect.width * 2; // 2x para mejor calidad
      canvas.height = svgRect.height * 2;

      // Convertir SVG a imagen
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // Fondo blanco
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar imagen
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Descargar
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error en el diagrama</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
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
            title="Descargar PNG"
          >
            <Download size={16} />
            <span className="hidden sm:inline">PNG</span>
          </button>
          <button
            onClick={handleDownloadSVG}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm font-medium"
            title="Descargar SVG"
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
    </div>
  );
}

