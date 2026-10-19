import React, { useState } from 'react'
import { Card, Badge } from '@/components/ui/Card'
import { TranslationData } from '@/data/translations'
import {
  Volume2,
  Zap,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react'

interface SimulatorProps {
  t: TranslationData
}

export const Simulator: React.FC<SimulatorProps> = ({ t }) => {
  const [fullName, setFullName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [passport, setPassport] = useState('')
  const [audited, setAudited] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleAutofill = () => {
    setFullName('Alexander Christopher Ward')
    setIdNumber('3201241995080004')
    setPassport('X84910284')
    setAudited(false)
  }

  const handleAudit = () => {
    setAudited(true)
  }

  const handleListen = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(
        t.simField1Desc + '. ' + t.simField2Desc + '. ' + t.simField3Desc
      )
      setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } else {
      alert('Web Speech API is not supported in this browser.')
    }
  }

  return (
    <section id="simulator" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="blue" className="bg-blue-900/50 text-blue-300 border-blue-700/50 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Live Practice Sandbox
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t.simTitle}
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            {t.simSubtitle}
          </p>

          {/* Form types supported pill bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Works with any form:</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">Scholarship Forms</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">Apostille & Legalization</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">Visa & Stay Permits</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">Google Forms</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">Jotform</span>
            <span className="px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60 font-semibold">+ Any Web Portal</span>
          </div>
        </div>

        {/* Simulator Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Government Portal Mockup */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            {/* Window Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-400 ml-2">portal.immigration.gov</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                {t.simBadge}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-6">{t.simTitle}</h3>

            <div className="space-y-5">
              {/* Field 1 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.simField1Label}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Johnathan Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-slate-400 mt-1">{t.simField1Desc}</p>
              </div>

              {/* Field 2 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.simField2Label}
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="16-digit ID number"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-slate-400 mt-1">{t.simField2Desc}</p>
              </div>

              {/* Field 3 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.simField3Label}
                </label>
                <input
                  type="text"
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  placeholder="e.g. A9283719"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-slate-400 mt-1">{t.simField3Desc}</p>
              </div>
            </div>

            {/* Audit Result Banner */}
            {audited && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{t.simAuditGood}</span>
              </div>
            )}
          </div>

          {/* Telmy Copilot Sidepanel */}
          <div className="lg:col-span-5 bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-700/80 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <img src="/telmy_icon.png" alt="Telmy Icon" className="w-7 h-7 rounded-lg" />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.simSidepanelTitle}</h4>
                  <p className="text-[11px] text-emerald-400 font-medium">{t.simSidepanelStatus}</p>
                </div>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                Live
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300 font-medium">{t.simQuickActions}</p>

              {/* Action 1: 1-Click Autofill */}
              <button
                onClick={handleAutofill}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white font-semibold text-xs transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{t.simBtnAutofill}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Action 2: Audit Form */}
              <button
                onClick={handleAudit}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all border border-slate-600 active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>{t.simBtnAudit}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Action 3: Speech Audio Guidance */}
              <button
                onClick={handleListen}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all border border-slate-600 active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-amber-400 animate-pulse' : 'text-blue-400'}`} />
                  <span>{isSpeaking ? t.simSpeaking : t.simBtnListen}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">TTS</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-700/70 text-[11px] text-slate-400">
              {t.simVaultTip}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
