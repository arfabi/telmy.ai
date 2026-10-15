import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, CheckCircle2, Laptop, ShieldCheck } from 'lucide-react'

export const ConnectPage: React.FC = () => {
  const { currentLang } = useLanguage()

  const strings: Record<string, {
    back: string
    title: string
    subtitle: string
    tokenReady: string
    vaultEncrypted: string
    connectBtn: string
    cancelBtn: string
  }> = {
    en: {
      back: "Back to Dashboard",
      title: "Connect Telmy Extension",
      subtitle: "Synchronize your form quota and local browser vault seamlessly with your account.",
      tokenReady: "Secure pairing token is ready to connect",
      vaultEncrypted: "Vault data remains encrypted client-side on your device",
      connectBtn: "Connect Extension Now",
      cancelBtn: "Cancel and return to dashboard"
    },
    id: {
      back: "Kembali ke Dashboard",
      title: "Hubungkan Ekstensi Telmy",
      subtitle: "Sinkronkan kuota formulir dan brankas lokal browser Anda dengan akun dashboard.",
      tokenReady: "Token autentikasi aman siap dipasangkan",
      vaultEncrypted: "Data brankas tetap terenkripsi di sisi klien",
      connectBtn: "Hubungkan Sekarang",
      cancelBtn: "Batalkan dan kembali"
    },
    ja: {
      back: "ダッシュボードに戻る",
      title: "Telmy 拡張機能を連携",
      subtitle: "フォーム利用枠とローカル保管庫をアカウントと安全に同期します。",
      tokenReady: "安全なペアリングトークンの準備が完了しました",
      vaultEncrypted: "保管庫データはお手元の端末内で暗号化されたまま保護されます",
      connectBtn: "今すぐ拡張機能を連携",
      cancelBtn: "キャンセルして戻る"
    },
    ko: {
      back: "대시보드로 돌아가기",
      title: "Telmy 확장 프로그램 연동",
      subtitle: "양식 작성 지원 쿼터와 로컬 브라우저 볼트를 대시보드 계정과 동기화합니다.",
      tokenReady: "안전한 기기 페어링 토큰 준비 완료",
      vaultEncrypted: "개인 볼트 데이터는 오직 사용자 기기 내에서만 암호화 유지",
      connectBtn: "지금 확장 프로그램 연동하기",
      cancelBtn: "취소하고 돌아가기"
    },
    zh: {
      back: "返回控制面板",
      title: "连接 Telmy 浏览器扩展",
      subtitle: "将您的表单智能辅导额度与本地加密保险库同当前账户无缝同步。",
      tokenReady: "高强度安全配对密钥已准备就绪",
      vaultEncrypted: "保险库敏感数据始终在您本地设备端保持加密",
      connectBtn: "立即连接扩展程序",
      cancelBtn: "取消并返回控制台"
    },
    'zh-TW': {
      back: "返回控制面板",
      title: "連接 Telmy 瀏覽器擴充功能",
      subtitle: "將您的表單智慧輔導額度與本機加密保險庫同當前帳戶無縫同步。",
      tokenReady: "高強度安全配對金鑰已準備就緒",
      vaultEncrypted: "保險庫敏感資料始終在您本機裝置端保持加密",
      connectBtn: "立即連接擴充功能",
      cancelBtn: "取消並返回控制台"
    },
    vi: {
      back: "Quay lại Bảng điều khiển",
      title: "Kết nối Tiện ích Telmy",
      subtitle: "Đồng bộ hạn mức biểu mẫu và két bảo mật trình duyệt với tài khoản của bạn.",
      tokenReady: "Mã ghép nối an toàn đã sẵn sàng",
      vaultEncrypted: "Dữ liệu két luôn được mã hóa an toàn trên thiết bị của bạn",
      connectBtn: "Kết nối tiện ích ngay",
      cancelBtn: "Hủy và quay lại"
    },
    th: {
      back: "กลับสู่แดชบอร์ด",
      title: "เชื่อมต่อส่วนขยาย Telmy",
      subtitle: "ซิงค์โควตาแบบฟอร์มและตู้นิรภัยในเครื่องของคุณกับบัญชีแดชบอร์ด",
      tokenReady: "โทเค็นการจับคู่อย่างปลอดภัยพร้อมใช้งานแล้ว",
      vaultEncrypted: "ข้อมูลตู้นิรภัยยังคงได้รับการเข้ารหัสบนอุปกรณ์ของคุณ",
      connectBtn: "เชื่อมต่อส่วนขยายตอนนี้",
      cancelBtn: "ยกเลิกและย้อนกลับ"
    },
    hi: {
      back: "डैशबोर्ड पर वापस जाएं",
      title: "Telmy एक्सटेंशन कनेक्ट करें",
      subtitle: "अपने फॉर्म कोटा और स्थानीय वॉल्ट को अपने डैशबोर्ड खाते के साथ सिंक करें।",
      tokenReady: "सुरक्षित पेयरिंग टोकन तैयार है",
      vaultEncrypted: "वॉल्ट डेटा केवल आपके डिवाइस पर ही एन्क्रिप्ट रहता है",
      connectBtn: "अभी एक्सटेंशन कनेक्ट करें",
      cancelBtn: "रद्द करें और वापस जाएं"
    },
    fil: {
      back: "Bumalik sa Dashboard",
      title: "Ikonekta ang Telmy Extension",
      subtitle: "I-synchronize ang iyong form quota at local browser vault sa iyong account.",
      tokenReady: "Handa na ang secure pairing token",
      vaultEncrypted: "Ang data ng vault ay nananatiling naka-encrypt sa iyong device",
      connectBtn: "Ikonekta ang Extension Ngayon",
      cancelBtn: "Kanselahin at bumalik"
    },
    ms: {
      back: "Kembali ke Papan Pemuka",
      title: "Sambungkan Sambungan Telmy",
      subtitle: "Selaraskan kuota borang dan peti kebal penyemak imbas tempatan dengan akaun anda.",
      tokenReady: "Token pasangan selamat sedia disambungkan",
      vaultEncrypted: "Data peti kebal kekal terenkripsi pada peranti anda",
      connectBtn: "Sambungkan Sambungan Sekarang",
      cancelBtn: "Batal dan kembali"
    }
  }

  const s = strings[currentLang] || strings.en

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

          <div className="mt-8 space-y-3">
            <Button size="lg" className="w-full font-bold">
              {s.connectBtn}
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

