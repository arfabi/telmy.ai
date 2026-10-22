import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DASHBOARD_I18N, DashboardI18n } from '@/data/dashboardI18n'
import { PRICING_TIERS_DATA, PricingTierItem } from '@/data/pricingData'
import { JAPAC_LANGUAGES } from '@/data/languages'
import { ACADEMY_ACTIVITIES } from '@/data/academyData'
import { encryptVault, decryptVault, VaultEnvelope } from '@/lib/cryptoVault'
import { getApiUrl } from '@/config/api'
import { 
  Zap, 
  Key, 
  History, 
  LogOut, 
  User, 
  RefreshCw, 
  CheckCircle2, 
  Shield, 
  CreditCard, 
  Lock,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Trash2,
  Edit2,
  GraduationCap,
  FileText,
  HelpCircle,
  Trophy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  AlertTriangle,
  Play,
  Volume2,
  Search,
  Check,
  Layers,
  Award,
  Laptop,
  Smartphone,
  Globe,
  Upload,
  X
} from 'lucide-react'

// 11 Asia-Pacific Countries (Displayed by country name & native language with cross-platform SVG flag)
export const DASHBOARD_COUNTRIES = [
  { code: 'id', flag: '🇮🇩', country: 'Indonesia', nativeName: 'Bahasa Indonesia', svg: JAPAC_LANGUAGES.find(l => l.code === 'id')?.svg },
  { code: 'en', flag: '🇺🇸', country: 'United States', nativeName: 'English (US)', svg: JAPAC_LANGUAGES.find(l => l.code === 'en')?.svg },
  { code: 'ja', flag: '🇯🇵', country: '日本 (Nihon)', nativeName: '日本語', svg: JAPAC_LANGUAGES.find(l => l.code === 'ja')?.svg },
  { code: 'ko', flag: '🇰🇷', country: '대한민국 (Daehan Minguk)', nativeName: '한국어', svg: JAPAC_LANGUAGES.find(l => l.code === 'ko')?.svg },
  { code: 'zh', flag: '🇨🇳', country: '中国 (Zhōngguó)', nativeName: '简体中文', svg: JAPAC_LANGUAGES.find(l => l.code === 'zh')?.svg },
  { code: 'zh-tw', flag: '🇹🇼', country: '台灣 (Taiwan)', nativeName: '繁體中文', svg: JAPAC_LANGUAGES.find(l => l.code.toLowerCase() === 'zh-tw')?.svg },
  { code: 'vi', flag: '🇻🇳', country: 'Việt Nam', nativeName: 'Tiếng Việt', svg: JAPAC_LANGUAGES.find(l => l.code === 'vi')?.svg },
  { code: 'th', flag: '🇹🇭', country: 'ประเทศไทย (Prathet Thai)', nativeName: 'ภาษาไทย', svg: JAPAC_LANGUAGES.find(l => l.code === 'th')?.svg },
  { code: 'hi', flag: '🇮🇳', country: 'भारत (Bharat)', nativeName: 'हिन्दी', svg: JAPAC_LANGUAGES.find(l => l.code === 'hi')?.svg },
  { code: 'fil', flag: '🇵🇭', country: 'Pilipinas', nativeName: 'Filipino', svg: JAPAC_LANGUAGES.find(l => l.code === 'fil')?.svg },
  { code: 'ms', flag: '🇲🇾', country: 'Malaysia', nativeName: 'Bahasa Melayu', svg: JAPAC_LANGUAGES.find(l => l.code === 'ms')?.svg }
]

const BIP39_WORDS = [
  'alpha', 'beacon', 'cable', 'daring', 'echo', 'falcon', 'galaxy', 'harbor',
  'island', 'jungle', 'kinetic', 'lunar', 'matrix', 'nebula', 'orbit', 'pulse',
  'quantum', 'radar', 'safari', 'titan', 'uranium', 'vector', 'walnut', 'zenith',
  'anchor', 'breeze', 'canyon', 'delta', 'ember', 'forest', 'glacier', 'horizon'
]

// Animated quotes on form-filling struggles in 11 JAPAC languages
const FORM_FRUSTRATION_QUOTES: Array<{ author: string; [langCode: string]: string }> = [
  {
    en: 'Filling out a form shouldn’t feel like solving a puzzle.',
    id: 'Mengisi formulir seharusnya tidak terasa seperti memecahkan teka-teki.',
    ja: 'フォームの入力は、パズルを解くような苦労であるべきではありません。',
    ko: '양식 작성이 퍼즐을 푸는 것처럼 느껴져서는 안 됩니다.',
    zh: '填写表单不应该像是在解复杂的谜题。',
    'zh-tw': '填寫表單不應該像是在解複雜的謎題。',
    vi: 'Điền biểu mẫu không nên mang lại cảm giác như đang giải câu đố.',
    th: 'การกรอกแบบฟอร์มไม่ควรให้ความรู้สึกเหมือนกำลังแก้ปริศนา',
    hi: 'फॉर्म भरना पहेली सुलझाने जैसा नहीं लगना चाहिए।',
    fil: 'Ang pagpuno ng form ay hindi dapat maging parang paglutas ng puzzle.',
    ms: 'Mengisi borang tidak sepatutnya terasa seperti menyelesaikan teka-teki.',
    author: 'UX Philosophy'
  },
  {
    en: 'Why is filling out a simple form harder than it should be?',
    id: 'Kenapa mengisi formulir sederhana bisa jauh lebih sulit dari yang seharusnya?',
    ja: 'なぜ簡単な申請フォームの入力が、これほど難しく感じるのでしょうか？',
    ko: '왜 단순한 양식 작성이 생각보다 훨씬 더 어려운 걸까요?',
    zh: '为什么填写一份简单的表格会比想象中困难得多？',
    'zh-tw': '為什麼填寫一份簡單的表格會比想像中困難得多？',
    vi: 'Tại sao việc điền một biểu mẫu đơn giản lại khó hơn mức cần thiết?',
    th: 'ทำไมการกรอกแบบฟอร์มง่ายๆ ถึงยากกว่าที่ควรจะเป็น?',
    hi: 'एक साधारण फॉर्म भरना इतना कठिन क्यों होना चाहिए?',
    fil: 'Bakit ang pagpuno ng simpleng form ay mas mahirap kaysa sa nararapat?',
    ms: 'Mengapakah mengisi borang mudah lebih sukar daripada yang sepatutnya?',
    author: 'User Reality'
  },
  {
    en: 'One form, a hundred questions, and absolutely no patience left.',
    id: 'Satu formulir, seratus pertanyaan, dan kesabaran yang sudah habis.',
    ja: 'ひとつの書類に100の質問、そして限界を迎えた忍耐力。',
    ko: '하나의 양식, 백 개의 질문, 그리고 이미 바닥난 인내심.',
    zh: '一张表格，上百个问题，早已耗尽所有的耐心。',
    'zh-tw': '一張表格，上百個問題，早已耗盡所有的耐心。',
    vi: 'Một biểu mẫu, một trăm câu hỏi, và sự kiên nhẫn đã hoàn toàn cạn kiệt.',
    th: 'แบบฟอร์มหนึ่งแผ่น คำถามนับร้อย และความอดทนที่ไม่เหลืออีกต่อไป',
    hi: 'एक फॉर्म, सौ सवाल, और बिल्कुल खत्म हो चुका धैर्य।',
    fil: 'Isang form, isang daang tanong, at ubos na ang pasensya.',
    ms: 'Satu borang, seratus soalan, dan kesabaran yang sudah pun habis.',
    author: 'Citizen Experience'
  },
  {
    en: 'The form is online, but my frustration is very real.',
    id: 'Formulirnya online, tetapi rasa frustrasiku benar-benar nyata.',
    ja: 'フォームはオンラインなのに、感じるストレスはあまりにも現実的です。',
    ko: '양식은 온라인이지만, 내가 느끼는 좌절감은 너무나 현실적입니다.',
    zh: '表格虽是在线电子版，但我的挫败感却是无比真实。',
    'zh-tw': '表格雖是在線電子版，但我的挫折感卻是無比真實。',
    vi: 'Biểu mẫu là trực tuyến, nhưng sự bực bội của tôi là hoàn toàn có thật.',
    th: 'แบบฟอร์มเป็นระบบออนไลน์ แต่ความหงุดหงิดนั้นเกิดขึ้นจริงแท้แน่นอน',
    hi: 'फॉर्म ऑनलाइन है, लेकिन मेरी निराशा पूरी तरह से वास्तविक है।',
    fil: 'Online nga ang form, ngunit ang aking pagkadismaya ay totoong-totoo.',
    ms: 'Borangnya dalam talian, tetapi kekecewaan saya benar-benar nyata.',
    author: 'Modern Bureaucracy'
  },
  {
    en: 'A good form asks for information. A bad form tests your patience.',
    id: 'Formulir yang baik meminta informasi. Formulir yang buruk menguji kesabaranmu.',
    ja: '優れたフォームは情報を求め、悪質なフォームはあなたの忍耐力を試します。',
    ko: '좋은 양식은 정보를 요구하지만, 나쁜 양식은 인내심을 시험합니다.',
    zh: '好的表单收集信息，糟糕的表单考验耐性。',
    'zh-tw': '好的表單收集資訊，糟糕的表單考驗耐心。',
    vi: 'Biểu mẫu tốt thu thập thông tin. Biểu mẫu tồi thử thách lòng kiên nhẫn.',
    th: 'แบบฟอร์มที่ดีจะขอข้อมูล แต่แบบฟอร์มที่แย่จะทดสอบความอดทนของคุณ',
    hi: 'एक अच्छा फॉर्म जानकारी मांगता है। एक बुरा फॉर्म आपके धैर्य की परीक्षा लेता है।',
    fil: 'Ang mabuting form ay humihingi ng impormasyon. Ang masamang form ay sumusubok sa iyong pasensya.',
    ms: 'Borang yang baik meminta maklumat. Borang yang buruk menguji kesabaran anda.',
    author: 'Design Axiom'
  },
  {
    en: 'If users struggle to complete your form, the problem might not be the users.',
    id: 'Jika pengguna kesulitan menyelesaikan formulirmu, mungkin masalahnya bukan pada penggunanya.',
    ja: 'ユーザーがフォームを完了できないなら、問題はユーザー側にはないかもしれません。',
    ko: '사용자가 양식 작성에 어려움을 겪는다면, 문제는 사용자가 아닐 수 있습니다.',
    zh: '如果用户难以完成填写表格，问题或许根本不在用户身上。',
    'zh-tw': '如果使用者難以完成填寫表格，問題或許根本不在使用者身上。',
    vi: 'Nếu người dùng gặp khó khăn khi điền biểu mẫu, vấn đề có thể không nằm ở họ.',
    th: 'หากผู้ใช้กรอกแบบฟอร์มไม่สำเร็จ ปัญหาอาจไม่ได้อยู่ที่ตัวผู้ใช้เอง',
    hi: 'यदि उपयोगकर्ताओं को फॉर्म भरने में कठिनाई होती है, तो समस्या उपयोगकर्ताओं में नहीं हो सकती है।',
    fil: 'Kung nahihirapan ang mga gumagamit sa pagkumpleto ng form, baka hindi sila ang problema.',
    ms: 'Jika pengguna bergelut melengkapkan borang anda, masalahnya mungkin bukan pada mereka.',
    author: 'Usability Rule'
  },
  {
    en: 'Every unnecessary field is another reason to give up.',
    id: 'Setiap kolom yang tidak diperlukan adalah alasan tambahan untuk menyerah.',
    ja: '不要な入力項目がひとつ増えるたびに、諦める理由がひとつ増えます。',
    ko: '불필요한 입력 항목 하나하나는 작性を포기하게 만드는 이유가 됩니다.',
    zh: '每一个多余的输入框，都是用户放弃填写的理由。',
    'zh-tw': '每一個多餘的輸入欄位，都是使用者放棄填寫的理由。',
    vi: 'Mỗi trường nhập không cần thiết là một lý do nữa để người ta từ bỏ.',
    th: 'ทุกช่องที่ไม่จำเป็น คืออีกหนึ่งเหตุผลที่จะทำให้ผู้ใช้ยอมแพ้',
    hi: 'हर अनावश्यक फ़ील्ड फॉर्म छोड़ने का एक और कारण है।',
    fil: 'Ang bawat hindi kinakailangang field ay isa pang dahilan upang sumuko.',
    ms: 'Setiap ruangan yang tidak diperlukan adalah satu lagi sebab untuk berputus asa.',
    author: 'Conversion Law'
  },
  {
    en: 'A form should make things easier, not make people question their life choices.',
    id: 'Formulir seharusnya mempermudah, bukan membuat orang mempertanyakan pilihan hidup mereka.',
    ja: '申請書類は手続きを円滑にするものであり、人生の選択を後悔させるものであってはなりません。',
    ko: '양식은 절차를 돕는 도구여야지, 인생의 선택을 회의하게 만들어서는 안 됩니다.',
    zh: '表格的存在本应让事情更轻松，而不是让人怀疑自己的人生选择。',
    'zh-tw': '表格的存在本應讓事情更輕鬆，而不是讓人懷疑自己的人生選擇。',
    vi: 'Biểu mẫu phải làm cho mọi việc dễ dàng hơn, chứ không phải khiến người ta nghi ngờ lựa chọn cuộc sống.',
    th: 'แบบฟอร์มควรช่วยให้ชีวิตง่ายขึ้น ไม่ใช่ทำให้ผู้คนตั้งคำถามกับทางเลือกในชีวิต',
    hi: 'फॉर्म को चीजों को आसान बनाना चाहिए, न कि लोगों को अपने जीवन के फैसलों पर पछतावा कराना चाहिए।',
    fil: 'Ang form ay dapat magpadali ng buhay, hindi magpaduda sa mga desisyon sa buhay.',
    ms: 'Borang sepatutnya memudahkan urusan, bukannya membuat orang mempersoalkan pilihan hidup.',
    author: 'Telmy Mission'
  }
]

interface WaitingListTranslation {
  activeBadge: string
  freeDefaultBadge: string
  modalTag: string
  modalTitle: string
  modalSubtitle: string
  bonusBadge: string
  messageBody1: string
  messageBody2: string
  btnJoin: string
  btnJoined: string
  btnSuccessClose: string
  successTitle: string
  successDesc: string
  alreadyJoinedDesc: string
  selectedPlanLabel?: string
  gatewayFooterNote?: string
}

const WAITING_LIST_I18N: Record<string, WaitingListTranslation> = {
  id: {
    activeBadge: "Paket Sedang Aktif",
    freeDefaultBadge: "Kuota Dasar Gratis",
    modalTag: "Tahap Pengembangan • Early Access",
    modalTitle: "Terima Kasih atas Minatmu Mengupgrade!",
    modalSubtitle: "Fitur pembayaran resmi saat ini sedang dalam tahap penyelesaian akhir verifikasi gateway.",
    bonusBadge: "Bonus +10 Form Gratis",
    messageBody1: "Kami sangat mengapresiasi antusiasmemu! Untuk memastikan transaksi resmi 100% aman dan terverifikasi, gerbang pembayaran sedang dipersiapkan.",
    messageBody2: "Silakan masuk ke Daftar Tunggu (Waiting List) agar kami kabari begitu pembayaran siap. Sebagai bentuk terima kasih, kamu akan langsung mendapatkan Bonus 10 Kuota Form Gratis!",
    btnJoin: "Gabung Waiting List & Klaim 10 Form 🎁",
    btnJoined: "Sudah Terdaftar di Waiting List ✓",
    btnSuccessClose: "Kembali ke Dashboard",
    successTitle: "🎉 Selamat! 10 Form Gratis Ditambahkan!",
    successDesc: "Email kamu telah tersimpan di daftar tunggu prioritas kami. Kuota 10 form gratis telah masuk ke akunmu.",
    alreadyJoinedDesc: "Kamu sudah terdaftar di daftar tunggu dan telah mengklaim bonus kuota sebelumnya. Kami akan segera mengabarimu!",
    gatewayFooterNote: "Semua pembayaran diproses melalui payment gateway Mayar.id"
  },
  en: {
    activeBadge: "Current Active Plan",
    freeDefaultBadge: "Free Base Quota",
    modalTag: "Under Active Development • Early Access",
    modalTitle: "Thank You for Your Interest in Upgrading!",
    modalSubtitle: "Official payment processing is currently in the final stages of gateway verification.",
    bonusBadge: "Bonus +10 Free Form Credits",
    messageBody1: "We truly appreciate your excitement! To ensure 100% safe and verified transactions, official payment channels are currently finalizing verification.",
    messageBody2: "Join our priority Waiting List to be notified the moment upgrades go live. As a special thank you, you will immediately receive 10 Free Form Guidance Credits!",
    btnJoin: "Join Waiting List & Claim 10 Free Forms 🎁",
    btnJoined: "Already on Waiting List ✓",
    btnSuccessClose: "Back to Dashboard",
    successTitle: "🎉 Awesome! 10 Free Forms Added!",
    successDesc: "Your account is on our priority list. 10 free form credits have been added to your balance.",
    alreadyJoinedDesc: "You are already registered on our priority waiting list with your bonus claimed. We will notify you once live!",
    gatewayFooterNote: "All payments are processed securely through Mayar.id payment gateway"
  },
  ja: {
    activeBadge: "現在適用中のプラン",
    freeDefaultBadge: "無料基本枠",
    modalTag: "開発中 • アーリーアクセス",
    modalTitle: "アップグレードへのご関心ありがとうございます！",
    modalSubtitle: "現在、決済ゲートウェイの最終審査および検証を行っております。",
    bonusBadge: "+10件の無料フォーム特典",
    messageBody1: "Telmyに関心をお寄せいただき心より感謝申し上げます！安全で確実なお取引を提供するため、公式決済機能を最終整備中です。",
    messageBody2: "ウェイティングリスト（先行登録）にご参加いただくと、機能開放時にいち早くご案内いたします。感謝の印として【無料フォーム枠 10件】を今すぐプレゼントします！",
    btnJoin: "リストに参加して10件の無料枠を獲得 🎁",
    btnJoined: "登録完了済み ✓",
    btnSuccessClose: "ダッシュボードに戻る",
    successTitle: "🎉 10件の無料枠が付与されました！",
    successDesc: "ご登録ありがとうございます。無料フォーム枠10件がアカウントに追加されました。",
    alreadyJoinedDesc: "すでにウェイティングリストに登録済みです。機能が公開され次第メールでお知らせします！",
    gatewayFooterNote: "すべてのお支払いは Mayar.id 決済ゲートウェイを通じて安全に処理されます"
  },
  ko: {
    activeBadge: "현재 이용 중인 플랜",
    freeDefaultBadge: "무료 기본 혜택",
    modalTag: "개발 진행 중 • 얼리 액세스",
    modalTitle: "업그레이드에 관심을 가져주셔서 감사합니다!",
    modalSubtitle: "공식 결제 시스템 연동 및 최종 심사가 진행 중입니다.",
    bonusBadge: "+10회 무료 양식 혜택 지급",
    messageBody1: "Telmy에 보내주신 관심에 진심으로 감사드립니다! 보다 안전하고 검증된 결제 환경을 구축하기 위해 마무리 작업을 진행 중입니다.",
    messageBody2: "대기자 명단(Waiting List)에 등록하시면 정식 오픈 시 가장 먼저 안내해 드립니다. 감사의 의미로 [무료 양식 10회 이용권]을 즉시 지급해 드립니다!",
    btnJoin: "대기자 명단 등록 & 10회 무료 받기 🎁",
    btnJoined: "등록 완료됨 ✓",
    btnSuccessClose: "대시보드로 돌아가기",
    successTitle: "🎉 무료 양식 10회가 적립되었습니다!",
    successDesc: "우선 대기 명단 등록이 완료되었으며, 10회의 무료 크레딧이 지급되었습니다.",
    alreadyJoinedDesc: "이미 대기자 명단에 등록되어 보너스를 지급받으셨습니다. 오픈 즉시 알려드리겠습니다!",
    gatewayFooterNote: "모든 결제는 Mayar.id 결제 게이트웨이를 통해 안전하게 처리됩니다"
  },
  zh: {
    activeBadge: "当前生效套餐",
    freeDefaultBadge: "免费基础额度",
    modalTag: "全力开发中 • 抢先体验",
    modalTitle: "感谢您对升级套餐的关注！",
    modalSubtitle: "官方支付网关目前正处于最终审核与验证阶段。",
    bonusBadge: "加赠 +10 次免费表单额度",
    messageBody1: "非常感谢您的热情支持！为确保每一笔交易安全可靠，我们正在完善支付接入流程。",
    messageBody2: "欢迎加入候补预约名单（Waiting List），功能上线时我们将第一时间通知您。为表达谢意，您将立即获赠 10 次免费表单辅助额度！",
    btnJoin: "加入候补名单并领取 10 次额度 🎁",
    btnJoined: "已在名单中 ✓",
    btnSuccessClose: "返回控制台",
    successTitle: "🎉 成功获赠 10 次免费额度！",
    successDesc: "您已加入优先通知名单，10 次免费表单额度已发放至您的账户。",
    alreadyJoinedDesc: "您已在优先名单中并已领取过奖励。上线后我们将第一时间邮件通知您！",
    gatewayFooterNote: "所有付款均通过 Mayar.id 安全支付网关处理"
  },
  'zh-tw': {
    activeBadge: "目前生效方案",
    freeDefaultBadge: "免費基礎額度",
    modalTag: "全力開發中 • 搶先體驗",
    modalTitle: "感謝您對升級方案的關注！",
    modalSubtitle: "官方支付閘道目前正處於最終審核與驗證階段。",
    bonusBadge: "加贈 +10 次免費表單額度",
    messageBody1: "非常感謝您的熱情支持！為確保每一筆交易安全可靠，我們正在完善官方支付對接流程。",
    messageBody2: "歡迎加入候補預約名單（Waiting List），功能上線時我們將第一時間通知您。為表達謝意，您將立即獲贈 10 次免費表單輔助額度！",
    btnJoin: "加入候補名單並領取 10 次額度 🎁",
    btnJoined: "已在名單中 ✓",
    btnSuccessClose: "返回控制台",
    successTitle: "🎉 成功獲贈 10 次免費額度！",
    successDesc: "您已加入優先通知名單，10 次免費表單額度已發放至您的帳戶。",
    alreadyJoinedDesc: "您已在優先名單中並已領取過獎勵。上線後我們將第一時間郵件通知您！",
    gatewayFooterNote: "所有付款均透過 Mayar.id 安全支付閘道處理"
  },
  vi: {
    activeBadge: "Gói Đang Hoạt Động",
    freeDefaultBadge: "Hạn Mức Miễn Phí Cơ Bản",
    modalTag: "Đang Phát Triển • Quyền Truy Cập Sớm",
    modalTitle: "Cảm Ơn Bạn Đã Quan Tâm Nâng Cấp!",
    modalSubtitle: "Cổng thanh toán chính thức đang trong giai đoạn hoàn tất xác minh cuối cùng.",
    bonusBadge: "Tặng Thêm +10 Lượt Biểu Mẫu Miễn Phí",
    messageBody1: "Chúng tôi rất trân trọng sự ủng hộ của bạn! Để đảm bảo an toàn tuyệt đối, hệ thống thanh toán đang được chuẩn bị kỹ lưỡng.",
    messageBody2: "Hãy tham gia Danh Sách Chờ (Waiting List) để nhận thông báo ngay khi mở cổng. Để tri ân, bạn sẽ nhận ngay 10 Lượt Hỗ Trợ Biểu Mẫu Miễn Phí!",
    btnJoin: "Tham Gia Chờ & Nhận 10 Lượt Miễn Phí 🎁",
    btnJoined: "Đã Đăng Ký Chờ ✓",
    btnSuccessClose: "Quay Lại Dashboard",
    successTitle: "🎉 Chúc Mừng! Đã Nhận 10 Lượt Miễn Phí!",
    successDesc: "Bạn đã có mặt trong danh sách ưu tiên. 10 lượt biểu mẫu đã được cộng vào tài khoản của bạn.",
    alreadyJoinedDesc: "Bạn đã đăng ký trong danh sách chờ và đã nhận thưởng trước đó. Chúng tôi sẽ thông báo ngay khi tính năng sẵn sàng!",
    gatewayFooterNote: "Tất cả thanh toán được xử lý an toàn qua cổng thanh toán Mayar.id"
  },
  th: {
    activeBadge: "แพ็กเกจที่ใช้งานอยู่",
    freeDefaultBadge: "โควตาฟรีพื้นฐาน",
    modalTag: "อยู่ระหว่างการพัฒนา • สิทธิ์เข้าถึงก่อนใคร",
    modalTitle: "ขอบคุณที่ให้ความสนใจอัปเกรดแพ็กเกจ!",
    modalSubtitle: "ระบบชำระเงินทางการกำลังอยู่ในขั้นตอนการตรวจสอบและยืนยันขั้นสุดท้าย",
    bonusBadge: "รับโบนัสฟรี +10 แบบฟอร์ม",
    messageBody1: "เราซาบซึ้งในความสนใจของคุณอย่างยิ่ง! เพื่อความปลอดภัยสูงสุด ระบบชำระเงินกำลังเตรียมความพร้อมอย่างละเอียดรอบคอบ",
    messageBody2: "โปรดลงชื่อเข้าสู่ รายชื่อรอคอย (Waiting List) เพื่อรับการแจ้งเตือนทันทีที่เปิดให้บริการ และรับสิทธิ์ใช้งานฟรี 10 แบบฟอร์มทันที!",
    btnJoin: "เข้าร่วมรายชื่อรอ & รับฟรี 10 แบบฟอร์ม 🎁",
    btnJoined: "ลงทะเบียนเรียบร้อยแล้ว ✓",
    btnSuccessClose: "กลับสู่แดชบอร์ด",
    successTitle: "🎉 ยินดีด้วย! คุณได้รับโควตาฟรี 10 แบบฟอร์ม",
    successDesc: "คุณอยู่ในรายชื่อรอคอยระดับพรีเมียมแล้ว และเราได้เพิ่ม 10 แบบฟอร์มให้คุณเรียบร้อยแล้ว",
    alreadyJoinedDesc: "คุณลงทะเบียนไว้แล้วและได้รับโบนัสเรียบร้อยแล้ว เราจะแจ้งให้ทราบทันทีที่พร้อมให้บริการ!",
    gatewayFooterNote: "การชำระเงินทั้งหมดดำเนินการอย่างปลอดภัยผ่านเกตเวย์ Mayar.id"
  },
  hi: {
    activeBadge: "सक्रिय प्लान",
    freeDefaultBadge: "निःशुल्क बुनियादी कोटा",
    modalTag: "विकास जारी है • अर्ली एक्सेस",
    modalTitle: "अपग्रेड में रुचि दिखाने के लिए धन्यवाद!",
    modalSubtitle: "आधिकारिक भुगतान गेटवे वर्तमान में सत्यापन के अंतिम चरण में है।",
    bonusBadge: "बोनस +10 निःशुल्क फॉर्म",
    messageBody1: "हम आपकी रुचि की सराहना करते हैं! लेनदेन को पूरी तरह सुरक्षित बनाने के लिए अंतिम तैयारियाँ चल रही हैं।",
    messageBody2: "कृपया प्रतीक्षा सूची (Waiting List) में शामिल हों ताकि सुविधा शुरू होते ही आपको सूचना मिले। आभार के रूप में तुरंत 10 निःशुल्क फॉर्म प्राप्त करें!",
    btnJoin: "प्रतीक्षा सूची में शामिल हों और 10 फॉर्म पाएं 🎁",
    btnJoined: "पहले से पंजीकृत ✓",
    btnSuccessClose: "डैशबोर्ड पर लौटें",
    successTitle: "🎉 बधाई! 10 निःशुल्क फॉर्म जोड़ दिए गए हैं!",
    successDesc: "आप प्राथमिकता सूची में हैं और आपके खाते में 10 फॉर्म क्रेडिट जमा कर दिए गए हैं।",
    alreadyJoinedDesc: "आप पहले से प्रतीक्षा सूची में हैं और बोनस प्राप्त कर चुके हैं। शुरू होते ही हम आपको सूचित करेंगे!",
    gatewayFooterNote: "सभी भुगतान Mayar.id भुगतान गेटवे के माध्यम से सुरक्षित रूप से संसाधित किए जाते हैं"
  },
  fil: {
    activeBadge: "Kasalukuyang Aktibong Plano",
    freeDefaultBadge: "Libreng Base Quota",
    modalTag: "Kasalukuyang Ginagawa • Early Access",
    modalTitle: "Salamat sa Iyong Interes na Mag-upgrade!",
    modalSubtitle: "Ang opisyal na payment gateway ay nasa huling yugto ng beripikasyon.",
    bonusBadge: "Bonus na +10 Libreng Form",
    messageBody1: "Lubos naming pinapahalagahan ang iyong suporta! Upang matiyak ang 100% ligtas na pagbabayad, inihahanda pa ang opisyal na gateway.",
    messageBody2: "Sumali sa aming Waiting List upang maabisuhan agad kapag live na ang upgrade. Bilang pasasalamat, makakatanggap ka agad ng 10 Libreng Form!",
    btnJoin: "Sumali sa Waiting List at Kunin ang 10 Form 🎁",
    btnJoined: "Nasa Waiting List Na ✓",
    btnSuccessClose: "Bumalik sa Dashboard",
    successTitle: "🎉 Matagumpay! May 10 Libreng Form Ka Na!",
    successDesc: "Nailista na ang iyong account at naidagdag na ang 10 libreng form sa iyong balanse.",
    alreadyJoinedDesc: "Nakarehistro ka na sa aming waiting list at nakuha mo na ang iyong bonus. Aabisuhan ka namin kapag handa na!",
    gatewayFooterNote: "Lahat ng pagbabayad ay ligtas na pinoproseso sa pamamagitan ng Mayar.id payment gateway"
  },
  ms: {
    activeBadge: "Pelan Sedang Aktif",
    freeDefaultBadge: "Kuota Asas Percuma",
    modalTag: "Dalam Pembangunan • Akses Awal",
    modalTitle: "Terima Kasih atas Minat Anda untuk Menaik Taraf!",
    modalSubtitle: "Gerbang pembayaran rasmi kini sedang dalam peringkat pengesahan akhir.",
    bonusBadge: "Bonus +10 Borang Percuma",
    messageBody1: "Kami amat menghargai minat anda! Demi memastikan transaksi selamat dan terjamin, saluran pembayaran sedang diselaraskan.",
    messageBody2: "Sertai Senarai Menunggu (Waiting List) kami agar kami maklumkan sebaik sahaja dibuka. Sebagai tanda penghargaan, anda akan menerima 10 Kuota Borang Percuma serta-merta!",
    btnJoin: "Sertai Waiting List & Tuntut 10 Borang 🎁",
    btnJoined: "Telah Didaftarkan ✓",
    btnSuccessClose: "Kembali ke Papan Pemuka",
    successTitle: "🎉 Tahniah! 10 Borang Percuma Ditambah!",
    successDesc: "Akaun anda telah disimpan dalam senarai keutamaan kami dan 10 borang telah dikreditkan ke akaun anda.",
    alreadyJoinedDesc: "Anda telah mendaftar dalam senarai menunggu dan telah menuntut bonus sebelum ini. Kami akan maklumkan kepada anda kelak!",
    gatewayFooterNote: "Semua pembayaran diproses melalui payment gateway Mayar.id"
  }
}

export const DashboardPage: React.FC = () => {
  const { userProfile, logout, refreshQuota, updateUserProfile } = useAuth()
  const { currentLang, setLang } = useLanguage()
  const navigate = useNavigate()

  // 6 Main Menu Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'academy' | 'profile' | 'forms' | 'autofill' | 'credits'>('overview')

  // Authentication guard
  useEffect(() => {
    if (!userProfile && !localStorage.getItem('telmy_user')) {
      navigate('/signin')
    }
  }, [userProfile, navigate])

  // Profile-driven active language determination
  // Priority: userProfile.language > currentLang > localStorage > 'en'
  const effectiveLangCode = (userProfile?.language || currentLang || localStorage.getItem('telmy_lang') || 'en').toLowerCase()
  const dI18n: DashboardI18n = DASHBOARD_I18N[effectiveLangCode] || DASHBOARD_I18N['en']

  // Keep global LanguageContext in sync with user profile if profile has a preferred language
  useEffect(() => {
    if (userProfile?.language && userProfile.language.toLowerCase() !== currentLang.toLowerCase()) {
      setLang(userProfile.language.toLowerCase())
    }
  }, [userProfile?.language])

  // Selected Country in Profile Tab
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(effectiveLangCode)
  const [profileName, setProfileName] = useState(userProfile?.displayName || 'Citizen Applicant')
  const [profileSavedToast, setProfileSavedToast] = useState(false)

  // Animated rotating quote ticker (changes every 6 seconds)
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0)
  const [quoteFade, setQuoteFade] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteFade(false)
      setTimeout(() => {
        setCurrentQuoteIdx((prev) => (prev + 1) % FORM_FRUSTRATION_QUOTES.length)
        setQuoteFade(true)
      }, 350)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (userProfile?.displayName) setProfileName(userProfile.displayName)
    if (userProfile?.language) setSelectedCountryCode(userProfile.language.toLowerCase())
  }, [userProfile])

  // ==========================================
  // STATE: ACADEMY PROGRESS & REWARD
  // ==========================================
  interface AcademyMissionDetail {
    id: string
    title: string
    desc: string
    tag: string
    gifSrc?: string
    imageSrc?: string
    actionPrompt?: string
    steps: string[]
    sandboxType: 'extension' | 'audio' | 'autofill' | 'audit' | 'accessibility'
    practiceSnippet?: string
    interactiveLabel: string
  }

  const langKeys = Object.keys(ACADEMY_ACTIVITIES[0].title)
  const lk = langKeys.find(k => k.toLowerCase() === effectiveLangCode.toLowerCase()) || (effectiveLangCode === 'zh-tw' ? 'zh-TW' : (effectiveLangCode in ACADEMY_ACTIVITIES[0].title ? effectiveLangCode : 'en'))
  const a1 = ACADEMY_ACTIVITIES.find(a => a.id === 'task-install-pin') || ACADEMY_ACTIVITIES[0]
  const a2 = ACADEMY_ACTIVITIES.find(a => a.id === 'task-tts-audio-wand') || ACADEMY_ACTIVITIES[2]
  const a3 = ACADEMY_ACTIVITIES.find(a => a.id === 'task-one-click-autofill') || ACADEMY_ACTIVITIES[4]
  const a4 = ACADEMY_ACTIVITIES.find(a => a.id === 'task-pre-submission-audit') || ACADEMY_ACTIVITIES[5]
  const a5 = ACADEMY_ACTIVITIES.find(a => a.id === 'task-smart-vault-encrypt') || ACADEMY_ACTIVITIES[3]

  const academyMissions: AcademyMissionDetail[] = [
    {
      id: 'm1',
      title: a1.title[lk] || a1.title.en,
      desc: a1.summary[lk] || a1.summary.en,
      tag: a1.category[lk] || a1.category.en,
      imageSrc: '/assets/screenshot-ahu-apostille.png',
      actionPrompt: a1.summary[lk] || a1.summary.en,
      steps: a1.instructionSteps[lk] || a1.instructionSteps.en,
      sandboxType: 'extension',
      practiceSnippet: a1.practiceSnippet[lk] || a1.practiceSnippet.en,
      interactiveLabel: a1.checkButtonLabel[lk] || a1.checkButtonLabel.en
    },
    {
      id: 'm2',
      title: a2.title[lk] || a2.title.en,
      desc: a2.summary[lk] || a2.summary.en,
      tag: a2.category[lk] || a2.category.en,
      gifSrc: '/assets/demo-understand.gif',
      actionPrompt: a2.summary[lk] || a2.summary.en,
      steps: a2.instructionSteps[lk] || a2.instructionSteps.en,
      sandboxType: 'audio',
      practiceSnippet: a2.practiceSnippet[lk] || a2.practiceSnippet.en,
      interactiveLabel: a2.checkButtonLabel[lk] || a2.checkButtonLabel.en
    },
    {
      id: 'm3',
      title: a3.title[lk] || a3.title.en,
      desc: a3.summary[lk] || a3.summary.en,
      tag: a3.category[lk] || a3.category.en,
      gifSrc: '/assets/demo-autofill.gif',
      actionPrompt: a3.summary[lk] || a3.summary.en,
      steps: a3.instructionSteps[lk] || a3.instructionSteps.en,
      sandboxType: 'autofill',
      practiceSnippet: a3.practiceSnippet[lk] || a3.practiceSnippet.en,
      interactiveLabel: a3.checkButtonLabel[lk] || a3.checkButtonLabel.en
    },
    {
      id: 'm4',
      title: a4.title[lk] || a4.title.en,
      desc: a4.summary[lk] || a4.summary.en,
      tag: a4.category[lk] || a4.category.en,
      imageSrc: '/assets/screenshot-web-form.png',
      actionPrompt: a4.summary[lk] || a4.summary.en,
      steps: a4.instructionSteps[lk] || a4.instructionSteps.en,
      sandboxType: 'audit',
      practiceSnippet: a4.practiceSnippet[lk] || a4.practiceSnippet.en,
      interactiveLabel: a4.checkButtonLabel[lk] || a4.checkButtonLabel.en
    },
    {
      id: 'm5',
      title: a5.title[lk] || a5.title.en,
      desc: a5.summary[lk] || a5.summary.en,
      tag: a5.category[lk] || a5.category.en,
      gifSrc: '/assets/demo-accessibility.gif',
      actionPrompt: a5.summary[lk] || a5.summary.en,
      steps: a5.instructionSteps[lk] || a5.instructionSteps.en,
      sandboxType: 'accessibility',
      practiceSnippet: a5.practiceSnippet[lk] || a5.practiceSnippet.en,
      interactiveLabel: a5.checkButtonLabel[lk] || a5.checkButtonLabel.en
    }
  ]

  // Interactive In-Dashboard Academy Modal State
  const [activeAcademyMission, setActiveAcademyMission] = useState<AcademyMissionDetail | null>(null)
  const [sandboxTtsPlaying, setSandboxTtsPlaying] = useState(false)
  const [sandboxAutofillFilled, setSandboxAutofillFilled] = useState(false)
  const [sandboxAuditTested, setSandboxAuditTested] = useState(false)
  const [sandboxA11yActive, setSandboxA11yActive] = useState(false)

  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('telmy_academy_progress')
      return saved ? JSON.parse(saved) : ['m1']
    } catch (e) {
      return ['m1']
    }
  })

  const [rewardClaimed, setRewardClaimed] = useState<boolean>(() => {
    return Boolean(userProfile?.academyRewardClaimed || localStorage.getItem('telmy_academy_reward_claimed') === 'true')
  })
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimMessage, setClaimMessage] = useState<string | null>(null)

  const toggleMission = (id: string) => {
    let next: string[]
    if (completedMissions.includes(id)) {
      next = completedMissions.filter(m => m !== id)
    } else {
      next = [...completedMissions, id]
    }
    setCompletedMissions(next)
    localStorage.setItem('telmy_academy_progress', JSON.stringify(next))
  }

  const markAllCompleted = () => {
    const allIds = academyMissions.map(m => m.id)
    setCompletedMissions(allIds)
    localStorage.setItem('telmy_academy_progress', JSON.stringify(allIds))
  }

  const handleClaimReward = async () => {
    if (rewardClaimed || claimLoading) return
    setClaimLoading(true)
    setClaimMessage(null)

    try {
      const uid = userProfile?.uid || 'guest_user'
      const res = await fetch(getApiUrl('/api/user/claim-academy-reward'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid })
      })
      const data = await res.json()

      if (data.success) {
        setRewardClaimed(true)
        localStorage.setItem('telmy_academy_reward_claimed', 'true')
        setClaimMessage('🎉 ' + data.message)
        if (refreshQuota) refreshQuota()
      } else {
        setClaimMessage(data.error || 'Gagal mengklaim reward.')
      }
    } catch (e: any) {
      setClaimMessage('Koneksi server gagal, namun progres Anda tetap tersimpan.')
    } finally {
      setClaimLoading(false)
    }
  }

  // Save Profile Preferences
  const handleSaveProfile = async () => {
    try {
      const uid = userProfile?.uid || 'guest_user'
      await fetch(getApiUrl('/api/user/sync'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          displayName: profileName,
          language: selectedCountryCode,
          email: userProfile?.email || ''
        })
      })
    } catch (e) {
      console.warn('Sync profile warning:', e)
    }

    if (updateUserProfile) {
      updateUserProfile({
        displayName: profileName,
        language: selectedCountryCode
      })
    }
    setLang(selectedCountryCode)
    setProfileSavedToast(true)
    setTimeout(() => setProfileSavedToast(false), 3000)
  }

  // ==========================================
  // STATE: FORMS HISTORY (REAL DATA FROM FIRESTORE)
  // ==========================================
  const [formFilter, setFormFilter] = useState<'all' | 'online' | 'pdf'>('all')
  const [formsHistoryList, setFormsHistoryList] = useState<any[]>([])
  const [formsLoading, setFormsLoading] = useState(false)

  const fetchSavedForms = async () => {
    if (!userProfile?.uid) return
    setFormsLoading(true)
    try {
      const res = await fetch(getApiUrl(`/api/user/saved-forms/${userProfile.uid}`))
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setFormsHistoryList(data.data)
      } else {
        setFormsHistoryList([])
      }
    } catch (e) {
      console.warn('Failed to fetch saved forms:', e)
    } finally {
      setFormsLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedForms()
  }, [userProfile?.uid])

  // PDF Guidance Editor Mockup Modal
  const [editorModalOpen, setEditorModalOpen] = useState(false)
  const [activeEditorField, setActiveEditorField] = useState(1)

  // ==========================================
  // STATE: AUTOFILL MULTI-VAULTS & DUAL-LOCK (ZERO-KNOWLEDGE FIRESTORE)
  // ==========================================
  const [vaultUnlocked, setVaultUnlocked] = useState(false)
  const [unlockModalOpen, setUnlockModalOpen] = useState(false)
  const [unlockMode, setUnlockMode] = useState<'password' | 'seed'>('password')
  const [inputPassword, setInputPassword] = useState('')
  const [inputSeedText, setInputSeedText] = useState('')
  const [unlockError, setUnlockError] = useState<string | null>(null)
  const [currentVaultSecret, setCurrentVaultSecret] = useState<string | null>(null)
  const [vaultEnvelope, setVaultEnvelope] = useState<VaultEnvelope | null>(null)

  // 12-Seed Word Management
  const [masterSeedPhrase, setMasterSeedPhrase] = useState(() => {
    const saved = localStorage.getItem('telmy_master_seed')
    if (saved) return saved
    const words = []
    for (let i = 0; i < 12; i++) {
      words.push(BIP39_WORDS[Math.floor(Math.random() * BIP39_WORDS.length)])
    }
    const generated = words.join(' ')
    localStorage.setItem('telmy_master_seed', generated)
    return generated
  })
  const [seedRegenWarningOpen, setSeedRegenWarningOpen] = useState(false)

  // Dynamic Vault Compartments (Initialized empty - loaded dynamically upon unlocking encrypted envelope)
  const [vaultCompartments, setVaultCompartments] = useState<any[]>([])

  // Fetch Firestore Vault Envelope on Load
  useEffect(() => {
    const fetchVaultEnvelope = async () => {
      if (!userProfile?.uid) return
      try {
        const res = await fetch(getApiUrl(`/api/user/vault/${userProfile.uid}`))
        const data = await res.json()
        if (data.success && data.data && data.data.ciphertext) {
          setVaultEnvelope(data.data)
        }
      } catch (err) {
        console.warn('Vault fetch warning:', err)
      }
    }
    fetchVaultEnvelope()
  }, [userProfile?.uid])

  const [newCompartmentTitle, setNewCompartmentTitle] = useState('')

  const handleUnlockVault = async () => {
    setUnlockError(null)
    const secret = unlockMode === 'password' ? inputPassword.trim() : inputSeedText.trim()
    
    if (unlockMode === 'password') {
      if (secret.length < 6) {
        setUnlockError(dI18n.vaultErrorPasswordMin)
        return
      }
    } else {
      const words = secret.split(/\s+/)
      if (words.length !== 12) {
        setUnlockError(dI18n.vaultErrorSeed12Words)
        return
      }
    }

    try {
      // If we have an encrypted envelope from Firestore, decrypt it
      if (vaultEnvelope && vaultEnvelope.ciphertext) {
        try {
          const decrypted = await decryptVault(vaultEnvelope, secret)
          if (decrypted && (decrypted as any).compartments && Array.isArray((decrypted as any).compartments)) {
            setVaultCompartments((decrypted as any).compartments)
          } else if (decrypted && Array.isArray(decrypted.fields)) {
            // Extension-synced field list format
            setVaultCompartments([
              {
                id: 'c_ext_synced',
                title: 'Data Terverifikasi (Ekstensi Browser)',
                badge: 'Synced',
                fields: decrypted.fields.map((f: any) => ({
                  key: f.label || f.key,
                  value: f.value
                }))
              }
            ])
          }
        } catch (decryptErr) {
          setUnlockError(dI18n.vaultErrorMismatch)
          return
        }
      }

      setCurrentVaultSecret(secret)
      setVaultUnlocked(true)
      setUnlockModalOpen(false)
      setInputPassword('')
      setInputSeedText('')
    } catch (e: any) {
      setUnlockError(dI18n.vaultErrorMismatch)
    }
  }

  const [vaultResetConfirmOpen, setVaultResetConfirmOpen] = useState(false)
  const [resetVaultLoading, setResetVaultLoading] = useState(false)

  const handleResetVault = async () => {
    setResetVaultLoading(true)
    try {
      // 1. Wipe encrypted envelope in Firestore backend
      if (userProfile?.uid) {
        await fetch(getApiUrl(`/api/user/vault/${userProfile.uid}`), {
          method: 'DELETE'
        }).catch(err => console.warn('Wipe backend vault err:', err))
      }

      // 2. Generate brand new 12-seed words
      const words = []
      for (let i = 0; i < 12; i++) {
        words.push(BIP39_WORDS[Math.floor(Math.random() * BIP39_WORDS.length)])
      }
      const newSeed = words.join(' ')
      setMasterSeedPhrase(newSeed)
      localStorage.setItem('telmy_master_seed', newSeed)

      // 3. Clear local vault state and envelope
      setVaultEnvelope(null)
      setVaultCompartments([])
      setCurrentVaultSecret(newSeed)
      setVaultUnlocked(true)
      setUnlockModalOpen(false)
      setVaultResetConfirmOpen(false)
      setInputPassword('')
      setInputSeedText('')
      setUnlockError(null)

      alert(dI18n.vaultResetSuccess)
    } catch (err: any) {
      console.error('Reset vault failed:', err)
      alert('Gagal mereset brankas: ' + (err?.message || 'Unknown error'))
    } finally {
      setResetVaultLoading(false)
    }
  }

  // Save changes to Firestore Zero-Knowledge Vault
  const saveVaultToFirestore = async (newCompartments: any[]) => {
    if (!userProfile?.uid || !currentVaultSecret) return
    try {
      const vaultPayload: any = {
        vaultVersion: 2,
        lastUpdated: new Date().toISOString(),
        compartments: newCompartments,
        fields: []
      }
      const envelope = await encryptVault(vaultPayload, currentVaultSecret)
      await fetch(getApiUrl(`/api/user/vault/${userProfile.uid}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envelope)
      })
      setVaultEnvelope(envelope)
    } catch (err) {
      console.warn('Failed to encrypt & sync vault:', err)
    }
  }

  const handleRegenerateSeedWords = () => {
    const words = []
    for (let i = 0; i < 12; i++) {
      words.push(BIP39_WORDS[Math.floor(Math.random() * BIP39_WORDS.length)])
    }
    const newSeed = words.join(' ')
    setMasterSeedPhrase(newSeed)
    localStorage.setItem('telmy_master_seed', newSeed)
    const newComp = [
      {
        id: 'c_new_' + Date.now(),
        title: 'Brankas Baru (Kunci Baru)',
        badge: 'New',
        fields: [{ key: 'Full Name', value: userProfile?.displayName || 'Citizen Applicant' }]
      }
    ]
    setVaultCompartments(newComp)
    setSeedRegenWarningOpen(false)
    if (currentVaultSecret) {
      saveVaultToFirestore(newComp)
    }
  }

  // ==========================================
  // STATE: RICH VAULT COMPARTMENT & FIELD MODAL
  // ==========================================
  interface ActiveEditingCompartment {
    id: string
    title: string
    badge: string
    fields: Array<{ key: string; value: string }>
  }

  const [activeEditingComp, setActiveEditingComp] = useState<ActiveEditingCompartment | null>(null)
  const [isCompModalOpen, setIsCompModalOpen] = useState(false)
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false)
  const [ingestLoading, setIngestLoading] = useState(false)
  const [ingestError, setIngestError] = useState<string | null>(null)

  // Open modal to create brand new compartment
  const handleOpenCreateCompartment = () => {
    setActiveEditingComp({
      id: 'c_' + Date.now(),
      title: '',
      badge: 'Utama',
      fields: [
        { key: 'Nama Lengkap', value: '' },
        { key: 'Nomor Identitas', value: '' }
      ]
    })
    setIsCompModalOpen(true)
  }

  // Open modal to edit existing compartment
  const handleOpenEditCompartment = (comp: any) => {
    setActiveEditingComp({
      id: comp.id,
      title: comp.title,
      badge: comp.badge || 'Custom',
      fields: Array.isArray(comp.fields) && comp.fields.length > 0 
        ? comp.fields.map((f: any) => ({ key: f.key, value: f.value }))
        : [{ key: '', value: '' }]
    })
    setIsCompModalOpen(true)
  }

  // Save changes from modal
  const handleSaveCompartmentModal = () => {
    if (!activeEditingComp) return
    if (!activeEditingComp.title.trim()) {
      alert('Nama koper data wajib diisi.')
      return
    }

    // Clean up empty fields
    const cleanFields = activeEditingComp.fields
      .map(f => ({ key: f.key.trim(), value: f.value.trim() }))
      .filter(f => f.key.length > 0)

    const updatedComp = {
      ...activeEditingComp,
      title: activeEditingComp.title.trim(),
      fields: cleanFields
    }

    const existingIdx = vaultCompartments.findIndex(c => c.id === activeEditingComp.id)
    let updated: any[]
    if (existingIdx >= 0) {
      updated = [...vaultCompartments]
      updated[existingIdx] = updatedComp
    } else {
      updated = [...vaultCompartments, updatedComp]
    }

    setVaultCompartments(updated)
    setIsCompModalOpen(false)
    setActiveEditingComp(null)
    saveVaultToFirestore(updated)
  }

  const handleDeleteCompartment = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus koper data ini beserta seluruh isinya?')) return
    const updated = vaultCompartments.filter(c => c.id !== id)
    setVaultCompartments(updated)
    saveVaultToFirestore(updated)
  }

  // Ingest Document (KTP, Passport, Diploma) via Gemini Multimodal OCR
  const handleFileIngest = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIngestLoading(true)
    setIngestError(null)

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string) || ''
        const res = await fetch(getApiUrl('/api/pdf/extract-vault'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64,
            fileName: file.name,
            mimeType: file.type || 'application/pdf'
          })
        })
        const data = await res.json()

        if (data.success && Array.isArray(data.fields) && data.fields.length > 0) {
          const docType = data.documentType || 'Dokumen'
          const extractedFields = data.fields.map((f: any) => ({
            key: f.label || f.key,
            value: f.value
          }))

          const newCompartment = {
            id: 'c_ingest_' + Date.now(),
            title: `${docType}: ${file.name.replace(/\.[^/.]+$/, "")}`,
            badge: 'Extracted',
            fields: extractedFields
          }

          const updated = [...vaultCompartments, newCompartment]
          setVaultCompartments(updated)
          saveVaultToFirestore(updated)
          setIsIngestModalOpen(false)
          alert(`🎉 Berhasil mengekstrak ${extractedFields.length} entitas data dari ${file.name}!`)
        } else {
          setIngestError(data.error || 'Tidak ada entitas data yang dapat diekstrak dari dokumen ini.')
        }
      } catch (err: any) {
        setIngestError('Gagal memproses dokumen: ' + err.message)
      } finally {
        setIngestLoading(false)
        e.target.value = ''
      }
    }
    reader.onerror = () => {
      setIngestLoading(false)
      setIngestError('Gagal membaca file lokal.')
    }
    reader.readAsDataURL(file)
  }

  // ==========================================
  // STATE: ACTIVE CONNECTED DEVICES (FIRESTORE)
  // ==========================================
  const [activeDevicesList, setActiveDevicesList] = useState<any[]>([])
  const [devicesLoading, setDevicesLoading] = useState(false)

  const fetchActiveDevices = async () => {
    if (!userProfile?.uid) return
    setDevicesLoading(true)
    try {
      const res = await fetch(getApiUrl(`/api/user/devices/${userProfile.uid}`))
      const data = await res.json()
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setActiveDevicesList(data.data)
      } else {
        // Default current session device
        setActiveDevicesList([
          {
            id: 'dev_curr_browser',
            deviceName: 'Current Web Browser (Telmy Web)',
            browser: 'Chrome / Edge',
            os: 'Desktop',
            lastActive: new Date().toISOString(),
            isCurrent: true
          }
        ])
      }
    } catch (e) {
      console.warn('Devices fetch error:', e)
    } finally {
      setDevicesLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'profile') {
      fetchActiveDevices()
    }
  }, [activeTab, userProfile?.uid])

  // ==========================================
  // STATE: CREDITS & BILLING INVOICES
  // ==========================================
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [pricingCurrency, setPricingCurrency] = useState<'idr' | 'usd'>('idr')
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [invoicesList, setInvoicesList] = useState<any[]>([])
  const [invoicesLoading, setInvoicesLoading] = useState(false)

  // Waiting List Modal & 10 Forms Reward State
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false)
  const [selectedUpgradeTier, setSelectedUpgradeTier] = useState<PricingTierItem | null>(null)
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false)
  const [waitlistRewardClaimed, setWaitlistRewardClaimed] = useState(false)
  const [isAlreadyJoined, setIsAlreadyJoined] = useState(false)
  const [waitlistFeedbackMsg, setWaitlistFeedbackMsg] = useState('')

  const fetchInvoices = async () => {
    setInvoicesLoading(true)
    try {
      const uid = userProfile?.uid || 'guest_user'
      const res = await fetch(getApiUrl(`/api/payment/invoices/${uid}`))
      const data = await res.json()
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setInvoicesList(data.data)
      } else {
        setInvoicesList([
          {
            id: 'MAYAR-SIM-9421',
            invoiceId: 'MAYAR-SIM-9421',
            item: 'Telmy.ai Standard (25 Forms)',
            amount: 'Rp 49.000 (~$3)',
            date: '10 Okt 2026, 14:30',
            method: 'QRIS / Virtual Account',
            status: 'PAID'
          }
        ])
      }
    } catch (e) {
      setInvoicesList([])
    } finally {
      setInvoicesLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'credits') {
      fetchInvoices()
    }
  }, [activeTab])

  // Sync Extension Broadcast + Register Device
  const [syncNotice, setSyncNotice] = useState(false)
  const handleBroadcastExtension = async () => {
    if (userProfile) {
      window.postMessage({ type: 'TELMY_USER_SESSION_SYNC', user: userProfile }, '*')
      
      // Register device session to Firestore
      try {
        await fetch(getApiUrl('/api/user/device'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: userProfile.uid,
            deviceName: 'Telmy Chrome Extension',
            browser: 'Chrome / Brave / Edge',
            os: navigator.userAgent.includes('Windows') ? 'Windows' : navigator.userAgent.includes('Mac') ? 'macOS' : 'Linux / Mobile',
            userAgent: navigator.userAgent
          })
        })
        fetchActiveDevices()
      } catch (devErr) {}

      setSyncNotice(true)
      setTimeout(() => setSyncNotice(false), 3000)
    }
  }

  // Current active country item
  const activeCountryItem = DASHBOARD_COUNTRIES.find(c => c.code === effectiveLangCode) || DASHBOARD_COUNTRIES[0]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900 text-lg">
              <img src="/telmy_icon.png" alt="Telmy" className="w-8 h-8 rounded-lg shadow-xs" />
              <span>Telmy<span className="text-blue-600">.ai</span></span>
            </Link>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-md">
              {dI18n.cockpitBadge}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-xs text-slate-600">
                {dI18n.navHome}
              </Button>
            </Link>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shadow-xs">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profileName.slice(0, 2).toUpperCase() || 'TU'
                )}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-slate-900 leading-tight">
                  {userProfile?.displayName || 'Telmy User'}
                </p>
                <p className="text-slate-400 text-[11px] truncate max-w-[140px]">
                  {userProfile?.email || 'user@telmy.id'}
                </p>
              </div>
              <Button
                onClick={() => {
                  logout()
                  navigate('/signin')
                }}
                variant="ghost"
                size="sm"
                className="text-xs text-slate-400 hover:text-red-600 p-1.5"
                title={dI18n.navSignOut}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Banner Quick Cockpit Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {dI18n.cockpitBadge}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {dI18n.welcomeGreeting}, {userProfile?.displayName || 'Member Telmy'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              {dI18n.bannerSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={handleBroadcastExtension}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-5 shadow-md shadow-blue-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              <span>{syncNotice ? dI18n.btnSyncDone : dI18n.btnSyncExt}</span>
            </Button>
            <Button
              onClick={() => setPricingModalOpen(true)}
              variant="outline"
              className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10 font-bold text-xs h-10 px-5"
            >
              <CreditCard className="w-3.5 h-3.5 mr-2" />
              <span>{dI18n.btnUpgradeQuota}</span>
            </Button>
          </div>
        </div>

        {/* 6 MAIN NAVIGATION TABS (FULL WIDTH GRID) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer w-full text-center ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>📊</span>
            <span>{dI18n.tabOverview}</span>
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative w-full text-center ${
              activeTab === 'academy'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>🎓</span>
            <span>{dI18n.tabAcademy}</span>
            {!rewardClaimed && completedMissions.length === academyMissions.length && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-2" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer w-full text-center ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>👤</span>
            <span>{dI18n.tabProfile}</span>
          </button>

          <button
            onClick={() => setActiveTab('forms')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer w-full text-center ${
              activeTab === 'forms'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>📋</span>
            <span>{dI18n.tabForms}</span>
          </button>

          <button
            onClick={() => setActiveTab('autofill')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer w-full text-center ${
              activeTab === 'autofill'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>🔐</span>
            <span>{dI18n.tabAutofill}</span>
          </button>

          <button
            onClick={() => setActiveTab('credits')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer w-full text-center ${
              activeTab === 'credits'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>💳</span>
            <span>{dI18n.tabCredits}</span>
          </button>
        </div>

        {/* =========================================================
             TAB 1: DASHBOARD OVERVIEW
             ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {dI18n.kpiCreditsLabel}
                </span>
                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                  <span>{userProfile?.credits ?? 5}</span>
                  <span className="text-xs font-semibold text-slate-400">{dI18n.kpiCreditsUnit}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {dI18n.kpiCreditsDesc}
                </p>
              </Card>

              <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {dI18n.kpiFormsLabel}
                </span>
                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                  <span>{formsHistoryList.length}</span>
                  <span className="text-xs font-semibold text-emerald-600">{dI18n.kpiFormsDone}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {dI18n.kpiFormsDesc}
                </p>
              </Card>

              <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {dI18n.kpiLangLabel}
                </span>
                <div className="text-lg font-black text-blue-600 flex items-center gap-2.5 pt-1">
                  <div className="w-8 h-5 shrink-0 flex items-center justify-center overflow-hidden rounded shadow-xs border border-slate-200">
                    {activeCountryItem.svg ? (
                      <div 
                        className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover" 
                        dangerouslySetInnerHTML={{ __html: activeCountryItem.svg }} 
                      />
                    ) : (
                      <span className="text-xl leading-none">{activeCountryItem.flag}</span>
                    )}
                  </div>
                  <span className="truncate">{activeCountryItem.country}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {dI18n.kpiLangDesc}
                </p>
              </Card>
            </div>

            {/* Quick Actions Grid */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                {dI18n.quickActionTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('academy')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-left cursor-pointer group"
                >
                  <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs group-hover:scale-110 transition-transform">🎓</span>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">{dI18n.quickActionAcademy}</strong>
                    <span className="text-[11px] text-slate-500">{dI18n.quickActionAcademySub}</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('autofill')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-left cursor-pointer group"
                >
                  <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs group-hover:scale-110 transition-transform">⚡</span>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">{dI18n.quickActionVault}</strong>
                    <span className="text-[11px] text-slate-500">{dI18n.quickActionVaultSub}</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('forms')}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-left cursor-pointer group"
                >
                  <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs group-hover:scale-110 transition-transform">📄</span>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">{dI18n.quickActionEditor}</strong>
                    <span className="text-[11px] text-slate-500">{dI18n.quickActionEditorSub}</span>
                  </div>
                </button>

                <button
                  onClick={() => setPricingModalOpen(true)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-left cursor-pointer group"
                >
                  <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs group-hover:scale-110 transition-transform">💳</span>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">{dI18n.quickActionBilling}</strong>
                    <span className="text-[11px] text-slate-500">{dI18n.quickActionBillingSub}</span>
                  </div>
                </button>
              </div>
            </Card>

            {/* Animated Dynamic Quotes: Buruknya Pengalaman Mengisi Formulir */}
            <Card className="p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-200/60 rounded-3xl relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span>{dI18n.quotesHeader || 'The Real Pain of Forms • Quote of the Moment'}</span>
                </div>
                {/* Dots indicator & manual navigation */}
                <div className="flex items-center gap-1.5">
                  {FORM_FRUSTRATION_QUOTES.map((_, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => {
                        setQuoteFade(false)
                        setTimeout(() => {
                          setCurrentQuoteIdx(qIdx)
                          setQuoteFade(true)
                        }, 200)
                      }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentQuoteIdx === qIdx ? 'w-5 bg-blue-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                      title={`Quote ${qIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className={`transition-all duration-350 transform ${quoteFade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <blockquote>
                  <p className="text-base sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-snug">
                    “{FORM_FRUSTRATION_QUOTES[currentQuoteIdx][effectiveLangCode] || FORM_FRUSTRATION_QUOTES[currentQuoteIdx]['en']}”
                  </p>
                </blockquote>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span className="text-blue-700 font-bold bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                    💡 {FORM_FRUSTRATION_QUOTES[currentQuoteIdx].author}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {currentQuoteIdx + 1} of {FORM_FRUSTRATION_QUOTES.length}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================
             TAB 2: ACADEMY (MISSION TRACKER & GAMIFICATION REWARD)
             ========================================================= */}
        {activeTab === 'academy' && (
          <div className="space-y-6">
            {/* Reward Banner */}
            <Card className="p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-200" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-100">
                      {dI18n.academyRewardTag}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {dI18n.academyRewardTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
                    {dI18n.academyRewardDesc}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleClaimReward}
                    disabled={rewardClaimed || completedMissions.length < academyMissions.length || claimLoading}
                    className={`w-full sm:w-auto h-11 px-6 font-bold text-xs rounded-xl shadow-md ${
                      rewardClaimed
                        ? 'bg-emerald-600 text-white cursor-default'
                        : completedMissions.length === academyMissions.length
                        ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                        : 'bg-white/30 text-white/70 cursor-not-allowed'
                    }`}
                  >
                    {rewardClaimed ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>{dI18n.academyClaimedBtn}</span>
                      </span>
                    ) : claimLoading ? (
                      <span>{dI18n.academyProcessing}</span>
                    ) : (
                      <span>{dI18n.academyClaimBtn}</span>
                    )}
                  </Button>
                  <span className="text-[11px] text-amber-100/80">
                    {dI18n.academyProgressLabel}: {completedMissions.length} / {academyMissions.length}
                  </span>
                </div>
              </div>

              {claimMessage && (
                <div className="p-3 bg-white/20 rounded-xl text-xs font-semibold backdrop-blur-xs">
                  {claimMessage}
                </div>
              )}
            </Card>

            {/* Missions Checklist List */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {dI18n.academyListTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {dI18n.academyListDesc}
                  </p>
                </div>

                <Button
                  onClick={markAllCompleted}
                  variant="outline"
                  size="sm"
                  className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50 font-bold"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  <span>{dI18n.academyMarkAll}</span>
                </Button>
              </div>

              <div className="space-y-3">
                {academyMissions.map((mission, idx) => {
                  const isDone = completedMissions.includes(mission.id)
                  return (
                    <div
                      key={mission.id}
                      onClick={() => toggleMission(mission.id)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-blue-50/50 border-blue-200'
                          : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all mt-0.5 cursor-pointer ${
                          isDone
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {idx + 1}. {mission.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600">
                            {mission.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {mission.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveAcademyMission(mission)
                          setSandboxTtsPlaying(false)
                          setSandboxAutofillFilled(false)
                          setSandboxAuditTested(false)
                          setSandboxA11yActive(false)
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 self-center shrink-0 transition-colors cursor-pointer"
                      >
                        <span>{dI18n.academyPracticeLink}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* IN-DASHBOARD INTERACTIVE ACADEMY PRACTICE & GIF MODAL */}
            {activeAcademyMission && (
              <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
                  {/* Header */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shrink-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                          {activeAcademyMission.tag}
                        </span>
                        <span className="text-xs text-blue-200">• {dI18n.academyModalModuleLabel}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {activeAcademyMission.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => setActiveAcademyMission(null)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer shrink-0"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body with Visual Media (GIF) & Hands-on Sandbox */}
                  <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
                    {/* Visual Media (GIF or High-res Screenshot) */}
                    {(activeAcademyMission.gifSrc || activeAcademyMission.imageSrc) && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner relative group">
                        <img
                          src={activeAcademyMission.gifSrc || activeAcademyMission.imageSrc}
                          alt={activeAcademyMission.title}
                          className="w-full max-h-72 object-cover object-top block"
                        />
                        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-200 flex items-center gap-1.5 border border-white/10">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{dI18n.academyModalLiveSim}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Prompt / Summary */}
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-950 font-medium leading-relaxed">
                        {activeAcademyMission.actionPrompt || activeAcademyMission.desc}
                      </p>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {dI18n.academyModalStepsTitle}
                      </h4>
                      <ol className="space-y-2">
                        {activeAcademyMission.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-600">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Interactive Sandbox Simulator Area */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          <span>🧪</span>
                          <span>{dI18n.academyModalSandboxTitle}</span>
                        </span>
                        {activeAcademyMission.practiceSnippet && (
                          <span className="text-[10px] text-slate-400 truncate max-w-xs font-mono">
                            {activeAcademyMission.practiceSnippet}
                          </span>
                        )}
                      </div>

                      {/* Sandbox Action depending on type */}
                      {activeAcademyMission.sandboxType === 'audio' && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-800 block">
                              {activeAcademyMission.title}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {activeAcademyMission.desc}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSandboxTtsPlaying(!sandboxTtsPlaying)}
                            className={`h-9 px-4 text-xs font-bold rounded-xl transition-all ${
                              sandboxTtsPlaying 
                                ? 'bg-amber-600 text-white animate-pulse' 
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5 mr-1.5" />
                            <span>{sandboxTtsPlaying ? 'Playing Audio...' : activeAcademyMission.interactiveLabel}</span>
                          </Button>
                        </div>
                      )}

                      {activeAcademyMission.sandboxType === 'autofill' && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400 block text-[10px]">{dI18n.profileFullName}:</span>
                              <div className="p-2 rounded-lg bg-slate-50 border font-semibold text-slate-800 truncate">
                                {sandboxAutofillFilled ? (userProfile?.displayName || 'Jane Citizen') : '••••••••••••'}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">{dI18n.profileEmail}:</span>
                              <div className="p-2 rounded-lg bg-slate-50 border font-semibold text-slate-800 truncate">
                                {sandboxAutofillFilled ? (userProfile?.email || 'user@telmy.id') : '••••••••••••'}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSandboxAutofillFilled(true)}
                            className="w-full h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
                          >
                            <Zap className="w-3 h-3 mr-1.5" />
                            <span>{sandboxAutofillFilled ? '✓ ' + dI18n.academyModalCompletedLabel : activeAcademyMission.interactiveLabel}</span>
                          </Button>
                        </div>
                      )}

                      {activeAcademyMission.sandboxType === 'audit' && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                          <div className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-between ${
                            sandboxAuditTested 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                              : 'bg-amber-50 border-amber-200 text-amber-800'
                          }`}>
                            <span className="text-[11px]">
                              {sandboxAuditTested 
                                ? '✓ ' + activeAcademyMission.title 
                                : activeAcademyMission.desc}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSandboxAuditTested(true)}
                            className="w-full h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
                          >
                            <Shield className="w-3 h-3 mr-1.5" />
                            <span>{sandboxAuditTested ? '✓ ' + dI18n.academyModalCompletedLabel : activeAcademyMission.interactiveLabel}</span>
                          </Button>
                        </div>
                      )}

                      {activeAcademyMission.sandboxType === 'accessibility' && (
                        <div className={`p-3 rounded-xl border transition-all ${
                          sandboxA11yActive 
                            ? 'bg-slate-900 text-amber-300 border-amber-400 shadow-md font-mono' 
                            : 'bg-white text-slate-800 border-slate-200'
                        }`}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold">
                              {sandboxA11yActive ? 'ADHD Spotlight / High Contrast Active' : activeAcademyMission.title}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setSandboxA11yActive(!sandboxA11yActive)}
                              className={`h-8 text-xs font-bold rounded-xl ${
                                sandboxA11yActive 
                                  ? 'bg-amber-400 text-slate-900 hover:bg-amber-300' 
                                  : 'bg-slate-800 text-white hover:bg-slate-700'
                              }`}
                            >
                              <span>{sandboxA11yActive ? '✓ ' + dI18n.academyModalCompletedLabel : activeAcademyMission.interactiveLabel}</span>
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeAcademyMission.sandboxType === 'extension' && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-slate-800 block">
                              {activeAcademyMission.title}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {activeAcademyMission.desc}
                            </span>
                          </div>
                          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{dI18n.btnSyncDone}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Modal */}
                  <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveAcademyMission(null)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      {dI18n.btnClose}
                    </Button>

                    <Button
                      onClick={() => {
                        if (!completedMissions.includes(activeAcademyMission.id)) {
                          toggleMission(activeAcademyMission.id)
                        }
                        setActiveAcademyMission(null)
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs flex items-center gap-2"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>
                        {completedMissions.includes(activeAcademyMission.id)
                          ? dI18n.academyModalCompletedLabel
                          : dI18n.academyModalCompleteBtn}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
             TAB 3: PROFILE (IDENTITY & 11 COUNTRIES SELECTOR)
             ========================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center overflow-hidden shadow-md">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profileName.slice(0, 2).toUpperCase() || 'TU'
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{profileName}</h3>
                  <p className="text-xs text-slate-500">{userProfile?.email || 'user@telmy.id'}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    {dI18n.profileGoogleVerified}
                  </span>
                </div>
              </div>

              {/* Form Input Data Akun */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{dI18n.profileFullName}</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{dI18n.profileEmail}</label>
                  <input
                    type="email"
                    value={userProfile?.email || 'user@telmy.id'}
                    disabled
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-100/70 text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Pemilih Negara Asal / Bahasa Panduan Utama (Pilihan Berdasarkan Negara) */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-900 block">
                    {dI18n.profileCountrySelector}
                  </label>
                  <p className="text-[11px] text-slate-500">
                    {dI18n.profileCountryDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DASHBOARD_COUNTRIES.map((item) => {
                    const isSelected = selectedCountryCode === item.code
                    return (
                      <button
                        type="button"
                        key={item.code}
                        onClick={() => setSelectedCountryCode(item.code)}
                        className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 shadow-2xs ring-1 ring-blue-600'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-9 h-6 shrink-0 flex items-center justify-center overflow-hidden rounded shadow-xs border border-slate-200">
                          {item.svg ? (
                            <div 
                              className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover" 
                              dangerouslySetInnerHTML={{ __html: item.svg }} 
                            />
                          ) : (
                            <span className="text-2xl leading-none">{item.flag}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <strong className="block text-xs font-bold text-slate-900 truncate">
                            {item.country}
                          </strong>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {item.nativeName}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-6 rounded-xl"
                >
                  <span>{dI18n.profileSaveBtn}</span>
                </Button>

                {profileSavedToast && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{dI18n.profileSavedSuccess}</span>
                  </span>
                )}
              </div>
            </Card>

            {/* SECTION 6: PERANGKAT & EKSTENSI AKTIF (CONNECTED DEVICES) */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <span>{dI18n.devicesTitle}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {dI18n.devicesDesc}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchActiveDevices}
                  disabled={devicesLoading}
                  className="text-xs font-bold text-slate-600"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${devicesLoading ? 'animate-spin' : ''}`} />
                  <span>{dI18n.devicesRefreshBtn}</span>
                </Button>
              </div>

              {devicesLoading ? (
                <div className="p-6 text-center text-xs text-slate-400">Memeriksa perangkat aktif...</div>
              ) : activeDevicesList.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  {dI18n.devicesEmpty}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {activeDevicesList.map((dev: any, idx: number) => (
                    <div key={dev.id || idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          {dev.os?.toLowerCase().includes('mac') ? (
                            <Laptop className="w-5 h-5" />
                          ) : (
                            <Globe className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <strong className="block text-xs font-bold text-slate-900">
                            {dev.deviceName || 'Chrome Extension'}
                          </strong>
                          <span className="text-[11px] text-slate-500">
                            {dev.browser || 'Chrome'} • {dev.os || 'Desktop OS'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Aktif Sekarang</span>
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          {dev.lastActive ? new Date(dev.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* =========================================================
             TAB 4: FORMS (RIWAYAT ONLINE/PDF & TELMY EDITOR DEMO)
             ========================================================= */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFormFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dI18n.formsFilterAll}
                </button>
                <button
                  onClick={() => setFormFilter('online')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formFilter === 'online'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dI18n.formsFilterOnline}
                </button>
                <button
                  onClick={() => setFormFilter('pdf')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formFilter === 'pdf'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dI18n.formsFilterPdf}
                </button>
              </div>

              {/* Telmy Editor PDF Guidance Demo Button */}
              <Button
                onClick={() => setEditorModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs"
              >
                <span>{dI18n.formsBtnEditorDemo}</span>
              </Button>
            </div>

            {/* Forms Table */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{dI18n.formsThTitle}</th>
                      <th className="py-3 px-4">{dI18n.formsThAuthority}</th>
                      <th className="py-3 px-4">{dI18n.formsThType}</th>
                      <th className="py-3 px-4">{dI18n.formsThDate}</th>
                      <th className="py-3 px-4">{dI18n.formsThStatus}</th>
                      <th className="py-3 px-4 text-right">{dI18n.formsThAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formsHistoryList.filter(f => formFilter === 'all' || f.type === formFilter).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs font-semibold text-slate-600">{dI18n.formsEmptyTitle}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{dI18n.formsEmptyDesc}</p>
                        </td>
                      </tr>
                    ) : (
                      formsHistoryList
                        .filter(f => formFilter === 'all' || f.type === formFilter)
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {item.title}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{item.authority}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                item.type === 'pdf'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {item.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">{item.date}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                                🟢 0 Error
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {item.type === 'pdf' ? (
                                <button
                                  onClick={() => navigate(`/pdf-editor?id=${item.id}&session=${item.sessionId || ''}`)}
                                  className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 ml-auto"
                                >
                                  <span>{dI18n.formsOpenEditor}</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => setEditorModalOpen(true)}
                                  className="text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
                                >
                                  {dI18n.formsOpenEditor}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* TELMY EDITOR DEMO MODAL (SPLIT SCREEN VIEW) */}
            {editorModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
                  {/* Editor Header */}
                  <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📄</span>
                      <strong className="text-sm font-bold">{dI18n.editorTitle}</strong>
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">{dI18n.editorDemoMode}</span>
                    </div>
                    <button
                      onClick={() => setEditorModalOpen(false)}
                      className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Split Screen Workspace */}
                  <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Left: Document Mockup with Bounding Box */}
                    <div className="flex-1 bg-slate-100 p-6 overflow-y-auto flex items-center justify-center">
                      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg border border-slate-300 space-y-6 text-slate-800 text-xs font-serif">
                        <div className="text-center border-b pb-4">
                          <h4 className="font-bold text-sm tracking-wide">{dI18n.editorDocTitle}</h4>
                          <p className="text-[10px] text-slate-500 font-sans">{dI18n.editorDocSub}</p>
                        </div>

                        <div className="space-y-4 font-sans text-xs">
                          <div
                            onClick={() => setActiveEditorField(1)}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              activeEditorField === 1
                                ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/20'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <span className="font-bold text-slate-700 block text-[11px]">1. Surname / Family Name</span>
                            <span className="font-mono text-slate-900 font-bold">{userProfile?.displayName?.split(' ').pop() || 'NURHALIZA'}</span>
                          </div>

                          <div
                            onClick={() => setActiveEditorField(2)}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              activeEditorField === 2
                                ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/20'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <span className="font-bold text-slate-700 block text-[11px]">2. First Name(s) / Given Name</span>
                            <span className="font-mono text-slate-900 font-bold">{userProfile?.displayName?.split(' ')[0] || 'SITI'}</span>
                          </div>

                          <div
                            onClick={() => setActiveEditorField(3)}
                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              activeEditorField === 3
                                ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/20'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <span className="font-bold text-slate-700 block text-[11px]">3. Travel Document Number (Passport)</span>
                            <span className="font-mono text-slate-900 font-bold">A12345678</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: AI Guidance Panel */}
                    <div className="w-full md:w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">🤖</span>
                          <strong className="text-xs font-bold text-slate-900">{dI18n.editorPanelTitle}</strong>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          Field #{activeEditorField}
                        </span>
                      </div>

                      {activeEditorField === 1 && (
                        <div className="space-y-3 text-xs">
                          <h5 className="font-bold text-slate-900">Kolom 1: Surname / Nama Keluarga</h5>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            Masukkan nama belakang Anda sesuai paspor. Jika nama Anda satu kata (mononim), masukkan nama Anda di kolom ini dan kosongkan first name, atau gunakan rekomendasi imigrasi resmi.
                          </p>
                          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 text-[11px]">
                            <strong>Contoh Aman:</strong> SITI NURHALIZA ➔ Surname: NURHALIZA
                          </div>
                        </div>
                      )}

                      {activeEditorField === 2 && (
                        <div className="space-y-3 text-xs">
                          <h5 className="font-bold text-slate-900">Kolom 2: First Name / Nama Depan</h5>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            Nama pemberian Anda sesuai yang tertera pada baris MRZ (Machine Readable Zone) paspor.
                          </p>
                          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 text-[11px]">
                            <strong>Contoh Aman:</strong> SITI
                          </div>
                        </div>
                      )}

                      {activeEditorField === 3 && (
                        <div className="space-y-3 text-xs">
                          <h5 className="font-bold text-slate-900">Kolom 3: Nomor Paspor</h5>
                          <p className="text-slate-600 leading-relaxed text-[11px]">
                            Nomor paspor resmi diawali huruf kapital diikuti 7 atau 8 angka tanpa spasi.
                          </p>
                          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px]">
                            <strong>Status Audit:</strong> Valid (Format Sesuai ICAO 9303)
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-100 space-y-2">
                        <Button
                          onClick={() => {
                            if (window.speechSynthesis) {
                              const utt = new SpeechSynthesisUtterance(
                                activeEditorField === 1
                                  ? 'Field one is your legal surname or family name as printed on passport.'
                                  : 'Field three is your official travel document or passport number.'
                              )
                              utt.lang = effectiveLangCode === 'zh-tw' ? 'zh-TW' : effectiveLangCode
                              window.speechSynthesis.speak(utt)
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs font-bold text-slate-700"
                        >
                          <Volume2 className="w-3.5 h-3.5 mr-1.5" />
                          <span>{dI18n.editorTtsBtn}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
             TAB 5: AUTOFILL (DYNAMIC VAULTS & DUAL-LOCK)
             ========================================================= */}
        {activeTab === 'autofill' && (
          <div className="space-y-6">
            {/* Vault Lock Status Card */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{vaultUnlocked ? '🔓' : '🔒'}</span>
                    <h3 className="text-base font-bold text-slate-900">
                      {dI18n.vaultTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                    {dI18n.vaultDesc}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {vaultUnlocked ? (
                    <Button
                      onClick={() => setVaultUnlocked(false)}
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold text-slate-600 hover:text-red-600 border-slate-200"
                    >
                      <Lock className="w-3.5 h-3.5 mr-1.5" />
                      <span>{dI18n.vaultLockBtn}</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setUnlockModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs"
                    >
                      <Key className="w-3.5 h-3.5 mr-1.5" />
                      <span>{dI18n.vaultUnlockBtn}</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* 12-Seed Word Action Strip (Only accessible when Vault is UNLOCKED) */}
              {vaultUnlocked ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-800">{dI18n.vaultSeedStrip}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(masterSeedPhrase)
                        alert('12 Secret Words copied to clipboard!')
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-slate-600 h-8"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      <span>{dI18n.vaultCopySeed}</span>
                    </Button>
                    <Button
                      onClick={() => {
                        const blob = new Blob([masterSeedPhrase], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `telmy-vault-seed-${Date.now().toString(36)}.txt`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-slate-600 h-8"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      <span>{dI18n.vaultSaveTxt}</span>
                    </Button>
                    <Button
                      onClick={() => setSeedRegenWarningOpen(true)}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-red-600 hover:bg-red-50 h-8"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      <span>{dI18n.vaultRegenBtn}</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{dI18n.vaultSeedLockNote}</span>
                  </div>
                </div>
              )}
            </Card>

            {/* List of Dynamic Vault Compartments */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {dI18n.vaultListTitle} ({vaultCompartments.length})
                  </h4>
                  <p className="text-xs text-slate-500">
                    {dI18n.vaultManageSubtitle}
                  </p>
                </div>
                {vaultUnlocked && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      onClick={() => setIsIngestModalOpen(true)}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      <span>{dI18n.btnUploadDoc}</span>
                    </Button>
                    <Button
                      onClick={handleOpenCreateCompartment}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      <span>{dI18n.btnCreateVault}</span>
                    </Button>
                  </div>
                )}
              </div>

              {vaultCompartments.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-3xl bg-white border border-dashed border-slate-200">
                  <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <h5 className="text-sm font-bold text-slate-700">{dI18n.vaultEmptyTitle}</h5>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    {vaultUnlocked 
                      ? dI18n.vaultEmptyUnlockedDesc 
                      : dI18n.vaultEmptyLockedDesc}
                  </p>
                  {vaultUnlocked && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <Button
                        onClick={() => setIsIngestModalOpen(true)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4 rounded-xl"
                      >
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        <span>{dI18n.btnUploadDoc}</span>
                      </Button>
                      <Button
                        onClick={handleOpenCreateCompartment}
                        size="sm"
                        variant="outline"
                        className="font-bold text-xs h-9 px-4 rounded-xl"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        <span>{dI18n.btnCreateManual}</span>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vaultCompartments.map((comp) => (
                    <Card key={comp.id} className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                            {comp.badge || 'Koper'}
                          </span>
                          {vaultUnlocked && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditCompartment(comp)}
                                className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer transition-colors"
                                title="Edit koper & kolom"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCompartment(comp.id)}
                                className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                                title="Hapus koper ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <h5 className="font-bold text-slate-900 text-sm leading-tight">
                          {comp.title}
                        </h5>

                        {vaultUnlocked ? (
                          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                            {Array.isArray(comp.fields) && comp.fields.length > 0 ? (
                              comp.fields.map((f: any, idx: number) => (
                                <div key={idx} className="flex items-baseline justify-between gap-2 font-mono text-[11px] py-0.5">
                                  <span className="text-slate-500 font-sans truncate max-w-[45%]">{f.key}:</span>
                                  <span className="font-bold text-slate-800 truncate text-right">{f.value || '—'}</span>
                                </div>
                              ))
                            ) : (
                              <div className="py-2 text-center text-[11px] text-slate-400">
                                Belum ada kolom terdaftar.
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Lock className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                            <span>{dI18n.vaultLockedData}</span>
                          </div>
                        )}
                      </div>

                      {vaultUnlocked && (
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleOpenEditCompartment(comp)}
                            className="w-full py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Kelola Kolom & Nilai</span>
                          </button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* UNLOCK MODAL (DUAL-LOCK: PASSWORD OR 12 SEED WORDS) */}
            {unlockModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔐</span>
                      <strong className="text-sm font-bold text-slate-900">{dI18n.vaultUnlockBtn}</strong>
                    </div>
                    <button
                      onClick={() => setUnlockModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Dual Mode Switcher */}
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setUnlockMode('password')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unlockMode === 'password' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      🔑 Master Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnlockMode('seed')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        unlockMode === 'seed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      🛡️ 12 Seed Words
                    </button>
                  </div>

                  {unlockMode === 'password' ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        {dI18n.vaultUnlockPasswordPlaceholder}
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        {dI18n.vaultUnlockSeedPlaceholder}
                      </label>
                      <textarea
                        rows={3}
                        placeholder="alpha beacon cable daring..."
                        value={inputSeedText}
                        onChange={(e) => setInputSeedText(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  )}

                  {unlockError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                      <p className="text-xs font-bold text-red-600">{unlockError}</p>
                      <button
                        type="button"
                        onClick={() => setVaultResetConfirmOpen(true)}
                        className="text-[11px] font-bold text-red-700 hover:text-red-900 underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{dI18n.vaultResetBtn}</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setVaultResetConfirmOpen(true)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{dI18n.vaultResetBtn}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setUnlockModalOpen(false)}
                        variant="ghost"
                        size="sm"
                        className="text-xs font-bold"
                      >
                        {dI18n.vaultUnlockBtnCancel}
                      </Button>
                      <Button
                        onClick={handleUnlockVault}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 h-9"
                      >
                        {dI18n.vaultUnlockBtnSubmit}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RESET VAULT CONFIRMATION MODAL WITH ZERO-KNOWLEDGE WARNING */}
            {vaultResetConfirmOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-2.5 text-red-600 font-bold text-sm">
                    <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{dI18n.vaultResetConfirmTitle}</h4>
                      <span className="text-[10px] text-red-600 font-semibold uppercase tracking-wider">Zero-Knowledge Reset</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 space-y-2">
                    <p className="text-xs text-red-950 leading-relaxed font-medium">
                      {dI18n.vaultResetConfirmDesc}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                    <Button
                      onClick={() => setVaultResetConfirmOpen(false)}
                      disabled={resetVaultLoading}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold order-2 sm:order-1"
                    >
                      {dI18n.vaultResetConfirmCancel}
                    </Button>
                    <Button
                      onClick={handleResetVault}
                      disabled={resetVaultLoading}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 h-9 shadow-sm order-1 sm:order-2"
                    >
                      {resetVaultLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          <span>Mereset...</span>
                        </>
                      ) : (
                        <span>{dI18n.vaultResetConfirmSubmit}</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* SEED REGENERATION WARNING MODAL */}
            {seedRegenWarningOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{dI18n.seedRegenWarningTitle}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dI18n.seedRegenWarningDesc}
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      onClick={() => setSeedRegenWarningOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold"
                    >
                      {dI18n.seedRegenBtnCancel}
                    </Button>
                    <Button
                      onClick={handleRegenerateSeedWords}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 h-9"
                    >
                      {dI18n.seedRegenBtnConfirm}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* RICH MODAL: EDIT / CREATE VAULT COMPARTMENT (DYNAMIC FIELD BUILDER) */}
            {isCompModalOpen && activeEditingComp && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] flex flex-col">
                  <div className="flex items-center justify-between border-b pb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🗂️</span>
                      <strong className="text-sm font-bold text-slate-900">
                        {vaultCompartments.some(c => c.id === activeEditingComp.id) ? dI18n.modalEditVaultTitle : dI18n.modalCreateVaultTitle}
                      </strong>
                    </div>
                    <button
                      onClick={() => {
                        setIsCompModalOpen(false)
                        setActiveEditingComp(null)
                      }}
                      className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                    {/* Compartment Title & Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700">{dI18n.fieldVaultTitle}</label>
                        <input
                          type="text"
                          placeholder={dI18n.fieldVaultPlaceholder}
                          value={activeEditingComp.title}
                          onChange={(e) => setActiveEditingComp({ ...activeEditingComp, title: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">{dI18n.fieldBadgeCategory}</label>
                        <select
                          value={activeEditingComp.badge}
                          onChange={(e) => setActiveEditingComp({ ...activeEditingComp, badge: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-600 bg-white"
                        >
                          <option value="Utama">{dI18n.badgeMain}</option>
                          <option value="Travel">{dI18n.badgeTravel}</option>
                          <option value="Akademik">{dI18n.badgeAcademic}</option>
                          <option value="Keuangan">{dI18n.badgeFinance}</option>
                          <option value="Keluarga">{dI18n.badgeFamily}</option>
                          <option value="Custom">{dI18n.badgeCustom}</option>
                        </select>
                      </div>
                    </div>

                    {/* Dynamic Fields Table */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">
                          {dI18n.fieldColsCount} ({activeEditingComp.fields.length})
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveEditingComp({
                              ...activeEditingComp,
                              fields: [...activeEditingComp.fields, { key: '', value: '' }]
                            })
                          }}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{dI18n.btnAddColRow}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {activeEditingComp.fields.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                            <input
                              type="text"
                              placeholder={dI18n.fieldColKeyPlaceholder}
                              value={f.key}
                              onChange={(e) => {
                                const fields = [...activeEditingComp.fields]
                                fields[idx].key = e.target.value
                                setActiveEditingComp({ ...activeEditingComp, fields })
                              }}
                              className="w-2/5 h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-blue-600"
                            />
                            <span className="text-slate-400 font-bold text-xs">:</span>
                            <input
                              type="text"
                              placeholder={dI18n.fieldColValPlaceholder}
                              value={f.value}
                              onChange={(e) => {
                                const fields = [...activeEditingComp.fields]
                                fields[idx].value = e.target.value
                                setActiveEditingComp({ ...activeEditingComp, fields })
                              }}
                              className="flex-1 h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const fields = activeEditingComp.fields.filter((_, i) => i !== idx)
                                setActiveEditingComp({ ...activeEditingComp, fields })
                              }}
                              className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                              title="Hapus baris kolom ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveEditingComp({
                            ...activeEditingComp,
                            fields: [...activeEditingComp.fields, { key: '', value: '' }]
                          })
                        }}
                        className="w-full py-2 rounded-xl border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1 transition-all cursor-pointer mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{dI18n.btnAddColNew}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t shrink-0">
                    <Button
                      onClick={() => {
                        setIsCompModalOpen(false)
                        setActiveEditingComp(null)
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold"
                    >
                      {dI18n.btnCancel}
                    </Button>
                    <Button
                      onClick={handleSaveCompartmentModal}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 h-9 rounded-xl shadow-xs"
                    >
                      {dI18n.btnSaveVault}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT INGEST MODAL: AI EXTRACT FROM KTP / PASSPORT / DIPLOMA */}
            {isIngestModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📄</span>
                      <strong className="text-sm font-bold text-slate-900">{dI18n.ingestModalTitle}</strong>
                    </div>
                    <button
                      onClick={() => setIsIngestModalOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dI18n.ingestModalDesc}
                  </p>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 text-[11px] text-emerald-800">
                    🔒 <strong>{dI18n.ingestPolicyPrefix}</strong>: {dI18n.ingestPolicyText}
                  </div>

                  {ingestError && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
                      ⚠️ {ingestError}
                    </div>
                  )}

                  <div className="pt-2">
                    <label className="block w-full cursor-pointer">
                      <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-2xl p-6 text-center transition-all">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <span className="text-xs font-bold text-slate-700 block">
                          {ingestLoading ? dI18n.ingestDropzoneLoading : dI18n.ingestDropzoneTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {dI18n.ingestDropzoneSub}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        disabled={ingestLoading}
                        onChange={handleFileIngest}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => setIsIngestModalOpen(false)}
                      disabled={ingestLoading}
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold"
                    >
                      {dI18n.btnClose}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
             TAB 6: CREDITS & BILLING INVOICES
             ========================================================= */}
        {activeTab === 'credits' && (
          <div className="space-y-6">
            {/* Credit Balance Card */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {dI18n.creditsTitle}
                  </span>
                  <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                    <span>{userProfile?.credits ?? 5}</span>
                    <span className="text-sm font-semibold text-slate-500">{dI18n.creditsUnit}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {dI18n.creditsPlanPrefix} <span className="font-bold text-slate-800 uppercase">{userProfile?.plan || 'Free Tier'}</span> • Auto-refreshed
                  </p>
                </div>

                <Button
                  onClick={() => setPricingModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5 mr-2" />
                  <span>{dI18n.creditsUpgradeBtn}</span>
                </Button>
              </div>
            </Card>

            {/* Invoices List from Backend */}
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {dI18n.invoicesTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {dI18n.invoicesDesc}
                  </p>
                </div>
                <Button
                  onClick={fetchInvoices}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  <span>{dI18n.invoicesRefreshBtn}</span>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{dI18n.invoicesThNo}</th>
                      <th className="py-3 px-4">{dI18n.invoicesThItem}</th>
                      <th className="py-3 px-4">{dI18n.invoicesThDate}</th>
                      <th className="py-3 px-4">{dI18n.invoicesThAmount}</th>
                      <th className="py-3 px-4">{dI18n.invoicesThMethod}</th>
                      <th className="py-3 px-4">{dI18n.invoicesThStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoicesList.map((inv) => (
                      <tr key={inv.id || inv.invoiceId} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {inv.invoiceId || inv.id}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{inv.item}</td>
                        <td className="py-3.5 px-4 text-slate-400">{inv.date}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{inv.amount}</td>
                        <td className="py-3.5 px-4 text-slate-600">{inv.method || 'QRIS / VA'}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                            {inv.status || 'PAID'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* PRICING MODAL DIALOG (GLOBAL - ACCESSIBLE FROM ANY TAB) */}
        {pricingModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {dI18n.quotaModalTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {dI18n.quotaModalSubtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Currency Toggle */}
                  <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setPricingCurrency('idr')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        pricingCurrency === 'idr' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      IDR (Rp)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricingCurrency('usd')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        pricingCurrency === 'usd' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>

                  <button
                    onClick={() => setPricingModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* 3 Tier Grid matching /pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {PRICING_TIERS_DATA.map((tier) => {
                  const langKey = effectiveLangCode in tier.name ? effectiveLangCode : 'en'
                  const name = tier.name[langKey] || tier.name.en
                  const quota = tier.formsQuota[langKey] || tier.formsQuota.en
                  const period = tier.period[langKey] || tier.period.en
                  const desc = tier.description[langKey] || tier.description.en
                  const rate = tier.rateText[langKey] || tier.rateText.en
                  const feats = tier.features[langKey] || tier.features.en
                  const displayPrice = pricingCurrency === 'usd' ? tier.displayPriceUsd : tier.displayPriceIdr
                  const isCurrentPlan = (userProfile?.plan || 'free').toLowerCase() === tier.id.toLowerCase()

                  return (
                    <div
                      key={tier.id}
                      className={`p-6 rounded-3xl flex flex-col justify-between transition-all relative overflow-hidden ${
                        tier.isPopular
                          ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10'
                          : 'bg-white border border-slate-200 shadow-xs'
                      }`}
                    >
                      {tier.isPopular && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                          {dI18n.quotaPopularBadge}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-bold text-slate-900">{name}</h4>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${
                              tier.isPopular ? 'bg-blue-50 text-blue-700 font-extrabold' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {quota}
                          </span>
                        </div>

                        <div className="mb-1 flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {displayPrice}
                          </span>
                          <span className="text-slate-500 text-xs font-medium">
                            / {period}
                          </span>
                        </div>

                        <p className="text-[11px] font-bold text-blue-600 mb-3">
                          {rate}
                        </p>

                        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                          {desc}
                        </p>

                        <div className="border-t border-slate-100 pt-4">
                          <ul className="space-y-2.5 text-xs text-slate-700">
                            {feats.slice(0, 5).map((f, idx) => (
                              <li key={idx} className="flex items-start gap-2 leading-snug">
                                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                <span className="text-[11px]">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100">
                        {isCurrentPlan ? (
                          <Button
                            disabled
                            variant="outline"
                            size="sm"
                            className="w-full text-xs font-bold bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                          >
                            ✓ {WAITING_LIST_I18N[langKey]?.activeBadge || 'Active Plan'}
                          </Button>
                        ) : tier.id === 'free' ? (
                          <Button
                            disabled
                            variant="outline"
                            size="sm"
                            className="w-full text-xs font-bold bg-slate-50 text-slate-400 border-slate-200"
                          >
                            {WAITING_LIST_I18N[langKey]?.freeDefaultBadge || 'Free Base Quota'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setSelectedUpgradeTier(tier)
                              setWaitlistModalOpen(true)
                            }}
                            className={`w-full text-xs font-bold cursor-pointer ${
                              tier.isPopular
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            {tier.ctaBtn[langKey] || tier.ctaBtn.en || `Choose ${name}`}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Gateway Notice Below 3 Cards */}
              <div className="pt-2 text-center border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    {WAITING_LIST_I18N[effectiveLangCode]?.gatewayFooterNote || WAITING_LIST_I18N.en.gatewayFooterNote}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* WAITING LIST & 10 FREE FORMS REWARD MODAL */}
        {waitlistModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Background gradient decoration */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 rounded-full bg-blue-100/60 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-44 h-44 rounded-full bg-emerald-100/60 blur-2xl pointer-events-none" />

              <div className="relative space-y-5">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {WAITING_LIST_I18N[effectiveLangCode]?.modalTag || WAITING_LIST_I18N.en.modalTag}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setWaitlistModalOpen(false)
                      setWaitlistRewardClaimed(false)
                      setWaitlistFeedbackMsg('')
                    }}
                    className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {!waitlistRewardClaimed ? (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900 leading-tight">
                        {WAITING_LIST_I18N[effectiveLangCode]?.modalTitle || WAITING_LIST_I18N.en.modalTitle}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600">
                        {selectedUpgradeTier
                          ? `${WAITING_LIST_I18N[effectiveLangCode]?.selectedPlanLabel || 'Plan'}: ${selectedUpgradeTier.name[effectiveLangCode] || selectedUpgradeTier.name.en}`
                          : ''}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {WAITING_LIST_I18N[effectiveLangCode]?.modalSubtitle || WAITING_LIST_I18N.en.modalSubtitle}
                      </p>
                    </div>

                    {/* Bonus Callout Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/60 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎁</span>
                        <span className="text-xs font-black text-blue-900 uppercase tracking-wide">
                          {WAITING_LIST_I18N[effectiveLangCode]?.bonusBadge || WAITING_LIST_I18N.en.bonusBadge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {WAITING_LIST_I18N[effectiveLangCode]?.messageBody2 || WAITING_LIST_I18N.en.messageBody2}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug">
                      {WAITING_LIST_I18N[effectiveLangCode]?.messageBody1 || WAITING_LIST_I18N.en.messageBody1}
                    </p>

                    {waitlistFeedbackMsg && (
                      <p className="text-xs font-medium text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        {waitlistFeedbackMsg}
                      </p>
                    )}

                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                      <Button
                        disabled={isJoiningWaitlist}
                        onClick={async () => {
                          setIsJoiningWaitlist(true)
                          setWaitlistFeedbackMsg('')
                          try {
                            const uid = userProfile?.uid || 'guest_user'
                            const email = userProfile?.email || ''
                            const name = userProfile?.displayName || 'Telmy User'
                            const planId = selectedUpgradeTier?.id || 'standard'

                            const res = await fetch(getApiUrl('/api/payment/join-waiting-list'), {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ uid, email, name, planId })
                            })
                            const data = await res.json()

                            if (data.success) {
                              setWaitlistRewardClaimed(true)
                              if (data.user?.totalRemaining !== undefined && updateUserProfile) {
                                updateUserProfile({
                                  credits: data.user.totalRemaining,
                                  plan: data.user.plan || userProfile?.plan || 'payg'
                                })
                              }
                              if (refreshQuota) refreshQuota()
                              if (data.alreadyJoined) {
                                setIsAlreadyJoined(true)
                                setWaitlistFeedbackMsg(WAITING_LIST_I18N[effectiveLangCode]?.alreadyJoinedDesc || WAITING_LIST_I18N.en.alreadyJoinedDesc)
                              } else {
                                setIsAlreadyJoined(false)
                                setWaitlistFeedbackMsg(WAITING_LIST_I18N[effectiveLangCode]?.successDesc || WAITING_LIST_I18N.en.successDesc)
                              }
                            } else {
                              setWaitlistFeedbackMsg(data.error || 'Gagal mendaftar ke daftar tunggu.')
                            }
                          } catch (err: any) {
                            setWaitlistFeedbackMsg('Gagal menghubungi server: ' + err.message)
                          } finally {
                            setIsJoiningWaitlist(false)
                          }
                        }}
                        className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs py-2.5 shadow-md shadow-blue-500/20 cursor-pointer"
                      >
                        {isJoiningWaitlist ? (
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Mendaftarkan...</span>
                          </div>
                        ) : (
                          WAITING_LIST_I18N[effectiveLangCode]?.btnJoin || WAITING_LIST_I18N.en.btnJoin
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setWaitlistModalOpen(false)
                          setWaitlistFeedbackMsg('')
                          setIsAlreadyJoined(false)
                        }}
                        className="w-full sm:w-auto text-xs font-semibold rounded-xl"
                      >
                        {dI18n.btnCancel || 'Cancel'}
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Result / Notice State View */
                  <div className="text-center py-4 space-y-4">
                    <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner ${
                      isAlreadyJoined 
                        ? 'bg-amber-100 text-amber-600 border border-amber-200' 
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {isAlreadyJoined ? 'ℹ️' : '✓'}
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-slate-900">
                        {isAlreadyJoined 
                          ? (effectiveLangCode === 'id' ? 'Anda Sudah Terdaftar di Waiting List' : 'You are Already on the Waiting List')
                          : (WAITING_LIST_I18N[effectiveLangCode]?.successTitle || WAITING_LIST_I18N.en.successTitle)}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                        {waitlistFeedbackMsg || (isAlreadyJoined 
                          ? (WAITING_LIST_I18N[effectiveLangCode]?.alreadyJoinedDesc || WAITING_LIST_I18N.en.alreadyJoinedDesc)
                          : (WAITING_LIST_I18N[effectiveLangCode]?.successDesc || WAITING_LIST_I18N.en.successDesc))}
                      </p>
                    </div>

                    <div className="pt-3">
                      <Button
                        onClick={() => {
                          setWaitlistModalOpen(false)
                          setPricingModalOpen(false)
                          setWaitlistRewardClaimed(false)
                          setIsAlreadyJoined(false)
                          setWaitlistFeedbackMsg('')
                        }}
                        className="w-full font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs py-2.5"
                      >
                        {WAITING_LIST_I18N[effectiveLangCode]?.btnSuccessClose || WAITING_LIST_I18N.en.btnSuccessClose}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
