import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Badge } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, Search, FileText, Globe, Plane, GraduationCap, Building2, HelpCircle } from 'lucide-react'

export const HelpPage: React.FC = () => {
  const { currentLang } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')

  const strings: Record<string, {
    back: string
    badge: string
    title: string
    subtitle: string
    searchPlaceholder: string
    popularTitle: string
    readGuide: string
    sampleBadge: string
    guide1Title: string
    guide1Cat: string
    guide1Desc: string
    guide2Title: string
    guide2Cat: string
    guide2Desc: string
    guide3Title: string
    guide3Cat: string
    guide3Desc: string
  }> = {
    en: {
      back: "Back to Home",
      badge: "Help Center · Situational Field Guides",
      title: "Official Form Guides & Real Scenarios",
      subtitle: "Step-by-step guidance tailored for real-world public service, visa, and scholarship paperwork.",
      searchPlaceholder: "Search guides: Schengen, DS-160, LPDP, Tax ID, National Identity...",
      popularTitle: "Popular Official Guides",
      readGuide: "Read Guide",
      sampleBadge: "Complete & Verified Examples",
      guide1Title: "Schengen European Visa Application 2026",
      guide1Cat: "Visa & Immigration",
      guide1Desc: "Dissecting all 37 European visa fields: Sponsor vs Financial Guarantee differences, valid arrival dates, and proper passport formatting.",
      guide2Title: "Global Scholarship Application (LPDP & Chevening)",
      guide2Cat: "Scholarships & Study",
      guide2Desc: "Prevent administrative disqualification: Unconditional LoA formatting, commitment essay proofing, and official language certificate audits.",
      guide3Title: "National Civil Service & Government Portal (SSCASN)",
      guide3Cat: "E-Government",
      guide3Desc: "Ensure electronic stamps (e-Meterai) are readable, names match legal diploma without titles, and PDF uploads meet strict size quotas."
    },
    id: {
      back: "Kembali ke Beranda",
      badge: "Pusat Bantuan · Panduan Skenario Nyata",
      title: "Pusat Panduan & Skenario Pengisian Formulir",
      subtitle: "Temukan panduan langkah demi langkah berdasarkan jenis dokumen resmi nyata yang sedang Anda hadapi.",
      searchPlaceholder: "Cari panduan: Schengen, DS-160, LPDP, NIK, e-Meterai...",
      popularTitle: "Panduan Populer",
      readGuide: "Baca Panduan",
      sampleBadge: "Lengkap & Contoh Isian",
      guide1Title: "Panduan Formulir Visa Schengen 2026",
      guide1Cat: "Visa & Imigrasi",
      guide1Desc: "Bedah 37 kolom aplikasi visa Eropa: perbedaan Sponsor vs Financial Guarantee, tanggal masuk, dan format paspor yang sah.",
      guide2Title: "Panduan Aplikasi Beasiswa LPDP & Chevening",
      guide2Cat: "Beasiswa Global",
      guide2Desc: "Menghindari diskualifikasi administrasi: format LoA, penulisan esai komitmen kembali ke tanah air, dan verifikasi sertifikat bahasa.",
      guide3Title: "Panduan Seleksi SSCASN CPNS / PPPK RI",
      guide3Cat: "Layanan Pemerintah",
      guide3Desc: "Memastikan e-Meterai terbaca sempurna, nama sesuai Ijazah tanpa gelar, dan unggah dokumen PDF di bawah batas kuota ukuran."
    },
    ja: {
      back: "ホームに戻る",
      badge: "ヘルプセンター · シナリオ別申請ガイド",
      title: "公的申請フォーム解説＆実践シナリオ",
      subtitle: "直面している公的書類やビザ申請に合わせた、分かりやすいステップバイステップガイド。",
      searchPlaceholder: "ガイドを検索：シェンゲンビザ、DS-160、奨学金、マイナンバー、身元証明...",
      popularTitle: "人気の申請ガイド",
      readGuide: "ガイドを読む",
      sampleBadge: "記入例・解説付き",
      guide1Title: "シェンゲン欧州ビザ申請 2026 徹底解説",
      guide1Cat: "ビザ＆出入国管理",
      guide1Desc: "全37項目の申請欄を網羅：身元引受人・財政証明の違い、入国日、旅券番号の有効な書式。",
      guide2Title: "海外留学・国際奨学金申請ガイド",
      guide2Cat: "奨学金＆留学",
      guide2Desc: "書類選考落ちを完全回避：合格通知書（LoA）の提出書式、志望動機書、語学証明書の監査。",
      guide3Title: "公務員採用・政府オンライン手続きガイド",
      guide3Cat: "電子政府ポータル",
      guide3Desc: "電子印紙の正確な読み取り、学位抜きでの氏名一致確認、PDF容量制限の遵守テクニック。"
    },
    ko: {
      back: "홈으로 돌아가기",
      badge: "도움말 센터 · 실제 서식별 가이드",
      title: "공공 서식 작성 가이드 및 실전 시나리오",
      subtitle: "실제 마주하게 되는 비자, 장학금, 공공 행정 서식에 맞춘 단계별 상세 안내입니다.",
      searchPlaceholder: "가이드 검색: 솅겐 비자, 미국 DS-160, 정부 장학금, 주민등록, 여권...",
      popularTitle: "인기 공공 서식 가이드",
      readGuide: "가이드 보기",
      sampleBadge: "상세 예시 및 작성 팁",
      guide1Title: "2026 솅겐 유럽 비자 신청서 완벽 정복",
      guide1Cat: "비자 및 이민",
      guide1Desc: "유럽 비자 37개 필수 항목 분석: 재정보증인 기입법, 체류 기간 계산, 여권 서식 요건.",
      guide2Title: "글로벌 석·박사 정부 장학금 지원 가이드",
      guide2Cat: "해외 장학금",
      guide2Desc: "서류 탈락 방지 노하우: 무조건부 입학허가서(LoA) 검증, 학업계획서 및 공인 어학 성적표 제출 요령.",
      guide3Title: "국가 공공 행정 포털 및 민원 신청 가이드",
      guide3Cat: "전자정부 서비스",
      guide3Desc: "전자 수입인지 규격 확인, 학위 표기 없는 정식 성명 일치 확인, PDF 첨부 규격 검증."
    },
    zh: {
      back: "返回首页",
      badge: "帮助中心 · 官方实战指南",
      title: "官方表单填报指南与真实场景解析",
      subtitle: "为您正在办理的签证、奖学金及政务文件提供大白话、保姆级步骤指导。",
      searchPlaceholder: "搜索指南：申根签证、美签 DS-160、政府奖学金、电子印花、身份证...",
      popularTitle: "热门官方指南",
      readGuide: "查阅指南",
      sampleBadge: "完整样例与填表技巧",
      guide1Title: "2026 申根欧洲签证申请全流程详解",
      guide1Cat: "签证与移民",
      guide1Desc: "逐项拆解 37 个申请栏位：担保人与资金保障区别、入境日期推算及护照标准格式要求。",
      guide2Title: "国家公派及国际公认奖学金申请指南",
      guide2Cat: "全球奖学金",
      guide2Desc: "避免初审材料被拒：无条件录取信 (LoA) 格式规范、回国志愿文书写作要领与语言认证核查。",
      guide3Title: "国家公共政务及公务员录用系统填报指南",
      guide3Cat: "政府电子政务",
      guide3Desc: "确保电子印章清晰可读、姓名与学历证书一致（不带头衔）、以及 PDF 文件严控体积标准。"
    },
    'zh-TW': {
      back: "返回首頁",
      badge: "說明中心 · 官方實戰指南",
      title: "官方表單填報指南與真實場景解析",
      subtitle: "為您正在辦理的簽證、獎學金及政務文件提供大白話、保姆級步驟指導。",
      searchPlaceholder: "搜尋指南：申根簽證、美簽 DS-160、政府獎學金、電子印花、身分證...",
      popularTitle: "熱門官方指南",
      readGuide: "查閱指南",
      sampleBadge: "完整範例與填表技巧",
      guide1Title: "2026 申根歐洲簽證申請全流程詳解",
      guide1Cat: "簽證與移民",
      guide1Desc: "逐項拆解 37 個申請欄位：擔保人與資金保障區別、入境日期推算及護照標準格式要求。",
      guide2Title: "國家公派及國際公認獎學金申請指南",
      guide2Cat: "全球獎學金",
      guide2Desc: "避免初審材料被拒：無條件錄取信 (LoA) 格式規範、返國志願文書寫作要領與語言認證核查。",
      guide3Title: "國家公共政務及公務員錄用系統填報指南",
      guide3Cat: "政府電子政務",
      guide3Desc: "確保電子印章清晰可讀、姓名與學歷證書一致（不帶頭銜）、以及 PDF 文件嚴控檔案大小標準。"
    },
    vi: {
      back: "Quay lại Trang chủ",
      badge: "Trung tâm Hỗ trợ · Hướng dẫn Thực tế",
      title: "Hướng Dẫn Điền Biểu Mẫu & Tình Huống Thực Tế",
      subtitle: "Hướng dẫn từng bước phù hợp với các thủ tục hành chính, thị thực và học bổng thực tế.",
      searchPlaceholder: "Tìm kiếm: Visa Schengen, DS-160, Học bổng chính phủ, CCCD, Hộ chiếu...",
      popularTitle: "Hướng Dẫn Phổ Biến",
      readGuide: "Đọc Hướng Dẫn",
      sampleBadge: "Ví dụ Hoàn Chỉnh & Xác Minh",
      guide1Title: "Hướng Dẫn Xin Thị Thực Châu Âu Schengen 2026",
      guide1Cat: "Thị thực & Xuất nhập cảnh",
      guide1Desc: "Bóc tách 37 trường thông tin: phân biệt Người bảo lãnh vs Bảo lãnh tài chính, ngày nhập cảnh và định dạng hộ chiếu chuẩn.",
      guide2Title: "Hồ Sơ Xin Học Bổng Quốc Tế & Chính Phủ",
      guide2Cat: "Học bổng & Du học",
      guide2Desc: "Tránh bị loại hồ sơ: định dạng thư nhập học không điều kiện (LoA), bài luận cam kết và chứng chỉ ngoại ngữ.",
      guide3Title: "Thủ Tục Cổng Dịch Vụ Công Quốc Gia",
      guide3Cat: "Dịch vụ công trực tuyến",
      guide3Desc: "Đảm bảo chữ ký số hợp lệ, tên khớp với văn bằng chính thức không kèm học hàm và kiểm soát dung lượng tệp PDF."
    },
    th: {
      back: "กลับสู่หน้าแรก",
      badge: "ศูนย์ช่วยเหลือ · คู่มือสถานการณ์จริง",
      title: "ศูนย์รวมคู่มือการกรอกแบบฟอร์มทางการ",
      subtitle: "คำแนะนำทีละขั้นตอนสำหรับงานเอกสารราชการ วีซ่า และทุนการศึกษาจริง",
      searchPlaceholder: "ค้นหาคู่มือ: เชงเก้น, DS-160, ทุนการศึกษา, บัตรประชาชน, พาสปอร์ต...",
      popularTitle: "คู่มือยอดนิยม",
      readGuide: "อ่านคู่มือ",
      sampleBadge: "ตัวอย่างครบถ้วนและผ่านการตรวจสอบ",
      guide1Title: "คู่มือการขอวีซ่ายุโรปเชงเก้น 2026",
      guide1Cat: "วีซ่าและการตรวจคนเข้าเมือง",
      guide1Desc: "วิเคราะห์ครบทั้ง 37 ช่อง: ข้อแตกต่างระหว่างผู้สนับสนุนกับการรับรองทางการเงิน วันที่เดินทาง และรูปแบบหนังสือเดินทางที่ถูกต้อง",
      guide2Title: "คู่มือการสมัครทุนการศึกษาระดับโลก",
      guide2Cat: "ทุนการศึกษาและการเรียนต่อ",
      guide2Desc: "ป้องกันการถูกตัดสิทธิ์: รูปแบบหนังสือตอบรับแบบไม่มีเงื่อนไข (LoA) เรียงความพันธสัญญา และการตรวจสอบใบรับรองภาษา",
      guide3Title: "คู่มือการสมัครงานราชการและพอร์ทัลรัฐบาล",
      guide3Cat: "บริการรัฐบาลอิเล็กทรอนิกส์",
      guide3Desc: "ตรวจสอบตราประทับอิเล็กทรอนิกส์ ชื่อตรงตามวุฒิการศึกษา และการอัปโหลดไฟล์ PDF ตามขนาดที่กำหนด"
    },
    hi: {
      back: "होम पर वापस जाएं",
      badge: "सहायता केंद्र · व्यावहारिक मार्गदर्शिका",
      title: "आधिकारिक फॉर्म गाइड और वास्तविक परिदृश्य",
      subtitle: "वास्तविक सार्वजनिक सेवा, वीज़ा और छात्रवृत्ति कागजी कार्रवाई के लिए चरण-दर-चरण मार्गदर्शन।",
      searchPlaceholder: "खोजें: शेंगेन वीजा, DS-160, छात्रवृत्ति, पहचान पत्र, पासपोर्ट...",
      popularTitle: "लोकप्रिय आधिकारिक गाइड",
      readGuide: "गाइड पढ़ें",
      sampleBadge: "सत्यापित उदाहरण सहित",
      guide1Title: "शेंगेन यूरोपीय वीज़ा आवेदन गाइड 2026",
      guide1Cat: "वीज़ा और आप्रवासन",
      guide1Desc: "यूरोपीय वीज़ा के सभी 37 फ़ील्ड्स का विश्लेषण: प्रायोजक बनाम वित्तीय गारंटी में अंतर और वैध पासपोर्ट प्रारूप।",
      guide2Title: "वैश्विक छात्रवृत्ति आवेदन गाइड",
      guide2Cat: "छात्रवृत्ति और अध्ययन",
      guide2Desc: "दस्तावेज़ खारिज होने से बचाएं: बिना शर्त प्रवेश पत्र (LoA) प्रारूप और भाषा प्रमाण पत्र ऑडिट।",
      guide3Title: "राष्ट्रीय लोक सेवा और सरकारी पोर्टल गाइड",
      guide3Cat: "ई-सरकार सेवाएं",
      guide3Desc: "ई-मुद्रांक की पठनीयता, बिना डिग्री उपाधि के कानूनी नाम का मिलान और पीडीएफ आकार सीमा की पुष्टि।"
    },
    fil: {
      back: "Bumalik sa Home",
      badge: "Help Center · Gabay sa Tunay na Sitwasyon",
      title: "Opisyal na Gabay sa Form at Sitwasyon",
      subtitle: "Hakbang-hakbang na gabay para sa visa, scholarship, at mga opisyal na form ng gobyerno.",
      searchPlaceholder: "Maghanap ng gabay: Schengen, DS-160, Scholarship, ID, Pasaporte...",
      popularTitle: "Mga Patok na Gabay",
      readGuide: "Basahin ang Gabay",
      sampleBadge: "Kumpleto at may Halimbawa",
      guide1Title: "Gabay sa Schengen European Visa 2026",
      guide1Cat: "Visa at Imigrasyon",
      guide1Desc: "Pagsusuri sa 37 field ng European visa: pagkakaiba ng Sponsor at Financial Guarantee, at tamang format ng pasaporte.",
      guide2Title: "Gabay sa Aplikasyon ng Global Scholarship",
      guide2Cat: "Scholarship at Pag-aaral",
      guide2Desc: "Iwasan ang diskuwalipikasyon sa dokumento: tamang format ng LoA, essay ng kompromiso, at pagsusuri ng language certificate.",
      guide3Title: "Gabay sa Serbisyo Publiko at Portal ng Gobyerno",
      guide3Cat: "E-Government",
      guide3Desc: "Siguruhing nababasa ang e-stamp, tumutugma ang pangalan nang walang titulo, at pasok ang laki ng PDF."
    },
    ms: {
      back: "Kembali ke Laman Utama",
      badge: "Pusat Bantuan · Panduan Situasi Nyata",
      title: "Pusat Panduan & Senario Pengisian Borang",
      subtitle: "Panduan langkah demi langkah berdasarkan dokumen rasmi sebenar yang sedang anda hadapi.",
      searchPlaceholder: "Cari panduan: Schengen, DS-160, Biasiswa, MyKad, Pasport...",
      popularTitle: "Panduan Rasmi Popular",
      readGuide: "Baca Panduan",
      sampleBadge: "Lengkap & Contoh Isian",
      guide1Title: "Panduan Permohonan Visa Eropah Schengen 2026",
      guide1Cat: "Visa & Imigresen",
      guide1Desc: "Bedah 37 medan visa Eropah: perbezaan Penaja vs Jaminan Kewangan, tarikh ketibaan dan format pasport yang sah.",
      guide2Title: "Panduan Permohonan Biasiswa Global & Antarabangsa",
      guide2Cat: "Biasiswa & Pengajian",
      guide2Desc: "Elakkan hilang kelayakan: format LoA tanpa syarat, esei komitmen pulang ke tanah air dan audit sijil bahasa.",
      guide3Title: "Panduan Portal Perkhidmatan Awam Kerajaan",
      guide3Cat: "Perkhidmatan E-Kerajaan",
      guide3Desc: "Memastikan setem elektronik terbaca sempurna, nama sepadan ijazah tanpa gelaran dan muat naik PDF di bawah had saiz."
    }
  }

  const s = strings[currentLang] || strings.en

  const guides = [
    {
      title: s.guide1Title,
      category: s.guide1Cat,
      icon: Plane,
      desc: s.guide1Desc
    },
    {
      title: s.guide2Title,
      category: s.guide2Cat,
      icon: GraduationCap,
      desc: s.guide2Desc
    },
    {
      title: s.guide3Title,
      category: s.guide3Cat,
      icon: Building2,
      desc: s.guide3Desc
    }
  ]

  const filteredGuides = guides.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>{s.back}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="blue">{s.badge}</Badge>
          </div>
        </div>
      </header>

      {/* Hero & Search */}
      <div className="bg-white border-b border-slate-200 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {s.title}
          </h1>
          <p className="mt-3 text-slate-600 text-base max-w-2xl mx-auto">
            {s.subtitle}
          </p>

          {/* Search Box */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={s.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Field Guides Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <h2 className="text-xl font-bold text-slate-900 mb-6">{s.popularTitle}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGuides.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card key={idx} hoverGlow className="p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wide uppercase text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2.5">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{s.sampleBadge}</span>
                  <Button size="sm" variant="outline" className="text-xs font-semibold">
                    {s.readGuide}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}

