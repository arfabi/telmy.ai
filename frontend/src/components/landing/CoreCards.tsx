import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { TranslationData } from '@/data/translations'
import { BookOpenCheck, Zap, ShieldAlert, ArrowDown, Sparkles } from 'lucide-react'

interface CoreCardsProps {
  t: TranslationData
}

export const CoreCards: React.FC<CoreCardsProps> = ({ t }) => {
  const scrollToSimulator = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById('simulator')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="meet-telmy" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Three Jobs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2357] tracking-tight leading-tight">
            {t.jobsTitle || "Meet Telmy, your guide through the form."}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t.jobsSubtitle || "Three simple jobs to get you through any paperwork with clarity and peace of mind."}
          </p>
        </div>

        {/* 3 Core Job Cards - All visible, no 'Click to expand' */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Explain */}
          <Card className="p-7 sm:p-8 h-full flex flex-col justify-between border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 shadow-xs hover:border-blue-400 hover:shadow-lg transition-all duration-300 rounded-3xl group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 mb-6 group-hover:scale-105 transition-transform">
                <BookOpenCheck className="w-7 h-7" />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                Job 01
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                {t.job1Title || "Explain"}
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {t.job1Desc || "Tap any question. Get a simple answer with an example, in your language. Telmy can also read it aloud."}
              </p>

              {/* Product Visual */}
              <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-950 relative">
                <img
                  src="/assets/demo-understand.gif"
                  alt="Telmy explains questions in native language"
                  className="w-full h-44 object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href="#simulator"
                onClick={scrollToSimulator}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
              >
                <span>{t.job1Link || "See it in action ↓"}</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>

          {/* Card 2: Fill in */}
          <Card className="p-7 sm:p-8 h-full flex flex-col justify-between border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 shadow-xs hover:border-indigo-400 hover:shadow-lg transition-all duration-300 rounded-3xl group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-6 group-hover:scale-105 transition-transform">
                <Zap className="w-7 h-7" />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                Job 02
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {t.job2Title || "Fill in"}
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {t.job2Desc || "Upload your ID or passport once. Telmy fills the matching fields for you. You review every answer."}
              </p>

              {/* Product Visual */}
              <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-950 relative">
                <img
                  src="/assets/demo-autofill.gif"
                  alt="Vault and 1-Click AutoFill"
                  className="w-full h-44 object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href="#simulator"
                onClick={scrollToSimulator}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
              >
                <span>{t.job2Link || "See it in action ↓"}</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>

          {/* Card 3: Double-check */}
          <Card className="p-7 sm:p-8 h-full flex flex-col justify-between border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 shadow-xs hover:border-emerald-400 hover:shadow-lg transition-all duration-300 rounded-3xl group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-6 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                Job 03
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {t.job3Title || "Double-check"}
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {t.job3Desc || "Before you submit, Telmy flags missing fields, mismatched dates, and likely mistakes."}
              </p>

              {/* Real Traffic Light / Pre-check Visual */}
              <div className="mt-6 p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-50" />
                  <span className="font-semibold">Passport valid (&gt;6 months remaining)</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 ring-4 ring-amber-50" />
                  <span className="font-semibold">National ID matched legal records</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 ring-4 ring-blue-50" />
                  <span className="font-semibold">All required fields complete</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href="#simulator"
                onClick={scrollToSimulator}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
              >
                <span>{t.job3Link || "See it in action ↓"}</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        </div>

        {/* Accessibility Features link banner */}
        <div className="mt-12 text-center">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 transition-all shadow-2xs group"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{t.jobsExtraNote || "Also includes 14 Tools for Accessibility that make navigating digital services comfortable and stress-free."}</span>
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
