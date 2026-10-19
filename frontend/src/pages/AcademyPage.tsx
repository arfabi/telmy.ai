import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  ACADEMY_I18N, 
  ACADEMY_ACTIVITIES, 
  AcademyActivity 
} from '@/data/academyData'
import { 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  ArrowLeft, 
  Play, 
  Volume2, 
  Eye, 
  Lock, 
  Zap, 
  ShieldCheck, 
  GraduationCap,
  ExternalLink,
  RotateCcw
} from 'lucide-react'
import { SEO } from '@/components/common/SEO'

export const AcademyPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const langKey = currentLang in ACADEMY_I18N.heroTitle ? currentLang : 'en'

  // User learning mode
  const [learningMode, setLearningMode] = useState<'self' | 'others'>('self')
  // Completed task ids
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  // Active activity in focus
  const [activeTaskId, setActiveTaskId] = useState<string>('task-install-pin')

  const i18n = {
    heroTagline: ACADEMY_I18N.heroTagline[langKey] || ACADEMY_I18N.heroTagline.en,
    heroTitle: ACADEMY_I18N.heroTitle[langKey] || ACADEMY_I18N.heroTitle.en,
    heroSubtitle: ACADEMY_I18N.heroSubtitle[langKey] || ACADEMY_I18N.heroSubtitle.en,
    modeTitle: ACADEMY_I18N.modeTitle[langKey] || ACADEMY_I18N.modeTitle.en,
    modeSelf: ACADEMY_I18N.modeSelf[langKey] || ACADEMY_I18N.modeSelf.en,
    modeOthers: ACADEMY_I18N.modeOthers[langKey] || ACADEMY_I18N.modeOthers.en,
    progressCompleted: ACADEMY_I18N.progressCompleted[langKey] || ACADEMY_I18N.progressCompleted.en,
    level1Title: ACADEMY_I18N.level1Title[langKey] || ACADEMY_I18N.level1Title.en,
    level1Subtitle: ACADEMY_I18N.level1Subtitle[langKey] || ACADEMY_I18N.level1Subtitle.en,
    level2Title: ACADEMY_I18N.level2Title[langKey] || ACADEMY_I18N.level2Title.en,
    level2Subtitle: ACADEMY_I18N.level2Subtitle[langKey] || ACADEMY_I18N.level2Subtitle.en,
    statusNotStarted: ACADEMY_I18N.statusNotStarted[langKey] || ACADEMY_I18N.statusNotStarted.en,
    statusCompleted: ACADEMY_I18N.statusCompleted[langKey] || ACADEMY_I18N.statusCompleted.en,
    checkBtn: ACADEMY_I18N.checkBtn[langKey] || ACADEMY_I18N.checkBtn.en,
    practiceBoxTitle: ACADEMY_I18N.practiceBoxTitle[langKey] || ACADEMY_I18N.practiceBoxTitle.en,
    instructionsLabel: ACADEMY_I18N.instructionsLabel[langKey] || ACADEMY_I18N.instructionsLabel.en,
    resetStep: ACADEMY_I18N.resetStep[langKey] || ACADEMY_I18N.resetStep.en,
    certificateTitle: ACADEMY_I18N.certificateTitle[langKey] || ACADEMY_I18N.certificateTitle.en,
    certificateDesc: ACADEMY_I18N.certificateDesc[langKey] || ACADEMY_I18N.certificateDesc.en,
    certificateBtn: ACADEMY_I18N.certificateBtn[langKey] || ACADEMY_I18N.certificateBtn.en,
  }

  const toggleTaskCompletion = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId))
    } else {
      setCompletedTasks([...completedTasks, taskId])
    }
  }

  const level1Activities = ACADEMY_ACTIVITIES.filter((a) => a.level === 'l1')
  const level2Activities = ACADEMY_ACTIVITIES.filter((a) => a.level === 'l2')

  const totalCount = ACADEMY_ACTIVITIES.length
  const completedCount = completedTasks.length
  const progressPercentage = Math.round((completedCount / totalCount) * 100)

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
          <p className="mt-4 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {i18n.heroSubtitle}
          </p>

          {/* Mode Selector & Realtime Progress Bar */}
          <div className="mt-10 bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left max-w-2xl mx-auto shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {i18n.modeTitle}
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="learningMode"
                      checked={learningMode === 'self'}
                      onChange={() => setLearningMode('self')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{i18n.modeSelf}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="learningMode"
                      checked={learningMode === 'others'}
                      onChange={() => setLearningMode('others')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{i18n.modeOthers}</span>
                  </label>
                </div>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-sm font-extrabold text-blue-600">
                  {completedCount} of {totalCount} {i18n.progressCompleted}
                </span>
              </div>
            </div>

            {/* Visual Meter */}
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Learning Trail */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full flex-1 space-y-16">
        
        {/* LEVEL 1 */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 font-black text-xs rounded-lg uppercase tracking-wider">
                Level 1
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {i18n.level1Title}
              </h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base">
              {i18n.level1Subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {level1Activities.map((act) => {
              const isDone = completedTasks.includes(act.id)
              const title = act.title[langKey] || act.title.en
              const summary = act.summary[langKey] || act.summary.en
              const steps = act.instructionSteps[langKey] || act.instructionSteps.en
              const practice = act.practiceSnippet[langKey] || act.practiceSnippet.en
              const checkLabel = act.checkButtonLabel[langKey] || act.checkButtonLabel.en
              const successMsg = act.successMessage[langKey] || act.successMessage.en
              const category = act.category[langKey] || act.category.en

              return (
                <Card
                  key={act.id}
                  className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                    isDone 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                          {act.stepNumber}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          {category}
                        </span>
                        {isDone && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {i18n.statusCompleted}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">
                        {title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {summary}
                      </p>

                      {/* Step by step instructions */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          {i18n.instructionsLabel}
                        </span>
                        <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-700">
                          {steps.map((st, i) => (
                            <li key={i} className="leading-relaxed">
                              {st}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Practice Box */}
                      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs sm:text-sm text-slate-700">
                        <strong className="text-blue-900 block mb-1">
                          {i18n.practiceBoxTitle}:
                        </strong>
                        <p className="italic text-slate-600">
                          {practice}
                        </p>
                      </div>

                      {isDone && (
                        <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>{successMsg}</span>
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="md:w-56 shrink-0 flex flex-col justify-center">
                      <Button
                        onClick={() => toggleTaskCompletion(act.id)}
                        className={`w-full font-bold h-11 text-xs sm:text-sm ${
                          isDone
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                        }`}
                      >
                        {isDone ? (
                          <span className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" /> {i18n.resetStep}
                          </span>
                        ) : (
                          <span>{checkLabel}</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* LEVEL 2 */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-black text-xs rounded-lg uppercase tracking-wider">
                Level 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {i18n.level2Title}
              </h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base">
              {i18n.level2Subtitle}
            </p>
          </div>

          <div className="space-y-6">
            {level2Activities.map((act) => {
              const isDone = completedTasks.includes(act.id)
              const title = act.title[langKey] || act.title.en
              const summary = act.summary[langKey] || act.summary.en
              const steps = act.instructionSteps[langKey] || act.instructionSteps.en
              const practice = act.practiceSnippet[langKey] || act.practiceSnippet.en
              const checkLabel = act.checkButtonLabel[langKey] || act.checkButtonLabel.en
              const successMsg = act.successMessage[langKey] || act.successMessage.en
              const category = act.category[langKey] || act.category.en

              return (
                <Card
                  key={act.id}
                  className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                    isDone 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                          {act.stepNumber}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          {category}
                        </span>
                        {isDone && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {i18n.statusCompleted}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">
                        {title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {summary}
                      </p>

                      {/* Step by step instructions */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          {i18n.instructionsLabel}
                        </span>
                        <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-700">
                          {steps.map((st, i) => (
                            <li key={i} className="leading-relaxed">
                              {st}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Practice Box */}
                      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/60 text-xs sm:text-sm text-slate-700">
                        <strong className="text-indigo-900 block mb-1">
                          {i18n.practiceBoxTitle}:
                        </strong>
                        <p className="italic text-slate-600">
                          {practice}
                        </p>
                      </div>

                      {isDone && (
                        <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>{successMsg}</span>
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="md:w-56 shrink-0 flex flex-col justify-center">
                      <Button
                        onClick={() => toggleTaskCompletion(act.id)}
                        className={`w-full font-bold h-11 text-xs sm:text-sm ${
                          isDone
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                        }`}
                      >
                        {isDone ? (
                          <span className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" /> {i18n.resetStep}
                          </span>
                        ) : (
                          <span>{checkLabel}</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Certificate Completion Banner */}
        {completedCount === totalCount && (
          <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 mx-auto flex items-center justify-center shadow-lg font-black">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                {i18n.certificateTitle}
              </h3>
              <p className="text-sm sm:text-base text-blue-100">
                {i18n.certificateDesc}
              </p>
              <div className="pt-4 flex justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-slate-100 font-black px-8 shadow-xl"
                  onClick={() => alert('Certificate downloaded! You are officially certified in Digital Form Accessibility.')}
                >
                  <Award className="w-5 h-5 mr-2 text-amber-500" />
                  <span>{i18n.certificateBtn}</span>
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer t={t} />
    </div>
  )
}
