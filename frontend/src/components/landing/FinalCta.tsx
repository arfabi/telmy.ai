import React from 'react'
import { Link } from 'react-router-dom'
import { TranslationData } from '@/data/translations'
import { DownloadCloud, Play, Sparkles } from 'lucide-react'

interface FinalCtaProps {
  t: TranslationData
}

export const FinalCta: React.FC<FinalCtaProps> = ({ t }) => {
  // Detect browser for button text
  const getBrowserName = () => {
    if (typeof navigator === 'undefined') return 'Chrome'
    const ua = navigator.userAgent
    if (ua.includes('Edg/')) return 'Edge'
    if (ua.includes('Firefox/')) return 'Firefox'
    if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera'
    return 'Chrome'
  }

  const browserName = getBrowserName()
  const ctaBtnText = t.finalCtaBtn.includes('Chrome')
    ? t.finalCtaBtn.replace('Chrome', browserName)
    : t.finalCtaBtn

  return (
    <section className="py-20 sm:py-28 bg-blue-600 text-white relative overflow-hidden">
      {/* Decorative gradient overlay and soft light orbs */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 opacity-95" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Clean Large Telmy Brand Logo */}
        <div className="inline-flex items-center justify-center mb-8">
          <img
            src="/telmy_icon.png"
            alt="Telmy Icon"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-3xl drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          {t.finalCtaTitle || "Your next form can be easier."}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
          {t.finalCtaDesc || "Add Telmy in about a minute. Free for 5 forms every month."}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/download"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-blue-700 hover:bg-slate-50 shadow-xl shadow-blue-900/30 font-bold px-8 h-13 rounded-2xl transition-all active:scale-[0.98] hover:scale-102"
          >
            <DownloadCloud className="w-5 h-5 text-blue-600 mr-2" />
            <span>{ctaBtnText}</span>
          </Link>
          <a
            href="#simulator"
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById('simulator')
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center text-white border border-white/40 hover:bg-white/15 font-bold px-8 h-13 rounded-2xl transition-all active:scale-[0.98] cursor-pointer backdrop-blur-xs"
          >
            <Play className="w-4 h-4 mr-2" />
            <span>{t.finalDemoBtn || "Watch How It Works"}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
