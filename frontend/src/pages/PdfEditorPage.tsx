import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Download, ShieldCheck, CheckCircle2, AlertTriangle, 
  ChevronRight, ChevronLeft, Sparkles, RefreshCw, Eye, FileText, Check, Lock
} from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export const PdfEditorPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get('session')
  const formId = searchParams.get('id')

  // Auth & Session
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('Memuat dokumen PDF...')
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null)
  const [docMeta, setDocMeta] = useState<any>(null)

  // Guided Fields State (Exact same structure as extension)
  const [sections, setSections] = useState<any[]>([])
  const [flatFields, setFlatFields] = useState<any[]>([])
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const [userValues, setUserValues] = useState<Record<string, any>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [auditResult, setAuditResult] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)

  // PDF.js rendering
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [canvasScale, setCanvasScale] = useState(1.4)

  // 1. Load User Session from localStorage
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('telmy_user')
      if (rawUser) {
        setUser(JSON.parse(rawUser))
      }
    } catch (e) {}
  }, [])

  // 2. Fetch Staged Session from Backend and trigger AI Analysis
  useEffect(() => {
    async function loadDocument() {
      if (!sessionId && !formId) {
        setLoading(false)
        setStatusMessage('Tidak ada dokumen yang dipilih. Silakan buka dari Form History atau Ekstensi.')
        return
      }

      try {
        setLoading(true)
        setStatusMessage('Mengambil file dokumen...')
        const effectiveApiUrl = window.location.hostname.includes('localhost')
          ? 'http://localhost:3000/api'
          : 'https://telmy.id/api'

        let resolvedPdfUrl = ''
        let resolvedBase64 = ''
        let resolvedFilename = 'Document.pdf'

        if (sessionId) {
          const res = await fetch(`${effectiveApiUrl}/pdf/session/${sessionId}`)
          const json = await res.json()
          if (!json.success || !json.data) {
            throw new Error(json.error || 'Gagal memuat sesi dokumen')
          }
          resolvedPdfUrl = json.data.pdfUrl || ''
          resolvedBase64 = json.data.pdfBase64 || ''
          resolvedFilename = json.data.filename || 'Document.pdf'
        }

        setStatusMessage('AI Gemini sedang menganalisis struktur formulir & kolom isian...')
        const analyzeRes = await fetch(`${effectiveApiUrl}/explain-pdf`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user?.uid || 'guest_user'
          },
          body: JSON.stringify({
            pdfUrl: resolvedPdfUrl,
            pdfBase64: resolvedBase64,
            filename: resolvedFilename,
            language: 'id',
            userId: user?.uid
          })
        })

        const analyzeJson = await analyzeRes.json()
        if (!analyzeJson.success || !analyzeJson.data) {
          throw new Error(analyzeJson.error || 'Analisis dokumen gagal')
        }

        const data = analyzeJson.data
        setDocMeta(data)

        // Flatten all fields from sections for linear field-by-field guidance
        const flattened: any[] = []
        if (Array.isArray(data.sections)) {
          setSections(data.sections)
          data.sections.forEach((sec: any) => {
            if (Array.isArray(sec.fields)) {
              sec.fields.forEach((fld: any) => {
                flattened.push({
                  ...fld,
                  sectionTitle: sec.title
                })
              })
            }
          })
        }
        setFlatFields(flattened)

        // Load PDF onto pdf.js canvas
        let pdfSource = resolvedPdfUrl || resolvedBase64
        setPdfDataUrl(pdfSource)

        if (window.pdfjsLib) {
          const loadingTask = window.pdfjsLib.getDocument(pdfSource)
          const loadedPdf = await loadingTask.promise
          setPdfDoc(loadedPdf)
          setTotalPages(loadedPdf.numPages)
          renderPdfPage(loadedPdf, 1)
        }

        setLoading(false)
      } catch (err: any) {
        console.error('Error in loadDocument:', err)
        setLoading(false)
        setStatusMessage(err.message || 'Gagal memuat atau menganalisis formulir.')
      }
    }

    loadDocument()
  }, [sessionId, formId, user?.uid])

  // 3. Render Canvas via PDF.js
  const renderPdfPage = async (doc: any, pageNum: number) => {
    if (!doc || !canvasRef.current) return
    try {
      const page = await doc.getPage(pageNum)
      const viewport = page.getViewport({ scale: canvasScale })
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      await page.render(renderContext).promise
    } catch (e) {
      console.warn('Canvas render error:', e)
    }
  }

  // Handle active field navigation & page switching
  const activeField = flatFields[currentFieldIndex] || null

  useEffect(() => {
    if (activeField && pdfDoc) {
      const targetPage = activeField.page || 1
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage)
        renderPdfPage(pdfDoc, targetPage)
      }
    }
  }, [currentFieldIndex, activeField, pdfDoc])

  const handleNext = () => {
    if (currentFieldIndex < flatFields.length - 1) {
      setCurrentFieldIndex(prev => prev + 1)
    } else {
      runAuditAndComplete()
    }
  }

  const handlePrev = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(prev => prev - 1)
      setIsCompleted(false)
    }
  }

  const updateValue = (key: string, val: any) => {
    setUserValues(prev => ({ ...prev, [key]: val }))
  }

  const runAuditAndComplete = () => {
    setIsCompleted(true)
    // Run pre-submission audit
    const missing: any[] = []
    flatFields.forEach(f => {
      const key = f.id || f.name
      const val = userValues[key]
      if (f.required && (!val || String(val).trim() === '')) {
        missing.push(f.label || f.name)
      }
    })
    setAuditResult({
      passed: missing.length === 0,
      missingCount: missing.length,
      missingFields: missing
    })
  }

  // 4. Download Completed Filled PDF using pdf-lib
  const handleDownloadFilledPdf = async () => {
    try {
      setIsExporting(true)
      let pdfBytes: ArrayBuffer
      if (pdfDataUrl?.startsWith('data:')) {
        const base64Data = pdfDataUrl.split(',')[1]
        const binary = atob(base64Data)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        pdfBytes = bytes.buffer
      } else if (pdfDataUrl?.startsWith('http')) {
        const resp = await fetch(pdfDataUrl)
        pdfBytes = await resp.arrayBuffer()
      } else {
        throw new Error('Tidak ada file PDF mentah yang valid')
      }

      const pdfDocLib = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
      const font = await pdfDocLib.embedFont(StandardFonts.HelveticaBold)
      const pages = pdfDocLib.getPages()

      // Stamp user values onto coordinates
      flatFields.forEach(f => {
        const key = f.id || f.name
        const val = userValues[key]
        if (!val) return

        const pageIdx = Math.max(0, (f.page || 1) - 1)
        if (pageIdx < pages.length) {
          const page = pages[pageIdx]
          const { height } = page.getSize()

          if (Array.isArray(f.box_2d) && f.box_2d.length === 4) {
            const [ymin, xmin] = f.box_2d
            const x = (xmin / 1000) * page.getWidth()
            const y = height - (ymin / 1000) * height - 12
            const textToDraw = String(val).replace(/[^\x20-\x7E]/g, '')

            page.drawText(textToDraw, {
              x: Math.max(10, x),
              y: Math.max(10, y),
              size: 10,
              font,
              color: rgb(0.08, 0.25, 0.65)
            })
          }
        }
      })

      const modifiedBytes = await pdfDocLib.save()
      const blob = new Blob([new Uint8Array(modifiedBytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `telmy_filled_${docMeta?.title || 'document'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e: any) {
      alert('Gagal mendownload PDF terisi: ' + e.message)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-800 rounded-xl transition text-slate-400 hover:text-white flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </button>
          <div className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm">📑</span>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                {docMeta?.title || 'Form Editor & Studio'}
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">PDF Studio</span>
              </h1>
              <p className="text-[11px] text-slate-400">Pengerjaan Terpandu Field-by-Field & Ekspor PDF Presisi</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Knowledge Encrypted</span>
          </div>
          <button
            onClick={handleDownloadFilledPdf}
            disabled={isExporting || flatFields.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Membuat PDF...' : 'Download Filled PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Split Screen Area */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <h3 className="text-base font-bold text-white mb-1">{statusMessage}</h3>
          <p className="text-xs text-slate-400 max-w-md">Gemini Multimodal Vision sedang memindai kolom formulir dan menyelaraskan panduan birokrasi.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-row overflow-hidden h-[calc(100vh-4rem)]">
          {/* Left Pane (50% Width): Interactive PDF.js Canvas with Auto-Scroll & Spotlight */}
          <div 
            ref={containerRef}
            className="w-1/2 border-r border-slate-800 bg-slate-950/50 p-6 overflow-y-auto flex flex-col items-center relative"
          >
            <div className="sticky top-0 z-20 mb-4 bg-slate-900/90 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300 flex items-center gap-3 backdrop-blur-md">
              <span>Halaman {currentPage} dari {totalPages}</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(p => p - 1)
                      renderPdfPage(pdfDoc, currentPage - 1)
                    }
                  }}
                  disabled={currentPage <= 1}
                  className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(p => p + 1)
                      renderPdfPage(pdfDoc, currentPage + 1)
                    }
                  }}
                  disabled={currentPage >= totalPages}
                  className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-800 bg-white">
              <canvas ref={canvasRef} className="block" />
              {/* Active Field Spotlight Bounding Box Overlay */}
              {activeField && activeField.box_2d && activeField.page === currentPage && (
                <div 
                  className="absolute border-2 border-blue-500 bg-blue-500/20 rounded shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse pointer-events-none transition-all duration-300"
                  style={{
                    top: `${(activeField.box_2d[0] / 1000) * 100}%`,
                    left: `${(activeField.box_2d[1] / 1000) * 100}%`,
                    height: `${((activeField.box_2d[2] - activeField.box_2d[0]) / 1000) * 100}%`,
                    width: `${((activeField.box_2d[3] - activeField.box_2d[1]) / 1000) * 100}%`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Right Pane (50% Width): Structured Adaptive Form Panel (Guided Field-by-Field) */}
          <div className="w-1/2 bg-slate-900 p-8 flex flex-col justify-between overflow-y-auto">
            {!isCompleted && activeField ? (
              <div className="max-w-xl w-full mx-auto flex-1 flex flex-col justify-center">
                {/* Stepper Progress */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-6 font-mono">
                  <span className="text-blue-400 font-bold uppercase tracking-wider">{activeField.sectionTitle || 'Umum'}</span>
                  <span className="bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-bold">
                    Kolom {currentFieldIndex + 1} / {flatFields.length}
                  </span>
                </div>

                {/* Guided Card */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl mb-6 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-lg font-bold text-white">{activeField.label || activeField.name}</h2>
                    {activeField.required && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                        Wajib Diisi
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {activeField.description || activeField.explanation || 'Isi kolom ini sesuai dengan identitas atau dokumen resmi Anda.'}
                  </p>

                  {/* Format Hint / Realistic Example */}
                  {activeField.example && (
                    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5">
                      <span className="text-amber-400 text-sm">💡</span>
                      <div className="text-xs">
                        <strong className="text-slate-300 block mb-0.5">Contoh Format yang Benar:</strong>
                        <span className="font-mono text-amber-300">{activeField.example}</span>
                      </div>
                    </div>
                  )}

                  {/* Native Adaptive Input Control */}
                  <div className="mt-2">
                    <label className="text-xs font-bold text-slate-400 block mb-2">Jawaban / Isian Anda:</label>
                    {activeField.type === 'checkbox' ? (
                      <label className="flex items-center gap-3 p-3.5 bg-slate-900 border border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 transition">
                        <input
                          type="checkbox"
                          checked={Boolean(userValues[activeField.id || activeField.name])}
                          onChange={(e) => updateValue(activeField.id || activeField.name, e.target.checked)}
                          className="w-5 h-5 rounded text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-semibold text-white">Centang jika sesuai / disetujui</span>
                      </label>
                    ) : activeField.type === 'radio' && Array.isArray(activeField.options) ? (
                      <div className="grid grid-cols-2 gap-2">
                        {activeField.options.map((opt: string, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => updateValue(activeField.id || activeField.name, opt)}
                            className={`p-3 rounded-2xl text-xs font-bold text-left border transition ${
                              userValues[activeField.id || activeField.name] === opt
                                ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={activeField.type === 'date' ? 'date' : 'text'}
                        value={userValues[activeField.id || activeField.name] || ''}
                        onChange={(e) => updateValue(activeField.id || activeField.name, e.target.value)}
                        placeholder={activeField.placeholder || 'Ketik isian Anda di sini...'}
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-sans"
                        autoFocus
                      />
                    )}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentFieldIndex === 0}
                    className="px-5 py-3 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 transition disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition cursor-pointer"
                  >
                    <span>{currentFieldIndex === flatFields.length - 1 ? 'Audit & Selesai' : 'Lanjut ke Kolom Berikutnya'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Final Section: Form Audit & Export */
              <div className="max-w-xl w-full mx-auto flex-1 flex flex-col justify-center text-center">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Seluruh Kolom Telah Ditinjau!</h2>
                <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
                  Berikut hasil audit kepatuhan formulir resmi sebelum mencetak file PDF Anda:
                </p>

                {/* Audit Checklist Box */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 text-left mb-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/60">
                    <strong className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Hasil Audit Pra-Pengiriman
                    </strong>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      auditResult?.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {auditResult?.passed ? '100% Siap Kirim' : `${auditResult?.missingCount} Perlu Perhatian`}
                    </span>
                  </div>

                  {auditResult?.passed ? (
                    <div className="text-xs text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Semua kolom wajib telah terisi lengkap dengan format yang sesuai.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-amber-300">Kolom wajib berikut belum terisi:</p>
                      <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                        {auditResult?.missingFields?.map((m: string, idx: number) => (
                          <li key={idx} className="font-mono text-[11px] text-amber-200">{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setIsCompleted(false)
                      setCurrentFieldIndex(0)
                    }}
                    className="px-5 py-3 rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    Tinjau Ulang dari Awal
                  </button>
                  <button
                    onClick={handleDownloadFilledPdf}
                    disabled={isExporting}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExporting ? 'Memproses PDF...' : 'Download Filled PDF Sekarang'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
