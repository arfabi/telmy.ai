import React from 'react'
import { Card } from '@/components/ui/Card'
import { TranslationData } from '@/data/translations'
import { BookOpenCheck, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react'

interface CoreCardsProps {
  t: TranslationData
}

export const CoreCards: React.FC<CoreCardsProps> = () => {
  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Core Pillars</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One companion. Three jobs.
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Everything you need to navigate, complete, and verify official forms without anxiety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Understand */}
          <Card className="p-8 h-full flex flex-col justify-between border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all rounded-3xl group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <BookOpenCheck className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                Pillar 1
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                Understand
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Get a plain-language explanation of every field, with examples, legal definitions, and common pitfalls — written or spoken aloud in your own native language.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Forms Guide & Context Explainer</span>
            </div>
          </Card>

          {/* Pillar 2: Complete */}
          <Card className="p-8 h-full flex flex-col justify-between border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 shadow-xs hover:border-indigo-400 hover:shadow-lg transition-all rounded-3xl group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                Pillar 2
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Complete
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Upload your ID, passport, or certificate once. Telmy reads it client-side into an encrypted vault and auto-fills matching fields across complex multi-step portals in 1 click.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Smart Vault & 1-Click AutoFill</span>
            </div>
          </Card>

          {/* Pillar 3: Check */}
          <Card className="p-8 h-full flex flex-col justify-between border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 shadow-xs hover:border-emerald-400 hover:shadow-lg transition-all rounded-3xl group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                Pillar 3
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Check
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Before you click submit on the official portal, Telmy flags missed mandatory fields, inconsistent dates, and high-risk errors to prevent costly rejections and repeats.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Built-in Form Auditor & Pre-check</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
