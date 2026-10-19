import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ACADEMY_I18N, ACADEMY_ACTIVITIES } from '@/data/academyData'
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Download, 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Trophy,
  CheckCircle2,
  Lock,
  Volume2
} from 'lucide-react'
import { SEO } from '@/components/common/SEO'

export const AcademyPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const { userProfile } = useAuth()
  const langKey = currentLang in ACADEMY_I18N.heroTitle ? currentLang : 'en'

  const i18n = {
    heroTagline: ACADEMY_I18N.heroTagline[langKey] || ACADEMY_I18N.heroTagline.en,
    heroTitle: ACADEMY_I18N.heroTitle[langKey] || ACADEMY_I18N.heroTitle.en,
    heroSubtitle: ACADEMY_I18N.heroSubtitle[langKey] || ACADEMY_I18N.heroSubtitle.en,
    rewardBadge: ACADEMY_I18N.rewardCalloutBadge[langKey] || ACADEMY_I18N.rewardCalloutBadge.en,
    rewardTitle: ACADEMY_I18N.rewardCalloutTitle[langKey] || ACADEMY_I18N.rewardCalloutTitle.en,
    rewardDesc: ACADEMY_I18N.rewardCalloutDesc[langKey] || ACADEMY_I18N.rewardCalloutDesc.en,
    rewardBtn: ACADEMY_I18N.rewardCalloutBtn[langKey] || ACADEMY_I18N.rewardCalloutBtn.en,
    step1Title: ACADEMY_I18N.step1Title[langKey] || ACADEMY_I18N.step1Title.en,
    step1Desc: ACADEMY_I18N.step1Desc[langKey] || ACADEMY_I18N.step1Desc.en,
    step2Title: ACADEMY_I18N.step2Title[langKey] || ACADEMY_I18N.step2Title.en,
    step2Desc: ACADEMY_I18N.step2Desc[langKey] || ACADEMY_I18N.step2Desc.en,
    step3Title: ACADEMY_I18N.step3Title[langKey] || ACADEMY_I18N.step3Title.en,
    step3Desc: ACADEMY_I18N.step3Desc[langKey] || ACADEMY_I18N.step3Desc.en,
    curriculumTitle: ACADEMY_I18N.curriculumTitle[langKey] || ACADEMY_I18N.curriculumTitle.en,
    curriculumSubtitle: ACADEMY_I18N.curriculumSubtitle[langKey] || ACADEMY_I18N.curriculumSubtitle.en,
    level1Title: ACADEMY_I18N.level1Title[langKey] || ACADEMY_I18N.level1Title.en,
    level1Subtitle: ACADEMY_I18N.level1Subtitle[langKey] || ACADEMY_I18N.level1Subtitle.en,
    level2Title: ACADEMY_I18N.level2Title[langKey] || ACADEMY_I18N.level2Title.en,
    level2Subtitle: ACADEMY_I18N.level2Subtitle[langKey] || ACADEMY_I18N.level2Subtitle.en,
    viewDashboardPrompt: ACADEMY_I18N.viewDashboardPrompt[langKey] || ACADEMY_I18N.viewDashboardPrompt.en,
    certificateTitle: ACADEMY_I18N.certificateTitle[langKey] || ACADEMY_I18N.certificateTitle.en,
    certificateDesc: ACADEMY_I18N.certificateDesc[langKey] || ACADEMY_I18N.certificateDesc.en,
  }

  const level1Activities = ACADEMY_ACTIVITIES.filter((a) => a.level === 'l1')
  const level2Activities = ACADEMY_ACTIVITIES.filter((a) => a.level === 'l2')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <SEO />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>{i18n.heroTagline}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {i18n.heroTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {i18n.heroSubtitle}
          </p>

          {/* Reward Callout Box: 10 Form Credits */}
          <div className="mt-10 max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 text-white shadow-xl shadow-blue-500/15 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{i18n.rewardBadge}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  {i18n.rewardTitle}
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                  {i18n.rewardDesc}
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
                <Link to={userProfile?.uid ? '/dashboard' : '/signin'}>
                  <Button className="w-full bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-sm px-6 h-12 shadow-lg cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{i18n.rewardBtn}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link to="/download">
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 font-bold text-xs h-10 cursor-pointer">
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    <span>Download Extension</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Flow to Learn & Earn */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-base">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{i18n.step1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {i18n.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-base">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{i18n.step2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {i18n.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-base">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{i18n.step3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {i18n.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Showcase (What You Will Learn in Dashboard) */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {i18n.curriculumTitle}
          </h2>
          <p className="text-sm text-slate-600">
            {i18n.curriculumSubtitle}
          </p>
        </div>

        {/* Level 1 Foundation Modules */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 font-black text-xs rounded-lg uppercase tracking-wider">
              Level 1
            </span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{i18n.level1Title}</h3>
              <p className="text-xs text-slate-500">{i18n.level1Subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {level1Activities.map((act) => {
              const title = act.title[langKey] || act.title.en
              const summary = act.summary[langKey] || act.summary.en
              const category = act.category[langKey] || act.category.en

              return (
                <Card key={act.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {act.stepNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{summary}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{i18n.viewDashboardPrompt}</span>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Level 2 Pro Speed & Accuracy Modules */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-black text-xs rounded-lg uppercase tracking-wider">
              Level 2
            </span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{i18n.level2Title}</h3>
              <p className="text-xs text-slate-500">{i18n.level2Subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {level2Activities.map((act) => {
              const title = act.title[langKey] || act.title.en
              const summary = act.summary[langKey] || act.summary.en
              const category = act.category[langKey] || act.category.en

              return (
                <Card key={act.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {act.stepNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{summary}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{i18n.viewDashboardPrompt}</span>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Bottom Banner: Ready to Start */}
        <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 mx-auto flex items-center justify-center shadow-md font-black">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              {i18n.certificateTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              {i18n.certificateDesc}
            </p>
            <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
              <Link to={userProfile?.uid ? '/dashboard' : '/signin'}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black px-7 text-sm shadow-lg cursor-pointer">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  <span>{i18n.rewardBtn}</span>
                </Button>
              </Link>
              <Link to="/download">
                <Button size="lg" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 font-bold px-7 text-sm cursor-pointer">
                  <span>Download Extension</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} />
    </div>
  )
}
