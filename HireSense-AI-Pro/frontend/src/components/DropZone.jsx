/**
 * HireSense-AI — Drag-and-Drop Upload Zone Component
 */
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'

export default function DropZone({ onFileSelect, accept = '.pdf,.docx' }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    setError(null)
    if (rejected.length > 0) {
      setError('Invalid file type. Please upload a PDF or DOCX file.')
      return
    }
    if (accepted.length > 0) {
      const f = accepted[0]
      if (f.size > 5 * 1024 * 1024) {
        setError('File too large. Maximum size is 5MB.')
        return
      }
      setFile(f)
      onFileSelect(f)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const removeFile = (e) => {
    e.stopPropagation()
    setFile(null)
    onFileSelect(null)
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
          ${isDragActive
            ? 'border-brand-400 bg-brand-500/10 scale-[1.01]'
            : file
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-white/10 hover:border-brand-500/50 hover:bg-brand-500/5'
          }`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="text-emerald-400" size={28} />
              </div>
              <div>
                <p className="font-semibold text-emerald-300">{file.name}</p>
                <p className="text-sm text-slate-400 mt-1">
                  {(file.size / 1024).toFixed(1)} KB — Ready to analyze
                </p>
              </div>
              <button
                onClick={removeFile}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors mt-1"
              >
                <X size={12} /> Remove file
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDragActive ? 'bg-brand-500/30 scale-110' : 'bg-white/5'
              }`}>
                {isDragActive
                  ? <Upload className="text-brand-400 animate-bounce" size={30} />
                  : <FileText className="text-slate-400" size={30} />
                }
              </div>
              <div>
                <p className="font-semibold text-slate-200">
                  {isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  or <span className="text-brand-400 underline underline-offset-2">click to browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-2">PDF or DOCX · Max 5MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 mt-2 flex items-center gap-1.5"
        >
          <X size={13} /> {error}
        </motion.p>
      )}
    </div>
  )
}
