import React, { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Globe, Layers, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { REAL_ACTION_SHOWCASE_I18N } from '@/data/realActionShowcaseData'

export const RealActionShowcase: React.FC = () => {
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState<'gov' | 'web'>('gov')

  const cur = REAL_ACTION_SHOWCASE_I18N[lang] || REAL_ACTION_SHOWCASE_I18N.en

  const showcaseData = {
    gov: {
      tag: cur.govTag,
      title: cur.govTitle,
      desc: cur.govDesc,
      urlBar: 'https://elayanan.ahu.go.id/apostille/pendaftaran',
      imageSrc: '/assets/screenshot-ahu-apostille.png',
      alt: 'Telmy Side Panel on AHU Apostille government form',
      highlights: cur.govHighlights,
    },
    web: {
      tag: cur.webTag,
      title: cur.webTitle,
      desc: cur.webDesc,
      urlBar: 'https://form.jotform.com/201591624080045',
      imageSrc: '/assets/screenshot-web-form.png',
      alt: 'Telmy Side Panel on online registration form',
      highlights: cur.webHighlights,
    },
  }

  const current = showcaseData[activeTab]

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{cur.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {cur.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {cur.subtitle}
          </p>

          {/* Interactive Tab Switcher */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setActiveTab('gov')}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'gov'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102 ring-2 ring-blue-400/50'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <Globe className="w-4 h-4 text-blue-300" />
              <span>{cur.tabGov}</span>
            </button>

            <button
              onClick={() => setActiveTab('web')}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'web'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102 ring-2 ring-blue-400/50'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-300" />
              <span>{cur.tabWeb}</span>
            </button>
          </div>
        </div>

        {/* Real Chrome Browser Frame Display */}
        <div className="bg-slate-800/95 border border-slate-700/80 rounded-3xl p-3 sm:p-5 shadow-2xl shadow-blue-950/50">
          {/* Chrome Top Bar Mockup */}
          <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-700/70 mb-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
            </div>

            {/* URL Address Bar */}
            <div className="flex-1 max-w-xl bg-slate-900 border border-slate-700 rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate">{current.urlBar}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>{cur.activeLabel}</span>
            </div>
          </div>

          {/* Screenshot Container */}
          <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner group relative">
            <img
              src={current.imageSrc}
              alt={current.alt}
              className="w-full h-auto object-cover object-top transition-transform duration-500"
              loading="lazy"
            />
          </div>

          {/* Bottom Context Details & Highlights */}
          <div className="mt-5 pt-4 border-t border-slate-700/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center px-2">
            <div className="md:col-span-8">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                {current.tag}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                {current.desc}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {current.highlights.map((hl, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 text-[11px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{hl}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex justify-end">
              <a
                href="/download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all group"
              >
                <span>{cur.installBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
