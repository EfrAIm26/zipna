import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, File, FileSpreadsheet, X, Upload, Loader2 } from 'lucide-react'

interface UploadedFile {
  name: string
  type: string
  content: string
  size: number
}

interface FileUploadProps {
  onFilesProcessed: (files: UploadedFile[]) => void
}

export function FileUpload({ onFilesProcessed }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const processFile = async (file: File): Promise<UploadedFile | null> => {
    try {
      const fileType = file.type
      let content = ''

      if (fileType === 'application/pdf') {
        // Para PDFs, leemos como texto plano (simplificado)
        content = await file.text()
        content = `[PDF: ${file.name}]\n${content.substring(0, 5000)}...` // Limitamos contenido
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        // DOCX
        content = await file.text()
        content = `[DOCX: ${file.name}]\n${content.substring(0, 5000)}...`
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        fileType === 'application/vnd.ms-excel'
      ) {
        // Excel
        content = await file.text()
        content = `[Excel: ${file.name}]\n${content.substring(0, 5000)}...`
      } else if (fileType.startsWith('text/') || fileType === 'application/json') {
        // Archivos de texto
        content = await file.text()
      } else {
        throw new Error('Tipo de archivo no soportado')
      }

      return {
        name: file.name,
        type: fileType,
        content,
        size: file.size,
      }
    } catch (error) {
      console.error('Error processing file:', error)
      return null
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsProcessing(true)
      const processed: UploadedFile[] = []

      for (const file of acceptedFiles) {
        const processedFile = await processFile(file)
        if (processedFile) {
          processed.push(processedFile)
        }
      }

      setFiles((prev) => [...prev, ...processed])
      onFilesProcessed([...files, ...processed])
      setIsProcessing(false)
    },
    [files, onFilesProcessed]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/json': ['.json'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesProcessed(newFiles)
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="text-red-500" size={20} />
    if (type.includes('spreadsheet') || type.includes('excel'))
      return <FileSpreadsheet className="text-green-500" size={20} />
    return <File className="text-blue-500" size={20} />
  }

  return (
    <div className="space-y-2">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin text-blue-500" />
              <span>Procesando archivos...</span>
            </>
          ) : isDragActive ? (
            <>
              <Upload size={18} className="text-blue-500" />
              <span className="text-blue-600 font-medium">Suelta los archivos aquí</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span>
                <span className="font-medium text-blue-600">Arrastra archivos</span> o haz click
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 text-center mt-1">
          PDF, DOCX, Excel, TXT (max 10MB)
        </p>
      </div>

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


