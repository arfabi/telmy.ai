import React from 'react'
import { JAPAC_LANGUAGES } from '@/data/languages'
import { useLanguage } from '@/context/LanguageContext'
import { X, Check, Globe } from 'lucide-react'

interface LanguageModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { lang, setLang, t } = useLanguage()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t.langModalTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.langModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 11 JAPAC Languages Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {JAPAC_LANGUAGES.map((item) => {
            const isSelected = lang === item.code
            return (
              <button
                key={item.code}
                onClick={() => {
                  setLang(item.code)
                  onClose()
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-600'
                    : 'border-slate-200/80 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* SVG Flag */}
                  <div
                    className="flex-shrink-0"
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{item.nativeName}</span>
                      <span className="text-xs font-normal text-slate-400">({item.name})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {item.country}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{t.langModalFooterBadge}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {t.langModalClose}
          </button>
        </div>
      </div>
    </div>
  )
}
