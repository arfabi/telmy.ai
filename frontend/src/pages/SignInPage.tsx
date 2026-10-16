import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { loginWithGoogle } from '@/services/firebase'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Shield, Sparkles, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react'

export const SignInPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const { userProfile } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to sign in with Google account.')
    } finally {
      setLoading(false)
    }
  }

  // If already logged in, redirect cleanly to dashboard without firing auth popup
  React.useEffect(() => {
    if (userProfile?.uid) {
      navigate('/dashboard', { replace: true })
    }
  }, [userProfile, navigate])

  const strings: Record<string, { title: string; subtitle: string; googleBtn: string; privacyLine: string; trust1: string; trust2: string; trust3: string; backHome: string }> = {
    en: {
      title: "Sign in to Telmy.ai",
      subtitle: "Access your encrypted Smart Vault profiles, form submission history, and cloud quota.",
      googleBtn: "Continue with Google Account",
      privacyLine: "Zero-Knowledge Architecture: We never see or store your decrypted form inputs.",
      trust1: "5 free forms refreshed automatically every month",
      trust2: "Seamless synchronization with Chrome Extension sidepanel",
      trust3: "AES-256 client-side encryption for passport & identity dossiers",
      backHome: "← Back to Home"
    },
    id: {
      title: "Masuk ke Akun Telmy.ai",
      subtitle: "Akses brankas profil terenkripsi, riwayat formulir, dan kuota panduan cloud Anda.",
      googleBtn: "Lanjutkan dengan Akun Google",
      privacyLine: "Arsitektur Zero-Knowledge: Data formulir Anda didekripsi hanya di perangkat lokal Anda.",
      trust1: "5 kuota formulir gratis diperbarui otomatis setiap bulan baru",
      trust2: "Sinkronisasi otomatis dengan panel samping ekstensi Chrome",
      trust3: "Enkripsi AES-256 lokal untuk nomor paspor, NIK, dan dokumen identitas",
      backHome: "← Kembali ke Beranda"
    },
    ja: {
      title: "Telmy.ai にログイン",
      subtitle: "暗号化保管庫、申請履歴、およびクラウドアシスト利用枠へアクセスします。",
      googleBtn: "Google アカウントで続行",
      privacyLine: "ゼロ知識設計：フォームの入力内容はローカルでのみ安全に複合化されます。",
      trust1: "毎月5件のフォーム入力枠が自動リフレッシュ（永久無料）",
      trust2: "Chrome 拡張機能サイドパネルとシームレスに同期",
      trust3: "パスポート番号や個人情報を端末内 AES-256 で強固に保護",
      backHome: "← ホームに戻る"
    },
    ko: {
      title: "Telmy.ai 로그인",
      subtitle: "암호화 스마트 볼트, 이전 작성 내역 및 클라우드 이용량 확인을 위해 로그인하세요.",
      googleBtn: "Google 계정으로 계속하기",
      privacyLine: "영지식 아키텍처: 귀하의 서식 입력 정보는 오직 본인 기기 내에서만 복호화됩니다.",
      trust1: "매월 5개 양식 무료 지원 크레딧 자동 충전",
      trust2: "Chrome 확장 프로그램 사이드 패널과 즉시 연동",
      trust3: "여권 및 신원 증빙 데이터 AES-256 단말기 내 암호화",
      backHome: "← 홈으로 돌아가기"
    },
    zh: {
      title: "登录 Telmy.ai 平台",
      subtitle: "畅享本地加密保险库、历史填表记录与云端智能辅助配额。",
      googleBtn: "使用 Google 账号继续",
      privacyLine: "零知识隐私保护：您的真实填报内容仅在您本地设备端解密呈现。",
      trust1: "每月 5 次官方表单免费辅导额度月初自动回满",
      trust2: "与 Chrome 浏览器扩展侧边栏实时极速同步",
      trust3: "护照及公民身份档案采用本地 AES-256 硬件级加密",
      backHome: "← 返回首页"
    },
    'zh-TW': {
      title: "登入 Telmy.ai 平台",
      subtitle: "暢享本機加密保險庫、歷史填表紀錄與雲端智慧輔助配額。",
      googleBtn: "使用 Google 帳號繼續",
      privacyLine: "零知識隱私保護：您的真實填報內容僅在您本機裝置端解密呈現。",
      trust1: "每月 5 次官方表單免費輔導額度月初自動回滿",
      trust2: "與 Chrome 瀏覽器擴充功能側邊欄即時極速同步",
      trust3: "護照及公民身分檔案採用本機 AES-256 硬體級加密",
      backHome: "← 返回首頁"
    },
    vi: {
      title: "Đăng nhập vào Telmy.ai",
      subtitle: "Truy cập két bảo mật, lịch sử biểu mẫu và hạn mức trợ lý đám mây của bạn.",
      googleBtn: "Tiếp tục với tài khoản Google",
      privacyLine: "Kiến trúc không kiến thức: Dữ liệu của bạn chỉ được giải mã trên thiết bị của bạn.",
      trust1: "5 lượt điền biểu mẫu miễn phí tự động làm mới hàng tháng",
      trust2: "Đồng bộ liền mạch với bảng điều khiển tiện ích Chrome",
      trust3: "Mã hóa AES-256 cục bộ cho hộ chiếu và giấy tờ tùy thân",
      backHome: "← Quay lại Trang chủ"
    },
    th: {
      title: "เข้าสู่ระบบ Telmy.ai",
      subtitle: "เข้าถึงโปรไฟล์ที่เข้ารหัส ประวัติแบบฟอร์ม และโควตาการใช้งานของคุณ",
      googleBtn: "ดำเนินการต่อด้วยบัญชี Google",
      privacyLine: "สถาปัตยกรรม Zero-Knowledge: ข้อมูลของคุณจะถูกถอดรหัสบนอุปกรณ์ของคุณเท่านั้น",
      trust1: "ฟรี 5 แบบฟอร์มต่อเดือน รีเฟรชโควตาอัตโนมัติ",
      trust2: "เชื่อมโยงกับส่วนขยาย Chrome แบบไร้รอยต่อ",
      trust3: "การเข้ารหัส AES-256 ในเครื่องเพื่อความปลอดภัยสูงสุด",
      backHome: "← กลับสู่หน้าแรก"
    },
    hi: {
      title: "Telmy.ai में साइन इन करें",
      subtitle: "अपने एन्क्रिप्टेड स्मार्ट वॉल्ट और फॉर्म इतिहास तक पहुंचें।",
      googleBtn: "Google खाते के साथ जारी रखें",
      privacyLine: "जीरो-नॉलेज सुरक्षा: आपका डेटा केवल आपके डिवाइस पर ही डिक्रिप्ट होता है।",
      trust1: "हर महीने 5 मुफ्त फॉर्म कोटा स्वचालित रूप से रीसेट",
      trust2: "Chrome एक्सटेंशन के साथ आसान सिंक",
      trust3: "पासपोर्ट डेटा के लिए स्थानीय AES-256 एन्क्रिप्शन",
      backHome: "← होम पर वापस जाएं"
    },
    fil: {
      title: "Mag-sign in sa Telmy.ai",
      subtitle: "I-access ang iyong encrypted vault, kasaysayan ng form, at quota.",
      googleBtn: "Magpatuloy gamit ang Google Account",
      privacyLine: "Zero-Knowledge Architecture: Ang iyong data ay nananatili sa iyong device.",
      trust1: "5 libreng form bawat buwan na kusang nagre-refresh",
      trust2: "Direktang naka-sync sa Chrome extension",
      trust3: "AES-256 encryption para sa iyong pasaporte at ID",
      backHome: "← Bumalik sa Home"
    },
    ms: {
      title: "Log Masuk ke Telmy.ai",
      subtitle: "Akses peti kebal terenkripsi, sejarah borang, dan kuota bantuan awan anda.",
      googleBtn: "Teruskan dengan Akaun Google",
      privacyLine: "Seni Bina Sifar Pengetahuan: Data borang anda hanya didekripsikan pada peranti anda.",
      trust1: "5 kuota borang percuma diperbaharui setiap bulan baharu",
      trust2: "Penyelarasan lancar dengan panel sisi sambungan Chrome",
      trust3: "Penyulitan AES-256 tempatan untuk pasport dan dokumen pengenalan",
      backHome: "← Kembali ke Laman Utama"
    },
  }

  const langKey = currentLang in strings ? currentLang : 'en'
  const s = strings[langKey]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md w-full space-y-8">
          
          <div className="text-center">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {s.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {s.subtitle}
            </p>
          </div>

          <Card className="p-8 bg-white border border-slate-200/90 rounded-3xl shadow-lg shadow-slate-200/50 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-slate-400 h-13 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-slate-800 font-bold">{loading ? 'Connecting...' : s.googleBtn}</span>
            </Button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase">Zero-Knowledge</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Value bullets */}
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{s.trust1}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{s.trust2}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{s.trust3}</span>
              </li>
            </ul>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 text-center leading-relaxed">
              <Shield className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
              <span>{s.privacyLine}</span>
            </div>
          </Card>

          <div className="text-center">
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
              {s.backHome}
            </Link>
          </div>

        </div>
      </main>

      <Footer t={t} />
    </div>
  )
}
