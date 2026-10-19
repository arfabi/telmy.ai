export interface MarqueeTexts {
  badge: string;
  title: string;
  subtitle: string;
  pause: string;
  play: string;
  explore: string;
  note: string;
  cta: string;
}

export const LANGUAGE_MARQUEE_I18N: Record<string, MarqueeTexts> = {
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
  ms: {
    badge: "Liputan Bahasa Global",
    title: "Penerangan dalam bahasa ibunda anda",
    subtitle: "Panduan borang dan suara AI semula jadi dalam 11 bahasa rasmi Asia-Pasifik, dengan bahasa Eropah dan Timur Tengah sedang dibangunkan secara aktif.",
    pause: "Jeda Ticker",
    play: "Sambung Ticker",
    explore: "Lihat Butiran Bahasa",
    note: "✓ 11 bahasa Asia-Pasifik siap digunakan. Perlukan bahasa khusus untuk kedutaan atau universiti anda?",
    cta: "Minta Bahasa Baharu atau Semak Matriks Ciri →"
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
  },
  vi: {
    badge: "Phạm Vi Ngôn Ngữ Toàn Cầu",
    title: "Giải thích rõ ràng bằng ngôn ngữ mẹ đẻ của bạn",
    subtitle: "Giọng đọc AI tự nhiên và hướng dẫn biểu mẫu bằng 11 ngôn ngữ Châu Á - Thái Bình Dương, cùng các ngôn ngữ Châu Âu và Trung Đông đang được mở rộng.",
    pause: "Tạm dừng",
    play: "Tiếp tục",
    explore: "Xem Chi Tiết Ngôn Ngữ",
    note: "✓ 11 ngôn ngữ Châu Á - Thái Bình Dương đã sẵn sàng. Bạn có yêu cầu ngôn ngữ cụ thể cho đại sứ quán hoặc trường đại học?",
    cta: "Yêu cầu ngôn ngữ hoặc xem bảng tính năng →"
  },
  th: {
    badge: "ครอบคลุมภาษาทั่วโลก",
    title: "คำอธิบายในภาษาแม่ของคุณอย่างชัดเจน",
    subtitle: "เสียง AI ธรรมชาติและคำแนะนำแบบฟอร์มใน 11 ภาษาเอเชียแปซิฟิกในปัจจุบัน พร้อมภาษาในยุโรปและตะวันออกกลางที่กำลังเปิดตัวอย่างต่อเนื่อง",
    pause: "หยุดชั่วคราว",
    play: "เล่นต่อ",
    explore: "ดูรายละเอียดภาษา",
    note: "✓ รองรับ 11 ภาษาในเอเชียแปซิฟิกอย่างสมบูรณ์ ต้องการภาษาเฉพาะสำหรับสถานทูตหรือมหาวิทยาลัยของคุณหรือไม่?",
    cta: "ขอเพิ่มภาษาหรือตรวจสอบฟีเจอร์ทั้งหมด →"
  },
  hi: {
    badge: "वैश्विक भाषा कवरेज",
    title: "आपकी अपनी मातृभाषा में स्पष्ट व्याख्या",
    subtitle: "आज 11 एशिया-प्रशांत भाषाओं में प्राकृतिक एआई आवाज और फॉर्म मार्गदर्शन, जिसमें यूरोपीय और मध्य-पूर्वी भाषाएं सक्रिय रूप से शामिल की जा रही हैं।",
    pause: "रोकें",
    play: "शुरू करें",
    explore: "भाषा विवरण देखें",
    note: "✓ 11 एशिया-प्रशांत भाषाएं पूरी तरह तैयार हैं। क्या आपके दूतावास या विश्वविद्यालय के लिए कोई विशिष्ट भाषा आवश्यकता है?",
    cta: "नई भाषा का अनुरोध करें या सुविधाएँ देखें →"
  },
  fil: {
    badge: "Pandaigdigang Saklaw ng Wika",
    title: "Mga paliwanag sa iyong sariling wika",
    subtitle: "Likas na boses ng AI at gabay sa form sa 11 wika sa Asya-Pasipiko ngayon, kasama ang mga wika sa Europa at Gitnang Silangan na aktibong inilulunsad.",
    pause: "I-pause",
    play: "Ipagpatuloy",
    explore: "Tingnan ang Mga Detalye ng Wika",
    note: "✓ Ganap na handa ang 11 wika sa Asya-Pasipiko. Mayroon ka bang partikular na kinakailangang wika para sa iyong embahada o unibersidad?",
    cta: "Humiling ng Wika o Suriin ang Mga Tampok →"
  }
};
