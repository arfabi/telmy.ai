import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { TranslationData } from '@/data/translations'
import { Shield, Sparkles, ArrowRight, Play, CheckCircle2, HelpCircle } from 'lucide-react'

interface HeroProps {
  t: TranslationData
}

export const Hero: React.FC<HeroProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'sample' | 'explainer'>('explainer')

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[560px] pointer-events-none -z-10">
        <div className="absolute top-4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-16 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 text-center lg:text-left">
            {/* Tagline Badge / Kicker (Spark Yellow & Telmy Blue accent) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB81F]/15 border border-[#FFB81F]/35 text-[#0A2357] text-xs font-bold mb-6 shadow-2xs backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
              <span>{t.heroKicker}</span>
            </div>

            {/* Main Headline (Display Nunito 800) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#0A2357] tracking-tight leading-[1.12]">
              {t.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/download" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-blue-500/25 px-7 py-3 text-base group">
                  <span>{t.heroCta}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#simulator" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold px-6 py-3 text-base border-slate-300 hover:bg-slate-50">
                  <Play className="w-4 h-4 text-blue-600 fill-blue-600 mr-2" />
                  <span>{t.heroDemo}</span>
                </Button>
              </a>
            </div>

            {/* Supporting Microcopy */}
            <p className="mt-4 text-xs text-slate-500 font-medium">
              {t.heroSupportText}
            </p>

            {/* Trustline Bar */}
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.heroTrustline}</span>
            </div>

            {/* Browser Support Badges */}
            <div className="mt-6 pt-5 border-t border-slate-200/70 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{t.heroWorksOn}:</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">Chrome</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">Edge</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">Firefox</span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs">Opera</span>
            </div>
          </div>

          {/* Right Product Demo Mockup Column */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Soft decorative glow behind window */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20" />

              {/* Window Frame Mockup */}
              <div className="relative rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Browser Tab Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-700/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                    <span className="ml-2 px-2.5 py-0.5 rounded-md bg-slate-900/70 text-slate-400 font-mono text-[11px] truncate max-w-[200px]">
                      portal.immigration.gov/apply
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Telmy Companion Active
                  </div>
                </div>

                {/* Split View Content: Form on Left, Telmy Sidepanel on Right */}
                <div className="grid grid-cols-12 min-h-[380px] bg-slate-900">
                  {/* Left: The Official Web Form (7 cols) */}
                  <div className="col-span-7 p-4 border-r border-slate-800/80 bg-slate-950/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Visa Form (Section 3.2)
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50">
                          Official
                        </span>
                      </div>

                      {/* Field 1: Normal field */}
                      <div className="mb-3 opacity-60">
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Full Legal Name
                        </label>
                        <div className="h-8 rounded-lg bg-slate-900 border border-slate-700/60 px-2.5 flex items-center text-xs text-slate-400">
                          Jane Doe
                        </div>
                      </div>

                      {/* Field 2: Confusing Field (HIGHLIGHTED / ACTIVE) */}
                      <div className="p-2.5 rounded-xl bg-blue-950/40 border-2 border-blue-500/80 shadow-md shadow-blue-500/10 relative">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-blue-200 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                            Purpose of Visit
                          </label>
                          <span className="text-[9px] font-semibold text-blue-300 bg-blue-900/80 px-1.5 py-0.2 rounded">
                            Field #28
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-2">
                          Specify primary objective under regulation 4A-12
                        </p>
                        <div className="h-8 rounded-lg bg-slate-900 border border-blue-400/50 px-2.5 flex items-center justify-between text-xs text-slate-200">
                          <span>Tourism / Holiday</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      </div>

                      {/* Field 3: Another field */}
                      <div className="mt-3 opacity-60">
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Permanent Residential Address
                        </label>
                        <div className="h-8 rounded-lg bg-slate-900 border border-slate-700/60 px-2.5 flex items-center text-xs text-slate-400">
                          124 Orchard Road, #04-12
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/60">
                      <span>Form 1 of 1</span>
                      <span className="text-emerald-400">Answers checked: OK</span>
                    </div>
                  </div>

                  {/* Right: Telmy AI Assistant Side Panel (5 cols) */}
                  <div className="col-span-5 p-3.5 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-between">
                    <div>
                      {/* Telmy Header */}
                      <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-800">
                        <img
                          src="/telmy-avatar.svg"
                          alt="Telmy Companion"
                          className="w-7 h-7 rounded-full bg-blue-500/20 p-0.5 border border-blue-400/40"
                        />
                        <div>
                          <div className="text-[11px] font-bold text-white flex items-center gap-1">
                            Telmy Guide
                          </div>
                          <div className="text-[9px] text-emerald-400 font-medium">
                            Explaining in your language
                          </div>
                        </div>
                      </div>

                      {/* Interactive Explanation Bubble */}
                      <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-[11px] leading-relaxed text-slate-200 shadow-inner">
                        <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[10px] mb-1">
                          <HelpCircle className="w-3 h-3" />
                          What this question asks:
                        </div>
                        <p className="text-[10.5px] text-slate-300">
                          "This asks why you are travelling. Choose <strong className="text-white">Tourism</strong> if traveling for vacation or visiting family, or <strong className="text-white">Business</strong> for meetings."
                        </p>
                      </div>

                      {/* Live Guidance Tip */}
                      <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        <span>Ready to check before you submit.</span>
                      </div>
                    </div>

                    {/* Bottom Mini Status */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                      <span>Zero-Knowledge Vault</span>
                      <span className="text-blue-400 font-semibold">11 Languages</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Video Placeholder Banner */}
                <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Play className="w-3 h-3 text-blue-400 fill-blue-400" />
                    <span className="text-[11px]">Product demo preview (30s)</span>
                  </div>
                  <a
                    href="#simulator"
                    className="text-blue-400 hover:text-blue-300 font-semibold text-[11px] hover:underline"
                  >
                    Try interactive sandbox →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
