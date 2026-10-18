import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { loginWithGoogle, syncUserWithBackend } from '@/services/firebase'
import { ArrowLeft, CheckCircle2, Laptop, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react'

export const ConnectPage: React.FC = () => {
  const { currentLang } = useLanguage()
  const { userProfile, updateUserProfile } = useAuth()
  const navigate = useNavigate()

  const [connecting, setConnecting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const strings: Record<string, {
    back: string
    title: string
    subtitle: string
    tokenReady: string
    vaultEncrypted: string
    connectBtn: string
    connectingBtn: string
    successMsg: string
    cancelBtn: string
  }> = {
    en: {
      back: "Back to Dashboard",
      title: "Connect Telmy Extension",
      subtitle: "Synchronize your form quota and local browser vault seamlessly with your account.",
      tokenReady: "Secure pairing token is ready to connect",
      vaultEncrypted: "Vault data remains encrypted client-side on your device",
      connectBtn: "Connect Extension Now",
      connectingBtn: "Pairing Extension...",
      successMsg: "Extension Connected! Redirecting to Dashboard...",
      cancelBtn: "Cancel and return to dashboard"
    },
    id: {
      back: "Kembali ke Dashboard",
      title: "Hubungkan Ekstensi Telmy",
      subtitle: "Sinkronkan kuota formulir dan brankas lokal browser Anda dengan akun dashboard.",
      tokenReady: "Token autentikasi aman siap dipasangkan",
      vaultEncrypted: "Data brankas tetap terenkripsi di sisi klien",
      connectBtn: "Hubungkan Sekarang",
      connectingBtn: "Menghubungkan Ekstensi...",
      successMsg: "Ekstensi Berhasil Terhubung! Mengalihkan ke Dashboard...",
      cancelBtn: "Batalkan dan kembali"
    },
    ja: {
      back: "ダッシュボードに戻る",
      title: "Telmy 拡張機能を連携",
      subtitle: "フォーム利用枠とローカル保管庫をアカウントと安全に同期します。",
      tokenReady: "安全なペアリングトークンの準備が完了しました",
      vaultEncrypted: "保管庫データはお手元の端末内で暗号化されたまま保護されます",
      connectBtn: "今すぐ拡張機能を連携",
      connectingBtn: "拡張機能を連携中...",
      successMsg: "連携完了！ダッシュボードに移動します...",
      cancelBtn: "キャンセルして戻る"
    },
    ko: {
      back: "대시보드로 돌아가기",
      title: "Telmy 확장 프로그램 연동",
      subtitle: "양식 작성 지원 쿼터와 로컬 브라우저 볼트를 대시보드 계정과 동기화합니다.",
      tokenReady: "안전한 기기 페어링 토큰 준비 완료",
      vaultEncrypted: "개인 볼트 데이터는 오직 사용자 기기 내에서만 암호화 유지",
      connectBtn: "지금 확장 프로그램 연동하기",
      connectingBtn: "확장 프로그램 연동 중...",
      successMsg: "확장 프로그램 연동 완료! 대시보드로 이동합니다...",
      cancelBtn: "취소하고 돌아가기"
    },
    zh: {
      back: "返回控制面板",
      title: "连接 Telmy 浏览器扩展",
      subtitle: "将您的表单智能辅导额度与本地加密保险库同当前账户无缝同步。",
      tokenReady: "高强度安全配对密钥已准备就绪",
      vaultEncrypted: "保险库敏感数据始终在您本地设备端保持加密",
      connectBtn: "立即连接扩展程序",
      connectingBtn: "正在配对扩展程序...",
      successMsg: "扩展程序已成功连接！正在返回控制面板...",
      cancelBtn: "取消并返回控制台"
    },
    'zh-TW': {
      back: "返回控制面板",
      title: "連接 Telmy 瀏覽器擴充功能",
      subtitle: "將您的表單智慧輔導額度與本機加密保險庫同當前帳戶無縫同步。",
      tokenReady: "高強度安全配對金鑰已準備就緒",
      vaultEncrypted: "保險庫敏感資料始終在您本機裝置端保持加密",
      connectBtn: "立即連接擴充功能",
      connectingBtn: "正在配對擴充功能...",
      successMsg: "擴充功能已成功連接！正在返回控制台...",
      cancelBtn: "取消並返回控制台"
    },
    vi: {
      back: "Quay lại Bảng điều khiển",
      title: "Kết nối Tiện ích Telmy",
      subtitle: "Đồng bộ hạn mức biểu mẫu và két bảo mật trình duyệt với tài khoản của bạn.",
      tokenReady: "Mã ghép nối an toàn đã sẵn sàng",
      vaultEncrypted: "Dữ liệu két luôn được mã hóa an toàn trên thiết bị của bạn",
      connectBtn: "Kết nối tiện ích ngay",
      connectingBtn: "Đang ghép nối tiện ích...",
      successMsg: "Đã kết nối thành công! Đang chuyển hướng...",
      cancelBtn: "Hủy và quay lại"
    },
    th: {
      back: "กลับสู่แดชบอร์ด",
      title: "เชื่อมต่อส่วนขยาย Telmy",
      subtitle: "ซิงค์โควตาแบบฟอร์มและตู้นิรภัยในเครื่องของคุณกับบัญชีแดชบอร์ด",
      tokenReady: "โทเค็นการจับคู่อย่างปลอดภัยพร้อมใช้งานแล้ว",
      vaultEncrypted: "ข้อมูลตู้นิรภัยยังคงได้รับการเข้ารหัสบนอุปกรณ์ของคุณ",
      connectBtn: "เชื่อมต่อส่วนขยายตอนนี้",
      connectingBtn: "กำลังจับคู่ส่วนขยาย...",
      successMsg: "เชื่อมต่อส่วนขยายสำเร็จ! กำลังนำทาง...",
      cancelBtn: "ยกเลิกและย้อนกลับ"
    },
    hi: {
      back: "डैशबोर्ड पर वापस जाएं",
      title: "Telmy एक्सटेंशन कनेक्ट करें",
      subtitle: "अपने फॉर्म कोटा और स्थानीय वॉल्ट को अपने डैशबोर्ड खाते के साथ सिंक करें।",
      tokenReady: "सुरक्षित पेयरिंग टोकन तैयार है",
      vaultEncrypted: "वॉल्ट डेटा केवल आपके डिवाइस पर ही एन्क्रिप्ट रहता है",
      connectBtn: "अभी एक्सटेंशन कनेक्ट करें",
      connectingBtn: "एक्सटेंशन जोड़ा जा रहा है...",
      successMsg: "एक्सटेंशन सफलतापूर्वक कनेक्ट हो गया! रीडायरेक्ट हो रहा है...",
      cancelBtn: "रद्द करें और वापस जाएं"
    },
    fil: {
      back: "Bumalik sa Dashboard",
      title: "Ikonekta ang Telmy Extension",
      subtitle: "I-synchronize ang iyong form quota at local browser vault sa iyong account.",
      tokenReady: "Handa na ang secure pairing token",
      vaultEncrypted: "Ang data ng vault ay nananatiling naka-encrypt sa iyong device",
      connectBtn: "Ikonekta ang Extension Ngayon",
      connectingBtn: "Ikinokonekta ang Extension...",
      successMsg: "Matagumpay na Naikonekta ang Extension! Nagre-redirect...",
      cancelBtn: "Kanselahin at bumalik"
    },
    ms: {
      back: "Kembali ke Papan Pemuka",
      title: "Sambungkan Sambungan Telmy",
      subtitle: "Selaraskan kuota borang dan peti kebal penyemak imbas tempatan dengan akaun anda.",
      tokenReady: "Token pasangan selamat sedia disambungkan",
      vaultEncrypted: "Data peti kebal kekal terenkripsi pada peranti anda",
      connectBtn: "Sambungkan Sambungan Sekarang",
      connectingBtn: "Menyambungkan Sambungan...",
      successMsg: "Sambungan Berjaya Dihubungkan! Mengalihkan ke Papan Pemuka...",
      cancelBtn: "Batal dan kembali"
    }
  }

  const s = strings[currentLang] || strings.en

  const handleConnect = async () => {
    try {
      setConnecting(true)
      setErrorMsg(null)

      let targetUser = userProfile

      // If user is not yet logged in or has no account on this machine, trigger Google Sign-In
      if (!targetUser || !targetUser.uid) {
        const authedUser = await loginWithGoogle()
        targetUser = {
          uid: authedUser.uid,
          displayName: authedUser.displayName || authedUser.email?.split('@')[0] || 'Telmy User',
          email: authedUser.email || '',
          photoURL: authedUser.photoURL || '',
          plan: 'free',
          credits: 5,
          language: localStorage.getItem('telmy_lang') || 'en',
          isExtensionConnected: true
        }
      } else {
        targetUser = {
          ...targetUser,
          isExtensionConnected: true
        }
      }

      // Update state and localStorage
      updateUserProfile(targetUser)
      localStorage.setItem('telmy_user', JSON.stringify(targetUser))

      // Broadcast to Extension Content Script and Storage
      window.postMessage({ type: 'TELMY_USER_SESSION_SYNC', user: targetUser }, '*')

      setSuccess(true)

      // Gracefully redirect to dashboard after brief success confirmation
      setTimeout(() => {
        navigate('/dashboard')
      }, 1200)
    } catch (err: any) {
      console.error('[ConnectPage] Connection error:', err)
      setErrorMsg(err.message || 'Failed to connect extension. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>{s.back}</span>
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-16 flex-1 w-full flex flex-col items-center justify-center text-center">
        <Card className="p-8 sm:p-10 w-full shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Laptop className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {s.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {s.subtitle}
          </p>

          <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{s.tokenReady}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-blue-600" />
              <span>{s.vaultEncrypted}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center justify-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{s.successMsg}</span>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <Button 
              size="lg" 
              className="w-full font-bold shadow-md hover:shadow-lg transition-all"
              onClick={handleConnect}
              disabled={connecting || success}
            >
              {connecting ? s.connectingBtn : success ? s.successMsg : s.connectBtn}
            </Button>
            <Link to="/dashboard" className="block text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              {s.cancelBtn}
            </Link>
          </div>
        </Card>
      </main>
    </div>
  )
}
