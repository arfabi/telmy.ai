import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  FEATURES_PAGE_I18N, 
  FEATURES_LIST, 
  FeatureItem 
} from '@/data/featuresData'
import { 
  Search, 
  ListOrdered, 
  Bot, 
  ShieldAlert, 
  FileSearch, 
  Lock, 
  Zap, 
  Users, 
  Sun, 
  Volume2, 
  Type, 
  Eye, 
  Sliders, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  DownloadCloud,
  Globe
} from 'lucide-react'
import { SUPPORTED_LANGUAGES_DATA } from '@/data/languagesData'
import { SEO } from '@/components/common/SEO'

// Icon mapper
const ICON_MAP: Record<string, React.ElementType> = {
  ListOrdered,
  Bot,
  ShieldAlert,
  FileSearch,
  Lock,
  Zap,
  Users,
  Sun,
  Volume2,
  Type,
  Eye,
  Sliders,
}

export const FeaturesPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const langKey = currentLang in FEATURES_PAGE_I18N.heroTitle ? currentLang : 'en'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ai' | 'vault' | 'a11y' | 'free' | 'pro'>('all')

  const i18n = {
    badge: FEATURES_PAGE_I18N.badge[langKey] || FEATURES_PAGE_I18N.badge.en,
    heroTitle: FEATURES_PAGE_I18N.heroTitle[langKey] || FEATURES_PAGE_I18N.heroTitle.en,
    heroSubtitle: FEATURES_PAGE_I18N.heroSubtitle[langKey] || FEATURES_PAGE_I18N.heroSubtitle.en,
    searchPlaceholder: FEATURES_PAGE_I18N.searchPlaceholder[langKey] || FEATURES_PAGE_I18N.searchPlaceholder.en,
    filterAll: FEATURES_PAGE_I18N.filterAll[langKey] || FEATURES_PAGE_I18N.filterAll.en,
    filterAi: FEATURES_PAGE_I18N.filterAi[langKey] || FEATURES_PAGE_I18N.filterAi.en,
    filterVault: FEATURES_PAGE_I18N.filterVault[langKey] || FEATURES_PAGE_I18N.filterVault.en,
    filterA11y: FEATURES_PAGE_I18N.filterA11y[langKey] || FEATURES_PAGE_I18N.filterA11y.en,
    filterFree: FEATURES_PAGE_I18N.filterFree[langKey] || FEATURES_PAGE_I18N.filterFree.en,
    filterPro: FEATURES_PAGE_I18N.filterPro[langKey] || FEATURES_PAGE_I18N.filterPro.en,
    backHome: FEATURES_PAGE_I18N.backHome[langKey] || FEATURES_PAGE_I18N.backHome.en,
    freeBadge: FEATURES_PAGE_I18N.freeBadge[langKey] || FEATURES_PAGE_I18N.freeBadge.en,
    proBadge: FEATURES_PAGE_I18N.proBadge[langKey] || FEATURES_PAGE_I18N.proBadge.en,
    countFound: FEATURES_PAGE_I18N.countFound[langKey] || FEATURES_PAGE_I18N.countFound.en,
    ctaTitle: FEATURES_PAGE_I18N.ctaTitle[langKey] || FEATURES_PAGE_I18N.ctaTitle.en,
    ctaSubtitle: FEATURES_PAGE_I18N.ctaSubtitle[langKey] || FEATURES_PAGE_I18N.ctaSubtitle.en,
    ctaBtn: FEATURES_PAGE_I18N.ctaBtn[langKey] || FEATURES_PAGE_I18N.ctaBtn.en,
  }

  // Filter features
  const filteredFeatures = FEATURES_LIST.filter((item: FeatureItem) => {
    // Category match
    if (selectedFilter === 'ai' && item.category !== 'ai') return false
    if (selectedFilter === 'vault' && item.category !== 'vault') return false
    if (selectedFilter === 'a11y' && item.category !== 'a11y') return false
    if (selectedFilter === 'free' && item.isPro) return false
    if (selectedFilter === 'pro' && !item.isPro) return false

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      const title = (item.title[langKey] || item.title.en).toLowerCase()
      const desc = (item.description[langKey] || item.description.en).toLowerCase()
      return title.includes(q) || desc.includes(q)
    }

    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <SEO />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{i18n.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {i18n.heroTitle}
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {i18n.heroSubtitle}
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-xl mx-auto relative">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={i18n.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 text-sm sm:text-base shadow-xs transition-all"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {i18n.filterAll}
            </button>
            <button
              onClick={() => setSelectedFilter('ai')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedFilter === 'ai'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {i18n.filterAi}
            </button>
            <button
              onClick={() => setSelectedFilter('vault')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedFilter === 'vault'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {i18n.filterVault}
            </button>
            <button
              onClick={() => setSelectedFilter('a11y')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedFilter === 'a11y'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {i18n.filterA11y}
            </button>
            <button
              onClick={() => setSelectedFilter('free')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedFilter === 'free'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {i18n.filterFree}
            </button>
            <button
              onClick={() => setSelectedFilter('pro')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedFilter === 'pro'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {i18n.filterPro}
            </button>
          </div>

          <p className="mt-4 text-xs font-semibold text-slate-400">
            {filteredFeatures.length} {i18n.countFound}
          </p>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat) => {
            const Icon = ICON_MAP[feat.iconName] || Bot
            const title = feat.title[langKey] || feat.title.en
            const desc = feat.description[langKey] || feat.description.en
            const badge = feat.badge[langKey] || feat.badge.en

            return (
              <Card
                key={feat.id}
                hoverGlow
                className="p-6 flex flex-col justify-between bg-white border border-slate-200/80 rounded-2xl shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                        {badge}
                      </span>
                      {feat.isPro ? (
                        <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded-lg">
                          {i18n.proBadge}
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                          {i18n.freeBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium capitalize">
                    {feat.category === 'ai' ? 'AI Assistance' : feat.category === 'vault' ? 'Private Vault' : 'Accessibility Hub'}
                  </span>
                  <a
                    href="/academy"
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Practice in Academy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* 11 Supported Languages Feature Cards Section */}
      <section id="languages" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-4">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>Multilingual Capability</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {langKey === 'id' ? 'Dukungan 11 Bahasa Resmi Asia-Pasifik' : 'Supported in 11 Official Languages'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              {langKey === 'id' 
                ? 'Pahami instruksi formulir, dengarkan panduan suara, dan periksa jawaban dalam bahasa yang paling Anda kuasai.'
                : 'Understand form questions, listen to audio guidance, and verify entries in the language you feel most comfortable with.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {SUPPORTED_LANGUAGES_DATA.map((lang) => {
              const isIndonesian = langKey === 'id'
              return (
                <Card
                  key={lang.code}
                  hoverGlow
                  className="p-6 flex flex-col justify-between bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group"
                >
                  <div>
                    {/* Header: Flag SVG + Language Code Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-8.5 rounded-lg overflow-hidden border border-slate-300/80 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        {lang.flagSvg}
                      </div>
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {lang.short}
                      </span>
                    </div>

                    {/* Language & Native Name */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {lang.nativeName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mb-3">
                      {lang.country}
                    </p>

                    {/* Description: "Use language xxxx" in 11 languages */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
                      {langKey === 'id' && (
                        <span>
                          Gunakan bahasa <strong>{lang.name}</strong> ({lang.nativeName}) untuk memahami dan mengisi formulir resmi tanpa kendala bahasa.
                        </span>
                      )}
                      {langKey === 'ms' && (
                        <span>
                          Gunakan bahasa <strong>{lang.name}</strong> ({lang.nativeName}) untuk memahami dan mengisi borang rasmi dengan yakin.
                        </span>
                      )}
                      {langKey === 'ja' && (
                        <span>
                          <strong>{lang.nativeName}</strong> を使用して、公的フォームの意味を正確に理解し、迷わずスムーズに作成できます。
                        </span>
                      )}
                      {langKey === 'ko' && (
                        <span>
                          <strong>{lang.nativeName}</strong>로 공공 서식과 비자 신청서를 명확하게 이해하고 완벽하게 작성하세요.
                        </span>
                      )}
                      {langKey === 'zh' && (
                        <span>
                          使用 <strong>{lang.nativeName}</strong>，轻松理解并准确填报各类官方表格与签证公文。
                        </span>
                      )}
                      {langKey === 'zh-TW' && (
                        <span>
                          以 <strong>{lang.nativeName}</strong> 輕鬆搞懂繁瑣公文表格，清楚掌握官方規定與範例。
                        </span>
                      )}
                      {langKey === 'vi' && (
                        <span>
                          Sử dụng <strong>{lang.nativeName}</strong> để hiểu rõ và hoàn thành biểu mẫu chính thức một cách chính xác.
                        </span>
                      )}
                      {langKey === 'th' && (
                        <span>
                          ใช้ <strong>{lang.nativeName}</strong> เพื่อทำความเข้าใจและกรอกแบบฟอร์มทางการได้อย่างมั่นใจและชัดเจน
                        </span>
                      )}
                      {langKey === 'hi' && (
                        <span>
                          आधिकारिक फॉर्म को समझने और बिना किसी त्रुटि के भरने के लिए <strong>{lang.nativeName}</strong> का उपयोग करें।
                        </span>
                      )}
                      {langKey === 'fil' && (
                        <span>
                          Gamitin ang <strong>{lang.nativeName}</strong> upang madaling maunawaan at makumpleto ang mga opisyal na form.
                        </span>
                      )}
                      {langKey === 'en' && (
                        <span>
                          Use <strong>{lang.name}</strong> ({lang.nativeName}) to understand and complete official forms with clarity.
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Upcoming Global Languages Section with SOON Badges & SVG Flags */}
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Next Global Frontier</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {langKey === 'id' ? 'Bahasa Global Berikutnya (Segera Hadir)' :
                   langKey === 'ms' ? 'Bahasa Global Seterusnya (Akan Datang)' :
                   langKey === 'ja' ? '順次拡大予定のグローバル言語（近日公開）' :
                   langKey === 'ko' ? '추가 예정 글로벌 지원 언어 (출시 예정)' :
                   langKey === 'zh' ? '即将推出的全球语言（敬请期待）' :
                   langKey === 'zh-TW' ? '即將推出的全球語言（敬請期待）' :
                   langKey === 'vi' ? 'Các Ngôn Ngữ Toàn Cầu Sắp Ra Mắt (Sắp Có)' :
                   langKey === 'th' ? 'ภาษาทั่วโลกที่กำลังจะเปิดตัว (เร็วๆ นี้)' :
                   langKey === 'hi' ? 'आगामी वैश्विक भाषाएं (जल्द आ रही हैं)' :
                   langKey === 'fil' ? 'Mga Paparating na Pandaigdigang Wika (Malapit Na)' :
                   'Upcoming Global Languages (Coming Soon)'}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {langKey === 'id'
                    ? 'Model suara & pemahaman formulir kami sedang dilatih untuk mendukung penutur di Eropa, Timur Tengah, dan Amerika Latin.' :
                   langKey === 'ms'
                    ? 'Model suara & pemahaman borang kami sedang dilatih untuk penutur di Eropah, Timur Tengah, dan Amerika Latin.' :
                   langKey === 'ja'
                    ? '欧州、中東、中南米のユーザーを支援するため、音声モデルと文脈解析を順次拡大しています。' :
                   langKey === 'ko'
                    ? '유럽, 중동, 라틴 아메리카 사용자를 위해 음성 모델과 문맥 분석을 확장하고 있습니다.' :
                   langKey === 'zh'
                    ? '我们正持续训练语音模型与表单上下文理解能力，以服务欧洲、中东及拉美地区的用户。' :
                   langKey === 'zh-TW'
                    ? '我們正持續訓練語音模型與表單上下文理解能力，以服務歐洲、中東及拉丁美洲的使用者。' :
                   langKey === 'vi'
                    ? 'Mô hình giọng nói và phân tích ngữ cảnh đang được mở rộng cho người dùng tại Châu Âu, Trung Đông và Châu Mỹ Latinh.' :
                   langKey === 'th'
                    ? 'โมเดลเสียงและการประมวลผลแบบฟอร์มกำลังได้รับการพัฒนาเพื่อรองรับผู้ใช้ในยุโรป ตะวันออกกลาง และละตินอเมริกา' :
                   langKey === 'hi'
                    ? 'यूरोप, मध्य पूर्व और लैटिन अमेरिका के उपयोगकर्ताओं की सेवा के लिए हमारे वॉयस मॉडल का विस्तार किया जा रहा है।' :
                   langKey === 'fil'
                    ? 'Kasalukuyang pinalalawak ang mga voice model para sa mga gumagamit sa Europa, Gitnang Silangan, at Latin America.' :
                    'Voice models and context parsing are currently being expanded to serve users across Europe, Latin America, and the Middle East.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                {
                  name: 'Spanish',
                  nativeName: 'Español',
                  flag: '🇪🇸',
                  svg: '<svg viewBox="0 0 640 480" width="32" height="24" class="rounded shadow-xs"><path fill="#c60b1e" d="M0 0h640v480H0z"/><path fill="#ffc400" d="M0 120h640v240H0z"/></svg>'
                },
                {
                  name: 'French',
                  nativeName: 'Français',
                  flag: '🇫🇷',
                  svg: '<svg viewBox="0 0 640 480" width="32" height="24" class="rounded shadow-xs border border-slate-200"><path fill="#002654" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#ce1126" d="M426.7 0H640v480H426.7z"/></svg>'
                },
                {
                  name: 'German',
                  nativeName: 'Deutsch',
                  flag: '🇩🇪',
                  svg: '<svg viewBox="0 0 640 480" width="32" height="24" class="rounded shadow-xs"><path fill="#000" d="M0 0h640v160H0z"/><path fill="#dd0000" d="M0 160h640v160H0z"/><path fill="#ffce00" d="M0 320h640v160H0z"/></svg>'
                },
                {
                  name: 'Arabic',
                  nativeName: 'العربية',
                  flag: '🇸🇦',
                  svg: '<svg viewBox="0 0 640 480" width="32" height="24" class="rounded shadow-xs"><path fill="#006c35" d="M0 0h640v480H0z"/><circle fill="#fff" cx="320" cy="240" r="40"/></svg>'
                },
                {
                  name: 'Russian',
                  nativeName: 'Русский',
                  flag: '🇷🇺',
                  svg: '<svg viewBox="0 0 640 480" width="32" height="24" class="rounded shadow-xs border border-slate-200"><path fill="#fff" d="M0 0h640v160H0z"/><path fill="#0039a6" d="M0 160h640v160H0z"/><path fill="#d52b1e" d="M0 320h640v160H0z"/></svg>'
                },
                {
                  name: 'Portuguese',
                  nativeName: 'Português',
                  flag: '🇧🇷',
                  svg: '<svg viewBox="0 0 640 480" width="32" height="24" class="rounded shadow-xs"><path fill="#009c3b" d="M0 0h640v480H0z"/><polygon fill="#ffdf00" points="320,60 580,240 320,420 60,240"/><circle fill="#002776" cx="320" cy="240" r="90"/></svg>'
                },
                {
                  name: 'Turkish',
                  nativeName: 'Türkçe',
                  flag: '🇹🇷',
                  svg: '<svg viewBox="0 0 640 480" width="32" height="24" class="rounded shadow-xs"><path fill="#e30a17" d="M0 0h640v480H0z"/><circle fill="#fff" cx="260" cy="240" r="120"/><circle fill="#e30a17" cx="290" cy="240" r="96"/><polygon fill="#fff" points="370,240 410,252 385,220 385,260 410,228"/></svg>'
                },
                {
                  name: 'Italian',
                  nativeName: 'Italiano',
                  flag: '🇮🇹',
                  svg: '<svg viewBox="0 0 640 480" width="32" height="24" class="rounded shadow-xs border border-slate-200"><path fill="#009246" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#ce2b37" d="M426.7 0H640v480H426.7z"/></svg>'
                },
                {
                  name: 'Dutch',
                  nativeName: 'Nederlands',
                  flag: '🇳🇱',
                  svg: '<svg viewBox="0 0 640 480" width="32" height="24" class="rounded shadow-xs border border-slate-200"><path fill="#ae1c28" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#21468b" d="M0 320h640v160H0z"/></svg>'
                },
                {
                  name: 'Polish',
                  nativeName: 'Polski',
                  flag: '🇵🇱',
                  svg: '<svg viewBox="0 0 640 480" width="32" height="24" class="rounded shadow-xs border border-slate-200"><path fill="#fff" d="M0 0h640v240H0z"/><path fill="#dc143c" d="M0 240h640v240H0z"/></svg>'
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative p-4 rounded-xl bg-white border border-dashed border-slate-300 hover:border-amber-400 hover:bg-amber-50/20 transition-all shadow-2xs group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-8 h-6 overflow-hidden rounded shadow-xs shrink-0"
                      dangerouslySetInnerHTML={{ __html: item.svg }}
                    />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs tracking-wider uppercase">
                      SOON
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
                      {item.nativeName}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {item.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {i18n.ctaTitle}
          </h2>
          <p className="mt-3 text-blue-100 text-base sm:text-lg max-w-xl mx-auto">
            {i18n.ctaSubtitle}
          </p>
          <div className="mt-8 flex justify-center">
            <a href="/download">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-slate-100 font-bold px-8 shadow-xl">
                <DownloadCloud className="w-5 h-5 text-blue-600 mr-2" />
                <span>{i18n.ctaBtn}</span>
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer t={t} />
    </div>
  )
}
