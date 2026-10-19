import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { JAPAC_LANGUAGES } from '@/data/languages'
import { useLanguage } from '@/context/LanguageContext'
import { Volume2, Sparkles, ArrowRight, Play, Pause } from 'lucide-react'

// Upcoming Global Languages with "SOON" status
export const UPCOMING_LANGUAGES = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
]

export const LanguageMarquee: React.FC = () => {
  const { lang } = useLanguage()
  const [isPaused, setIsPaused] = useState(false)

  // Localized texts based on active language
  const texts: Record<string, { badge: string; title: string; subtitle: string; pause: string; play: string; explore: string; note: string; cta: string }> = {
    en: {
      badge: "Global Language Coverage",
      title: "Explanations in your native language",
      subtitle: "Natural AI voice and form guidance in 11 Asia-Pacific languages today, with European and Middle-Eastern languages actively being rolled out.",
      pause: "Pause Ticker",
      play: "Resume Ticker",
      explore: "Explore Language Details",
      note: "✓ 11 Asia-Pacific languages fully ready. Have a specific language requirement for your embassy or university?",
      cta: "Request a Language or Check Features Matrix →"
    },
    id: {
      badge: "Cakupan Bahasa Global",
      title: "Penjelasan dalam bahasa ibu Anda",
      subtitle: "Panduan formulir dan suara AI alami dalam 11 bahasa resmi Asia-Pasifik, dengan bahasa Eropa dan Timur Tengah sedang aktif dikembangkan.",
      pause: "Jeda Ticker",
      play: "Lanjutkan Ticker",
      explore: "Lihat Detail Bahasa",
      note: "✓ 11 bahasa Asia-Pasifik siap digunakan. Butuh bahasa khusus untuk kedutaan atau universitas Anda?",
      cta: "Minta Bahasa Baru atau Cek Matriks Fitur →"
    },
    ja: {
      badge: "グローバル言語対応",
      title: "あなたの母国語で、公的フォームをわかりやすく解説",
      subtitle: "アジア太平洋地域の主要11言語で自然なAI音声と文脈解説を提供中。欧州・中東言語も順次拡大しています。",
      pause: "停止",
      play: "再開",
      explore: "対応言語の詳細を見る",
      note: "✓ アジア太平洋11言語に完全対応。大使館や大学申請で特定の言語が必要ですか？",
      cta: "追加言語のリクエスト・機能一覧へ →"
    },
    ko: {
      badge: "글로벌 다국어 지원",
      title: "가장 편안한 모국어로 공공 서식을 이해하세요",
      subtitle: "아시아 태평양 11개 주요 언어로 자연스러운 AI 음성 및 문맥 해설 제공. 유럽 및 중동 언어도 적극 확장 중입니다.",
      pause: "일시정지",
      play: "재생",
      explore: "지원 언어 상세 보기",
      note: "✓ 11개 아시아 태평양 언어 지원 완료. 대사관이나 대학에 필요한 특정 언어가 있으신가요?",
      cta: "언어 추가 요청 및 기능 매트릭스 확인 →"
    },
    zh: {
      badge: "全球多语言覆盖",
      title: "用您的母语，轻松理解官方公文表格",
      subtitle: "目前支持亚太 11 种主要官方语言的自然 AI 语音与填写指引，欧美及中东语言正持续拓展中。",
      pause: "暂停轮播",
      play: "恢复轮播",
      explore: "查看完整语言支持",
      note: "✓ 亚太 11 种官方语言已全面就绪。您的使领馆或留学申请有特定语言需求吗？",
      cta: "申请新增语言或查看功能矩阵 →"
    },
    'zh-TW': {
      badge: "全球多語言支援",
      title: "以您的母語，輕鬆搞懂繁瑣公文表格",
      subtitle: "目前支援亞太 11 種主要官方語言的自然 AI 語音與填寫指引，歐美及中東語言正持續擴充中。",
      pause: "暫停輪播",
      play: "繼續輪播",
      explore: "查看完整語言支援",
      note: "✓ 亞太 11 種官方語言已全面就緒。您的使領館或留學申請有特定語言需求嗎？",
      cta: "申請新增語言或查看功能清單 →"
    }
  }

  const cur = texts[lang] || texts.en

  return (
    <section className="py-16 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{cur.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {cur.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              {cur.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? cur.play : cur.pause}</span>
            </button>
            <Link
              to="/features#languages"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>{cur.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Marquee Row 1: Active 11 Languages (Voice + Text) */}
      <div className="relative w-full overflow-hidden mb-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className={`flex gap-3 w-max ${
            isPaused ? '' : 'animate-marquee hover:[animation-play-state:paused]'
          }`}
          style={{ animationDuration: '75s' }}
        >
          {/* Double list for smooth infinite looping */}
          {[...JAPAC_LANGUAGES, ...JAPAC_LANGUAGES].map((l, idx) => (
            <div
              key={`${l.code}-${idx}`}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:border-blue-400 hover:bg-blue-50/50 transition-all shrink-0 group"
            >
              <div
                className="w-5 h-3.5 overflow-hidden rounded-xs shrink-0"
                dangerouslySetInnerHTML={{ __html: l.svg }}
              />
              <span className="text-sm font-bold text-slate-800">{l.nativeName}</span>
              <span className="text-xs text-slate-500 font-medium">({l.name})</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <Volume2 className="w-3 h-3 text-emerald-600" />
                Voice + Text
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2: Upcoming Languages with SOON badge (Reverse direction) */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className={`flex gap-3 w-max ${
            isPaused ? '' : 'animate-marquee-reverse hover:[animation-play-state:paused]'
          }`}
          style={{ animationDuration: '85s' }}
        >
          {[...UPCOMING_LANGUAGES, ...UPCOMING_LANGUAGES, ...UPCOMING_LANGUAGES].map((l, idx) => (
            <div
              key={`${l.code}-${idx}`}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-dashed border-slate-300 shadow-2xs hover:border-amber-400 transition-all shrink-0 group"
            >
              <span className="text-lg leading-none shrink-0">{l.flag}</span>
              <span className="text-sm font-semibold text-slate-700">{l.nativeName}</span>
              <span className="text-xs text-slate-400 font-medium">({l.name})</span>
              <span className="inline-flex items-center text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs uppercase">
                SOON
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap Note below marquee */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>{cur.note}</span>
        <Link to="/features" className="text-blue-600 font-bold hover:underline shrink-0">
          {cur.cta}
        </Link>
      </div>
    </section>
  )
}
