import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { TranslationData } from '@/data/translations'
import { Shield, Sparkles, ArrowRight, Play } from 'lucide-react'

interface HeroProps {
  t: TranslationData
}

export const Hero: React.FC<HeroProps> = ({ t }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] pointer-events-none -z-10">
        <div className="absolute top-6 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-12 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Headline (V3 Friendly Headline) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              {t.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.heroSubtitle}
            </p>

            {/* Dual CTAs (V3) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/download" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-bold shadow-md shadow-blue-500/25 px-7">
                  <span>{t.heroCta}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <a href="#simulator" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold px-6">
                  <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                  <span>{t.heroDemo}</span>
                </Button>
              </a>
            </div>

            {/* Trustline Bar (V2) */}
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>{t.heroTrustline}</span>
            </div>

            {/* Browser Support Badges (V3) */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{t.heroWorksOn}:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">Chrome</span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">Edge</span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">Firefox</span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">Opera</span>
            </div>
          </div>

          {/* Right Robot Mascot Column (V3 Avatar) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Glow Behind Mascot */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
              <img
                src="/telmy-avatar.svg"
                alt="Telmy AI Mascot Companion"
                className="relative w-64 h-64 sm:w-80 sm:h-80 drop-shadow-xl animate-in fade-in duration-500 hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
