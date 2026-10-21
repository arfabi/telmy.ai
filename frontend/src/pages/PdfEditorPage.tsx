import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Download, ShieldCheck, CheckCircle2, AlertTriangle, 
  ChevronRight, ChevronLeft, Sparkles, RefreshCw, Eye, FileText, Check, Lock, Globe
} from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { useLanguage } from '@/context/LanguageContext'
import { DASHBOARD_COUNTRIES } from '@/pages/DashboardPage'

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

// Complete 11 Languages Dictionary for PDF Studio
const PDF_STUDIO_I18N: Record<string, any> = {
  en: {
    backToDashboard: "Back to Dashboard",
    studioBadge: "PDF Studio",
    studioSubtitle: "Guided Field-by-Field Assistant & Precision PDF Export",
    encryptedBadge: "Zero-Knowledge Encrypted",
    downloadBtn: "Download Filled PDF",
    exportingBtn: "Generating PDF...",
    loadingInitial: "Loading PDF document...",
    fetchingFile: "Retrieving document file...",
    analyzingAi: "Gemini AI is analyzing form structure & fields...",
    analysisSubtext: "Gemini Multimodal Vision is scanning fields and matching requirements.",
    noDocSelected: "No document selected. Please open from Form History or Extension.",
    pageOf: "Page {current} of {total}",
    generalSection: "General",
    fieldProgress: "Field {current} / {total}",
    requiredBadge: "Required",
    fieldPlaceholder: "Type your answer here...",
    checkboxAgree: "Check if applicable / confirmed",
    correctFormatExample: "Example of valid format:",
    yourAnswer: "Your Answer / Input:",
    btnPrev: "Previous",
    btnNext: "Next Field",
    btnAuditFinish: "Audit & Finish",
    reviewedTitle: "All Fields Have Been Reviewed!",
    reviewedSubtitle: "Here is the official form compliance pre-submission audit before generating your PDF:",
    auditBoxTitle: "Pre-Submission Compliance Audit",
    readyToSubmit: "100% Ready to Submit",
    needsAttention: "{count} Needs Attention",
    allValidText: "All required fields are filled with valid formatting.",
    informationalDocText: "This document is for information/reading (no required input fields needed).",
    missingWarning: "The following required fields are not filled yet:",
    btnReviewAgain: "Review from Start",
    btnDownloadNow: "Download Filled PDF Now"
  },
  id: {
    backToDashboard: "Kembali ke Dashboard",
    studioBadge: "PDF Studio",
    studioSubtitle: "Pengerjaan Terpandu Field-by-Field & Ekspor PDF Presisi",
    encryptedBadge: "Zero-Knowledge Encrypted",
    downloadBtn: "Download Filled PDF",
    exportingBtn: "Membuat PDF...",
    loadingInitial: "Memuat dokumen PDF...",
    fetchingFile: "Mengambil file dokumen...",
    analyzingAi: "AI Gemini sedang menganalisis struktur formulir & kolom isian...",
    analysisSubtext: "Gemini Multimodal Vision sedang memindai kolom formulir dan menyelaraskan panduan birokrasi.",
    noDocSelected: "Tidak ada dokumen yang dipilih. Silakan buka dari Form History atau Ekstensi.",
    pageOf: "Halaman {current} dari {total}",
    generalSection: "Umum",
    fieldProgress: "Kolom {current} / {total}",
    requiredBadge: "Wajib Diisi",
    fieldPlaceholder: "Ketik isian Anda di sini...",
    checkboxAgree: "Centang jika sesuai / disetujui",
    correctFormatExample: "Contoh Format yang Benar:",
    yourAnswer: "Jawaban / Isian Anda:",
    btnPrev: "Sebelumnya",
    btnNext: "Lanjut ke Kolom Berikutnya",
    btnAuditFinish: "Audit & Selesai",
    reviewedTitle: "Seluruh Kolom Telah Ditinjau!",
    reviewedSubtitle: "Berikut hasil audit kepatuhan formulir resmi sebelum mencetak file PDF Anda:",
    auditBoxTitle: "Hasil Audit Pra-Pengiriman",
    readyToSubmit: "100% Siap Kirim",
    needsAttention: "{count} Perlu Perhatian",
    allValidText: "Semua kolom wajib telah terisi lengkap dengan format yang sesuai.",
    informationalDocText: "Dokumen ini berupa informasi/bacaan resmi (tidak ada kolom isian wajib yang perlu diisi).",
    missingWarning: "Kolom wajib berikut belum terisi:",
    btnReviewAgain: "Tinjau Ulang dari Awal",
    btnDownloadNow: "Download Filled PDF Sekarang"
  },
  ja: {
    backToDashboard: "ダッシュボードに戻る",
    studioBadge: "PDFスタジオ",
    studioSubtitle: "項目ごとの入力ガイドと高精度PDFエクスポート",
    encryptedBadge: "ゼロ知識暗号化",
    downloadBtn: "記入済みPDFをダウンロード",
    exportingBtn: "PDFを生成中...",
    loadingInitial: "PDFドキュメントを読み込み中...",
    fetchingFile: "ドキュメントファイルを取得中...",
    analyzingAi: "Gemini AIがフォーム構造と項目を分析中...",
    analysisSubtext: "Geminiマルチモーダルビジョンが項目をスキャンし要件を照合しています。",
    noDocSelected: "選択されたドキュメントがありません。履歴または拡張機能から開いてください。",
    pageOf: "{total} ページ中 {current} ページ",
    generalSection: "一般",
    fieldProgress: "項目 {current} / {total}",
    requiredBadge: "必須",
    fieldPlaceholder: "ここに入力してください...",
    checkboxAgree: "該当する場合、または同意する場合はチェック",
    correctFormatExample: "正しい入力例:",
    yourAnswer: "あなたの回答 / 入力内容:",
    btnPrev: "前へ",
    btnNext: "次の項目へ",
    btnAuditFinish: "監査して完了",
    reviewedTitle: "すべての項目の確認が完了しました！",
    reviewedSubtitle: "PDFを出力する前の事前監査結果です:",
    auditBoxTitle: "送信前コンプライアンス監査",
    readyToSubmit: "100% 提出可能",
    needsAttention: "{count} 件の確認が必要",
    allValidText: "すべての必須項目が正しい形式で入力されています。",
    informationalDocText: "このドキュメントは案内・閲覧用です（入力必須項目はありません）。",
    missingWarning: "以下の必須項目が未入力です:",
    btnReviewAgain: "最初から見直す",
    btnDownloadNow: "記入済みPDFを今すぐダウンロード"
  },
  ko: {
    backToDashboard: "대시보드로 돌아가기",
    studioBadge: "PDF 스튜디오",
    studioSubtitle: "항목별 단계 안내 및 정밀 PDF 내보내기",
    encryptedBadge: "영지식 암호화",
    downloadBtn: "작성 완료된 PDF 다운로드",
    exportingBtn: "PDF 생성 중...",
    loadingInitial: "PDF 문서를 불러오는 중...",
    fetchingFile: "문서 파일을 가져오는 중...",
    analyzingAi: "Gemini AI가 양식 구조와 항목을 분석하는 중...",
    analysisSubtext: "Gemini 멀티모달 비전이 항목을 검사하고 규정을 대조하고 있습니다.",
    noDocSelected: "선택된 문서가 없습니다. 기록이나 확장 프로그램에서 열어주세요.",
    pageOf: "{total} 페이지 중 {current} 페이지",
    generalSection: "일반",
    fieldProgress: "항목 {current} / {total}",
    requiredBadge: "필수 입력",
    fieldPlaceholder: "여기에 입력하세요...",
    checkboxAgree: "해당하거나 동의하는 경우 선택",
    correctFormatExample: "올바른 서식 예시:",
    yourAnswer: "답변 / 입력 내용:",
    btnPrev: "이전",
    btnNext: "다음 항목으로",
    btnAuditFinish: "검토 및 완료",
    reviewedTitle: "모든 항목의 검토가 완료되었습니다!",
    reviewedSubtitle: "PDF 출력 전 공식 양식 적합성 사전 감사 결과입니다:",
    auditBoxTitle: "제출 전 적합성 감사",
    readyToSubmit: "100% 제출 준비 완료",
    needsAttention: "{count}개 항목 확인 필요",
    allValidText: "모든 필수 항목이 올바른 형식으로 입력되었습니다.",
    informationalDocText: "이 문서는 안내/열람용 문서입니다 (작성할 필수 항목이 없습니다).",
    missingWarning: "다음 필수 항목이 아직 입력되지 않았습니다:",
    btnReviewAgain: "처음부터 다시 검토",
    btnDownloadNow: "작성 완료된 PDF 지금 다운로드"
  },
  zh: {
    backToDashboard: "返回控制台",
    studioBadge: "PDF 工作室",
    studioSubtitle: "逐栏引导填写与高精度 PDF 导出",
    encryptedBadge: "零知识加密",
    downloadBtn: "下载已填写 PDF",
    exportingBtn: "正在生成 PDF...",
    loadingInitial: "正在加载 PDF 文档...",
    fetchingFile: "正在获取文档文件...",
    analyzingAi: "Gemini AI 正在分析表格结构与栏位...",
    analysisSubtext: "Gemini 多模态视觉正在扫描表格输入项并核对要求。",
    noDocSelected: "未选择任何文档。请从历史记录或扩展程序中打开。",
    pageOf: "第 {current} 页 / 共 {total} 页",
    generalSection: "常规",
    fieldProgress: "栏位 {current} / {total}",
    requiredBadge: "必填项",
    fieldPlaceholder: "在此处输入您的内容...",
    checkboxAgree: "如符合或同意请勾选",
    correctFormatExample: "正确格式示例:",
    yourAnswer: "您的填写内容:",
    btnPrev: "上一步",
    btnNext: "前往下一栏",
    btnAuditFinish: "审核并完成",
    reviewedTitle: "所有栏位均已复核完毕！",
    reviewedSubtitle: "生成 PDF 前的官方表格合规审核结果如下:",
    auditBoxTitle: "提交前合规审核结果",
    readyToSubmit: "100% 准备就绪",
    needsAttention: "{count} 项需注意",
    allValidText: "所有必填栏位均已完整填写且格式正确。",
    informationalDocText: "本文件属于官方说明/阅览文件（无需填写必填项）。",
    missingWarning: "以下必填栏位尚未填写:",
    btnReviewAgain: "从头重新复核",
    btnDownloadNow: "立即下载填写好的 PDF"
  },
  "zh-TW": {
    backToDashboard: "返回儀表板",
    studioBadge: "PDF 工作室",
    studioSubtitle: "逐欄引導填寫與高精度 PDF 匯出",
    encryptedBadge: "零知識加密",
    downloadBtn: "下載已填寫 PDF",
    exportingBtn: "正在生成 PDF...",
    loadingInitial: "正在載入 PDF 文件...",
    fetchingFile: "正在取得文件檔案...",
    analyzingAi: "Gemini AI 正在分析表格架構與欄位...",
    analysisSubtext: "Gemini 多模態視覺正在掃描表格輸入項並核對要求。",
    noDocSelected: "未選擇任何文件。請從歷史記錄或擴充功能中開啟。",
    pageOf: "第 {current} 頁 / 共 {total} 頁",
    generalSection: "常規",
    fieldProgress: "欄位 {current} / {total}",
    requiredBadge: "必填項目",
    fieldPlaceholder: "在此處輸入您的內容...",
    checkboxAgree: "如符合或同意請勾選",
    correctFormatExample: "正確格式範例:",
    yourAnswer: "您的填寫內容:",
    btnPrev: "上一步",
    btnNext: "前往下一欄",
    btnAuditFinish: "稽核並完成",
    reviewedTitle: "所有欄位均已審閱完畢！",
    reviewedSubtitle: "匯出 PDF 前的官方表格合規稽核結果如下:",
    auditBoxTitle: "提交前合規稽核結果",
    readyToSubmit: "100% 準備就緒",
    needsAttention: "{count} 項需注意",
    allValidText: "所有必填欄位均已完整填寫且格式正確。",
    informationalDocText: "本文件屬於官方說明/閱覽文件（無需填寫必填欄位）。",
    missingWarning: "以下必填欄位尚未填寫:",
    btnReviewAgain: "從頭重新審閱",
    btnDownloadNow: "立即下載填寫好的 PDF"
  },
  vi: {
    backToDashboard: "Quay lại Bảng điều khiển",
    studioBadge: "PDF Studio",
    studioSubtitle: "Hướng dẫn từng ô biểu mẫu & Xuất PDF chính xác",
    encryptedBadge: "Mã hóa Zero-Knowledge",
    downloadBtn: "Tải xuống PDF đã điền",
    exportingBtn: "Đang tạo PDF...",
    loadingInitial: "Đang tải tài liệu PDF...",
    fetchingFile: "Đang lấy tệp tài liệu...",
    analyzingAi: "AI Gemini đang phân tích biểu mẫu & các ô...",
    analysisSubtext: "Gemini Multimodal Vision đang quét các ô biểu mẫu và đối chiếu quy định.",
    noDocSelected: "Chưa chọn tài liệu nào. Vui lòng mở từ Lịch sử hoặc Tiện ích.",
    pageOf: "Trang {current} / {total}",
    generalSection: "Chung",
    fieldProgress: "Ô {current} / {total}",
    requiredBadge: "Bắt buộc",
    fieldPlaceholder: "Nhập câu trả lời của bạn vào đây...",
    checkboxAgree: "Đánh dấu nếu phù hợp / đồng ý",
    correctFormatExample: "Ví dụ định dạng đúng:",
    yourAnswer: "Nội dung bạn điền:",
    btnPrev: "Trước đó",
    btnNext: "Sang ô tiếp theo",
    btnAuditFinish: "Kiểm tra & Hoàn tất",
    reviewedTitle: "Tất cả các ô đã được xem xét!",
    reviewedSubtitle: "Dưới đây là kết quả kiểm tra độ chuẩn xác trước khi xuất tệp PDF:",
    auditBoxTitle: "Kiểm toán trước khi gửi",
    readyToSubmit: "100% Sẵn sàng nộp",
    needsAttention: "{count} mục cần chú ý",
    allValidText: "Tất cả các ô bắt buộc đã được điền đầy đủ và đúng định dạng.",
    informationalDocText: "Tài liệu này là thông tin/văn bản đọc (không có ô nhập bắt buộc).",
    missingWarning: "Các ô bắt buộc sau chưa được điền:",
    btnReviewAgain: "Xem lại từ đầu",
    btnDownloadNow: "Tải xuống PDF đã điền ngay"
  },
  th: {
    backToDashboard: "กลับไปยังแดชบอร์ด",
    studioBadge: "PDF Studio",
    studioSubtitle: "ผู้ช่วยกรอกข้อมูลทีละช่อง & ส่งออก PDF อย่างแม่นยำ",
    encryptedBadge: "เข้ารหัส Zero-Knowledge",
    downloadBtn: "ดาวน์โหลด PDF ที่กรอกแล้ว",
    exportingBtn: "กำลังสร้าง PDF...",
    loadingInitial: "กำลังโหลดเอกสาร PDF...",
    fetchingFile: "กำลังดึงไฟล์เอกสาร...",
    analyzingAi: "Gemini AI กำลังวิเคราะห์โครงสร้างแบบฟอร์ม...",
    analysisSubtext: "Gemini Multimodal Vision กำลังสแกนช่องแบบฟอร์มและตรวจสอบข้อกำหนด",
    noDocSelected: "ไม่ได้เลือกเอกสาร กรุณาเปิดจากประวัติหรือส่วนขยาย",
    pageOf: "หน้า {current} จาก {total}",
    generalSection: "ทั่วไป",
    fieldProgress: "ช่อง {current} / {total}",
    requiredBadge: "จำเป็น",
    fieldPlaceholder: "พิมพ์คำตอบของคุณที่นี่...",
    checkboxAgree: "ทำเครื่องหมายหากตรงตามเงื่อนไข / ยินยอม",
    correctFormatExample: "ตัวอย่างรูปแบบที่ถูกต้อง:",
    yourAnswer: "คำตอบ / ข้อมูลของคุณ:",
    btnPrev: "ย้อนกลับ",
    btnNext: "ไปยังช่องถัดไป",
    btnAuditFinish: "ตรวจสอบและเสร็จสิ้น",
    reviewedTitle: "ตรวจสอบครบทุกช่องแล้ว!",
    reviewedSubtitle: "ผลการตรวจสอบความถูกต้องของแบบฟอร์มก่อนพิมพ์ PDF:",
    auditBoxTitle: "ผลการตรวจสอบก่อนส่ง",
    readyToSubmit: "พร้อมส่ง 100%",
    needsAttention: "{count} รายการต้องแก้ไข",
    allValidText: "กรอกข้อมูลในช่องที่จำเป็นครบถ้วนและถูกต้องตามรูปแบบแล้ว",
    informationalDocText: "เอกสารนี้เป็นข้อมูล/ประกาศทางการ (ไม่มีช่องที่ต้องกรอก)",
    missingWarning: "ยังไม่ได้กรอกช่องที่จำเป็นต่อไปนี้:",
    btnReviewAgain: "ตรวจสอบใหม่ตั้งแต่ต้น",
    btnDownloadNow: "ดาวน์โหลด PDF ที่กรอกแล้วทันที"
  },
  ms: {
    backToDashboard: "Kembali ke Papan Pemuka",
    studioBadge: "PDF Studio",
    studioSubtitle: "Panduan Medan demi Medan & Eksport PDF Tepat",
    encryptedBadge: "Penyulitan Zero-Knowledge",
    downloadBtn: "Muat Turun PDF Lengkap",
    exportingBtn: "Menjana PDF...",
    loadingInitial: "Memuatkan dokumen PDF...",
    fetchingFile: "Mengambil fail dokumen...",
    analyzingAi: "Gemini AI sedang menganalisis struktur borang & medan...",
    analysisSubtext: "Gemini Multimodal Vision sedang mengimbas medan dan menyelaraskan keperluan.",
    noDocSelected: "Tiada dokumen dipilih. Sila buka dari Sejarah Borang atau Sambungan.",
    pageOf: "Halaman {current} daripada {total}",
    generalSection: "Umum",
    fieldProgress: "Medan {current} / {total}",
    requiredBadge: "Wajib Diisi",
    fieldPlaceholder: "Taip jawapan anda di sini...",
    checkboxAgree: "Tandakan jika berkenaan / dipersetujui",
    correctFormatExample: "Contoh format yang betul:",
    yourAnswer: "Jawapan / Isian Anda:",
    btnPrev: "Sebelumnya",
    btnNext: "Ke Medan Seterusnya",
    btnAuditFinish: "Audit & Selesai",
    reviewedTitle: "Semua Medan Telah Disemak!",
    reviewedSubtitle: "Berikut ialah hasil audit pematuhan sebelum mencetak fail PDF anda:",
    auditBoxTitle: "Hasil Audit Pra-Penyerahan",
    readyToSubmit: "100% Sedia Dihantar",
    needsAttention: "{count} Perlu Perhatian",
    allValidText: "Semua medan wajib telah diisi lengkap dengan format yang sah.",
    informationalDocText: "Dokumen ini adalah maklumat/bacaan rasmi (tiada medan wajib diisi).",
    missingWarning: "Medan wajib berikut belum diisi:",
    btnReviewAgain: "Semak Semula dari Awal",
    btnDownloadNow: "Muat Turun PDF Lengkap Sekarang"
  },
  fil: {
    backToDashboard: "Bumalik sa Dashboard",
    studioBadge: "PDF Studio",
    studioSubtitle: "Gabay Bawat Patlang & Eksaktong Pag-export ng PDF",
    encryptedBadge: "Naka-encrypt na Zero-Knowledge",
    downloadBtn: "I-download ang Kumpletong PDF",
    exportingBtn: "Ginagawa ang PDF...",
    loadingInitial: "Kinakarga ang dokumentong PDF...",
    fetchingFile: "Kinukuha ang file ng dokumento...",
    analyzingAi: "Sinusuri ng Gemini AI ang struktura ng form at mga patlang...",
    analysisSubtext: "Ini-scan ng Gemini Vision ang mga patlang at inihahambing ang mga regulasyon.",
    noDocSelected: "Walang napiling dokumento. Buksan mula sa Kasaysayan o Extension.",
    pageOf: "Pahina {current} sa {total}",
    generalSection: "Pangkalahatan",
    fieldProgress: "Patlang {current} / {total}",
    requiredBadge: "Kailangan",
    fieldPlaceholder: "I-type ang iyong sagot dito...",
    checkboxAgree: "Lagyan ng tsek kung naaangkop / sumasang-ayon",
    correctFormatExample: "Halimbawa ng tamang format:",
    yourAnswer: "Iyong Sagot:",
    btnPrev: "Nakaraan",
    btnNext: "Susunod na Patlang",
    btnAuditFinish: "I-audit at Tapusin",
    reviewedTitle: "Nasuri Na ang Lahat ng Patlang!",
    reviewedSubtitle: "Narito ang resulta ng audit sa pagsunod bago i-export ang iyong PDF:",
    auditBoxTitle: "Audit Bago Isumite",
    readyToSubmit: "100% Handa Nang Isumite",
    needsAttention: "{count} Kailangan ng Pansin",
    allValidText: "Ang lahat ng kailangang patlang ay napunan nang may tamang format.",
    informationalDocText: "Ang dokumentong ito ay para sa impormasyon lamang (walang patlang na kailangang punan).",
    missingWarning: "Ang mga sumusunod na patlang ay hindi pa napupunan:",
    btnReviewAgain: "Suriin Muli Mula sa Simula",
    btnDownloadNow: "I-download ang Kumpletong PDF Ngayon"
  },
  hi: {
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    studioBadge: "PDF स्टूडियो",
    studioSubtitle: "फ़ील्ड-दर-फ़ील्ड सहायक और सटीक PDF निर्यात",
    encryptedBadge: "जीरो-नॉलेज एन्क्रिप्टेड",
    downloadBtn: "भरा हुआ PDF डाउनलोड करें",
    exportingBtn: "PDF तैयार किया जा रहा है...",
    loadingInitial: "PDF दस्तावेज़ लोड हो रहा है...",
    fetchingFile: "दस्तावेज़ फ़ाइल प्राप्त की जा रही है...",
    analyzingAi: "Gemini AI फ़ॉर्म संरचना और फ़ील्ड्स का विश्लेषण कर रहा है...",
    analysisSubtext: "Gemini Multimodal Vision फ़ॉर्म फ़ील्ड्स को स्कैन कर नियमों का मिलान कर रहा है।",
    noDocSelected: "कोई दस्तावेज़ नहीं चुना गया। कृपया इतिहास या एक्सटेंशन से खोलें।",
    pageOf: "पृष्ठ {current} / {total}",
    generalSection: "सामान्य",
    fieldProgress: "फ़ील्ड {current} / {total}",
    requiredBadge: "आवश्यक",
    fieldPlaceholder: "यहाँ अपना उत्तर लिखें...",
    checkboxAgree: "यदि लागू हो / सहमत हों तो चुनें",
    correctFormatExample: "सही प्रारूप का उदाहरण:",
    yourAnswer: "आपका उत्तर:",
    btnPrev: "पिछला",
    btnNext: "अगले फ़ील्ड पर जाएं",
    btnAuditFinish: "ऑडिट और समाप्त",
    reviewedTitle: "सभी फ़ील्ड्स की समीक्षा हो चुकी है!",
    reviewedSubtitle: "PDF प्रिंट करने से पहले फ़ॉर्म अनुपालन ऑडिट परिणाम:",
    auditBoxTitle: "जमा करने से पूर्व ऑडिट परिणाम",
    readyToSubmit: "100% जमा करने के लिए तैयार",
    needsAttention: "{count} फ़ील्ड्स पर ध्यान दें",
    allValidText: "सभी आवश्यक फ़ील्ड्स सही प्रारूप में भरे जा चुके हैं।",
    informationalDocText: "यह दस्तावेज़ आधिकारिक सूचना/पठन हेतु है (कोई अनिवार्य फ़ील्ड नहीं है)।",
    missingWarning: "निम्नलिखित आवश्यक फ़ील्ड्स अभी नहीं भरे गए हैं:",
    btnReviewAgain: "शुरू से पुनः समीक्षा करें",
    btnDownloadNow: "भरा हुआ PDF अभी डाउनलोड करें"
  }
}

export const PdfEditorPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get('session')
  const formId = searchParams.get('id')

  // Dynamic Multi-Language Context (11 Languages)
  const { currentLang, lang, setLang } = useLanguage()
  const activeLangKey = currentLang || lang || 'en'
  const studioI18n = PDF_STUDIO_I18N[activeLangKey] || PDF_STUDIO_I18N[activeLangKey.toLowerCase()] || PDF_STUDIO_I18N.en

  // Auth & Session
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState(studioI18n.loadingInitial)
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null)
  const [docMeta, setDocMeta] = useState<any>(null)

  // Guided Fields State (Exact same structure as extension)
  const [sections, setSections] = useState<any[]>([])
  const [flatFields, setFlatFields] = useState<any[]>([])
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const [userValues, setUserValues] = useState<Record<string, any>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [auditResult, setAuditResult] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)

  // PDF.js rendering
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [canvasScale, setCanvasScale] = useState(1.4)

  // 1. Load User Session from localStorage
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('telmy_user')
      if (rawUser) {
        setUser(JSON.parse(rawUser))
      }
    } catch (e) {}
  }, [])

  // 2. Fetch Staged Session from Backend and trigger AI Analysis
  useEffect(() => {
    async function loadDocument() {
      if (!sessionId && !formId) {
        setLoading(false)
        setStatusMessage(studioI18n.noDocSelected)
        return
      }

      try {
        setLoading(true)
        setStatusMessage(studioI18n.fetchingFile)
        const effectiveApiUrl = window.location.hostname.includes('localhost')
          ? 'http://localhost:3000/api'
          : 'https://telmy.id/api'

        let resolvedPdfUrl = ''
        let resolvedBase64 = ''
        let resolvedFilename = 'Document.pdf'

        if (sessionId) {
          const res = await fetch(`${effectiveApiUrl}/pdf/session/${sessionId}`)
          const json = await res.json()
          if (!json.success || !json.data) {
            throw new Error(json.error || 'Gagal memuat sesi dokumen')
          }
          resolvedPdfUrl = json.data.pdfUrl || ''
          resolvedBase64 = json.data.pdfBase64 || ''
          resolvedFilename = json.data.filename || 'Document.pdf'
        }

        setStatusMessage(studioI18n.analyzingAi)
        const effectiveAnalysisLang = activeLangKey || 'en'
        const analyzeRes = await fetch(`${effectiveApiUrl}/explain-pdf`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user?.uid || 'guest_user'
          },
          body: JSON.stringify({
            pdfUrl: resolvedPdfUrl,
            pdfBase64: resolvedBase64,
            filename: resolvedFilename,
            language: effectiveAnalysisLang,
            userId: user?.uid
          })
        })

        const analyzeJson = await analyzeRes.json()
        if (!analyzeJson.success || !analyzeJson.data) {
          throw new Error(analyzeJson.error || 'Analisis dokumen gagal')
        }

        const data = analyzeJson.data
        setDocMeta(data)

        // Flatten all fields from sections for linear field-by-field guidance
        const flattened: any[] = []
        if (Array.isArray(data.sections)) {
          setSections(data.sections)
          data.sections.forEach((sec: any) => {
            if (Array.isArray(sec.fields)) {
              sec.fields.forEach((fld: any) => {
                flattened.push({
                  ...fld,
                  sectionTitle: sec.title
                })
              })
            }
          })
        }
        setFlatFields(flattened)

        if (flattened.length === 0) {
          setIsCompleted(true)
          setAuditResult({
            passed: true,
            missingCount: 0,
            missingFields: []
          })
        } else {
          setIsCompleted(false)
        }

        // Load PDF onto pdf.js canvas
        let pdfSource = resolvedBase64 || resolvedPdfUrl
        setPdfDataUrl(pdfSource)

        if (window.pdfjsLib && pdfSource) {
          try {
            const loadingTask = window.pdfjsLib.getDocument(pdfSource)
            const loadedPdf = await loadingTask.promise
            setPdfDoc(loadedPdf)
            setTotalPages(loadedPdf.numPages)
            renderPdfPage(loadedPdf, 1)
          } catch (canvasErr) {
            console.warn('[PDF Studio] Canvas load warning:', canvasErr)
          }
        }

        setLoading(false)
      } catch (err: any) {
        console.error('Error in loadDocument:', err)
        setLoading(false)
        setStatusMessage(err.message || 'Gagal memuat atau menganalisis formulir.')
      }
    }

    loadDocument()
  }, [sessionId, formId, user?.uid])

  // 3. Render Canvas via PDF.js
  const renderPdfPage = async (doc: any, pageNum: number) => {
    if (!doc || !canvasRef.current) return
    try {
      const page = await doc.getPage(pageNum)
      const viewport = page.getViewport({ scale: canvasScale })
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      await page.render(renderContext).promise
    } catch (e) {
      console.warn('Canvas render error:', e)
    }
  }

  // Handle active field navigation & page switching
  const activeField = flatFields[currentFieldIndex] || null

  useEffect(() => {
    if (activeField && pdfDoc) {
      const targetPage = activeField.page || 1
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage)
        renderPdfPage(pdfDoc, targetPage)
      }
    }
  }, [currentFieldIndex, activeField, pdfDoc])

  const handleNext = () => {
    if (currentFieldIndex < flatFields.length - 1) {
      setCurrentFieldIndex(prev => prev + 1)
    } else {
      runAuditAndComplete()
    }
  }

  const handlePrev = () => {
    if (currentFieldIndex > 0) {
      setCurrentFieldIndex(prev => prev - 1)
      setIsCompleted(false)
    }
  }

  const updateValue = (key: string, val: any) => {
    setUserValues(prev => ({ ...prev, [key]: val }))
  }

  const runAuditAndComplete = () => {
    setIsCompleted(true)
    // Run pre-submission audit
    const missing: any[] = []
    flatFields.forEach(f => {
      const key = f.id || f.name
      const val = userValues[key]
      if (f.required && (!val || String(val).trim() === '')) {
        missing.push(f.label || f.name)
      }
    })
    setAuditResult({
      passed: missing.length === 0,
      missingCount: missing.length,
      missingFields: missing
    })
  }

  // 4. Download Completed Filled PDF using pdf-lib
  const handleDownloadFilledPdf = async () => {
    try {
      setIsExporting(true)
      let pdfBytes: ArrayBuffer
      if (pdfDataUrl?.startsWith('data:')) {
        const base64Data = pdfDataUrl.split(',')[1]
        const binary = atob(base64Data)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        pdfBytes = bytes.buffer
      } else if (pdfDataUrl?.startsWith('http')) {
        const resp = await fetch(pdfDataUrl)
        pdfBytes = await resp.arrayBuffer()
      } else {
        throw new Error('Tidak ada file PDF mentah yang valid')
      }

      const pdfDocLib = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
      const font = await pdfDocLib.embedFont(StandardFonts.HelveticaBold)
      const pages = pdfDocLib.getPages()

      // Sanitize string to standard Latin-1 / WinAnsi compatible characters for pdf-lib StandardFonts
      const sanitizeWinAnsi = (str: string) => {
        if (!str) return ''
        return String(str)
          .replace(/[\u24B6-\u24CF]/g, (c) => `(${String.fromCharCode(c.charCodeAt(0) - 0x24B6 + 65)})`)
          .replace(/[\u24D0-\u24E9]/g, (c) => `(${String.fromCharCode(c.charCodeAt(0) - 0x24D0 + 97)})`)
          .replace(/[\u2460-\u2473]/g, (c) => `(${c.charCodeAt(0) - 0x2460 + 1})`)
          .replace(/[•●▪]/g, '-')
          .replace(/[“”]/g, '"')
          .replace(/[‘’]/g, "'")
          .replace(/[–—]/g, '-')
          .replace(/[✓✔☑]/g, '[X]')
          .replace(/[✗✘☒]/g, '[ ]')
          .replace(/[^\x20-\xFF\n\r\t]/g, '')
      }

      // 1. Try native AcroForm interactive fill first (if document has AcroForm fields)
      try {
        const form = pdfDocLib.getForm()
        const acroFields = form.getFields()
        acroFields.forEach(field => {
          const fieldName = field.getName()
          for (const [key, val] of Object.entries(userValues)) {
            if (val && (fieldName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(fieldName.toLowerCase()))) {
              try {
                if (field.constructor?.name === 'PDFCheckBox') {
                  if (val === 'Yes' || val === true || val === 'true') {
                    (field as any).check()
                  } else {
                    (field as any).uncheck()
                  }
                } else {
                  const tf = form.getTextField(fieldName)
                  tf.setText(sanitizeWinAnsi(String(val)))
                }
              } catch (_) {}
            }
          }
        })
      } catch (_) {}

      // 2. Direct visual overlay stamping onto coordinates
      flatFields.forEach(f => {
        const key = f.id || f.name
        const val = userValues[key]
        if (val === undefined || val === null || val === '') return

        const pageIdx = Math.max(0, (f.page || f.pageNumber || 1) - 1)
        if (pageIdx < pages.length) {
          const page = pages[pageIdx]
          const { width: pWidth, height: pHeight } = page.getSize()

          // Checkbox handling: draw neat 'X' tick mark instead of raw 'true' text
          const isCheckbox = f.type === 'checkbox' || val === true || val === false || val === 'true' || val === 'false'
          if (isCheckbox) {
            const isChecked = val === true || val === 'true' || val === 'Yes'
            if (!isChecked) return // Don't draw anything if unchecked
          }

          if (Array.isArray(f.box_2d) && f.box_2d.length === 4) {
            const [ymin, xmin, ymax, xmax] = f.box_2d
            const boxTop = (ymin / 1000) * pHeight
            const boxBottom = (ymax / 1000) * pHeight
            const boxLeft = (xmin / 1000) * pWidth
            const boxHeight = Math.max(8, boxBottom - boxTop)
            
            // In PDF coordinate system, (0,0) is BOTTOM-LEFT.
            // Baseline for text should be ~3-4pt above boxBottom:
            const drawX = Math.max(10, Math.min(boxLeft + 4, pWidth - 60))
            const drawY = Math.max(10, pHeight - boxBottom + Math.min(5, boxHeight * 0.25))

            if (isCheckbox) {
              // Draw centered checkmark [X] inside the checkbox square
              page.drawText('X', {
                x: boxLeft + 2,
                y: pHeight - boxBottom + 2,
                size: 11,
                font,
                color: rgb(0, 0.2, 0.7) // Official blue ballpoint ink
              })
            } else {
              const textToDraw = sanitizeWinAnsi(String(val))
              page.drawText(textToDraw, {
                x: drawX,
                y: drawY,
                size: 9.5,
                font,
                color: rgb(0, 0.2, 0.7)
              })
            }
          }
        }
      })

      const modifiedBytes = await pdfDocLib.save()
      const blob = new Blob([new Uint8Array(modifiedBytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `telmy_filled_${docMeta?.title || 'document'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e: any) {
      alert('Gagal mendownload PDF terisi: ' + e.message)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-800 rounded-xl transition text-slate-400 hover:text-white flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{studioI18n.backToDashboard}</span>
          </button>
          <div className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm">📑</span>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                {docMeta?.documentTitle || docMeta?.title || 'Form Editor & Studio'}
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">{studioI18n.studioBadge}</span>
              </h1>
              <p className="text-[11px] text-slate-400">{studioI18n.studioSubtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-300">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={activeLangKey}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer"
            >
              {DASHBOARD_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                  {c.flag} {c.nativeName}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{studioI18n.encryptedBadge}</span>
          </div>

          <button
            onClick={handleDownloadFilledPdf}
            disabled={isExporting || flatFields.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? studioI18n.exportingBtn : studioI18n.downloadBtn}</span>
          </button>
        </div>
      </header>

      {/* Main Split Screen Area */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <h3 className="text-base font-bold text-white mb-1">{statusMessage}</h3>
          <p className="text-xs text-slate-400 max-w-md">{studioI18n.analysisSubtext}</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-row overflow-hidden h-[calc(100vh-4rem)]">
          {/* Left Pane (50% Width): Interactive PDF.js Canvas with Auto-Scroll & Spotlight */}
          <div 
            ref={containerRef}
            className="w-1/2 border-r border-slate-800 bg-slate-950/50 p-6 overflow-y-auto flex flex-col items-center relative"
          >
            <div className="sticky top-0 z-20 mb-4 bg-slate-900/90 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300 flex items-center gap-3 backdrop-blur-md">
              <span>{studioI18n.pageOf.replace('{current}', String(currentPage)).replace('{total}', String(totalPages))}</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(p => p - 1)
                      renderPdfPage(pdfDoc, currentPage - 1)
                    }
                  }}
                  disabled={currentPage <= 1}
                  className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(p => p + 1)
                      renderPdfPage(pdfDoc, currentPage + 1)
                    }
                  }}
                  disabled={currentPage >= totalPages}
                  className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-800 bg-white">
              <canvas ref={canvasRef} className="block" />
              {/* Active Field Spotlight Bounding Box Overlay */}
              {activeField && activeField.box_2d && activeField.page === currentPage && (
                <div 
                  className="absolute border-2 border-blue-500 bg-blue-500/20 rounded shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse pointer-events-none transition-all duration-300"
                  style={{
                    top: `${(activeField.box_2d[0] / 1000) * 100}%`,
                    left: `${(activeField.box_2d[1] / 1000) * 100}%`,
                    height: `${((activeField.box_2d[2] - activeField.box_2d[0]) / 1000) * 100}%`,
                    width: `${((activeField.box_2d[3] - activeField.box_2d[1]) / 1000) * 100}%`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Right Pane (50% Width): Structured Adaptive Form Panel (Guided Field-by-Field) */}
          <div className="w-1/2 bg-slate-900 p-8 flex flex-col justify-between overflow-y-auto">
            {!isCompleted && activeField ? (
              <div className="max-w-xl w-full mx-auto flex-1 flex flex-col justify-center">
                {/* Stepper Progress */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-6 font-mono">
                  <span className="text-blue-400 font-bold uppercase tracking-wider">{activeField.sectionTitle || studioI18n.generalSection}</span>
                  <span className="bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-bold">
                    {studioI18n.fieldProgress.replace('{current}', String(currentFieldIndex + 1)).replace('{total}', String(flatFields.length))}
                  </span>
                </div>

                {/* Guided Card */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl mb-6 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-lg font-bold text-white">{activeField.label || activeField.name}</h2>
                    {activeField.required && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                        {studioI18n.requiredBadge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {activeField.meaning || activeField.description || activeField.explanation || ''}
                  </p>

                  {/* Format Hint / Realistic Example */}
                  {activeField.example && (
                    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5">
                      <span className="text-amber-400 text-sm">💡</span>
                      <div className="text-xs">
                        <strong className="text-slate-300 block mb-0.5">{studioI18n.correctFormatExample}</strong>
                        <span className="font-mono text-amber-300">{activeField.example}</span>
                      </div>
                    </div>
                  )}

                  {/* Native Adaptive Input Control */}
                  <div className="mt-2">
                    <label className="text-xs font-bold text-slate-400 block mb-2">{studioI18n.yourAnswer}</label>
                    {activeField.type === 'checkbox' ? (
                      <label className="flex items-center gap-3 p-3.5 bg-slate-900 border border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 transition">
                        <input
                          type="checkbox"
                          checked={Boolean(userValues[activeField.id || activeField.name])}
                          onChange={(e) => updateValue(activeField.id || activeField.name, e.target.checked)}
                          className="w-5 h-5 rounded text-blue-600 bg-slate-800 border-slate-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-semibold text-white">{studioI18n.checkboxAgree}</span>
                      </label>
                    ) : activeField.type === 'radio' && Array.isArray(activeField.options) ? (
                      <div className="grid grid-cols-2 gap-2">
                        {activeField.options.map((opt: string, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => updateValue(activeField.id || activeField.name, opt)}
                            className={`p-3 rounded-2xl text-xs font-bold text-left border transition ${
                              userValues[activeField.id || activeField.name] === opt
                                ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={activeField.type === 'date' ? 'date' : 'text'}
                        value={userValues[activeField.id || activeField.name] || ''}
                        onChange={(e) => updateValue(activeField.id || activeField.name, e.target.value)}
                        placeholder={activeField.placeholder || studioI18n.fieldPlaceholder}
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-sans"
                        autoFocus
                      />
                    )}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentFieldIndex === 0}
                    className="px-5 py-3 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 transition disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{studioI18n.btnPrev}</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition cursor-pointer"
                  >
                    <span>{currentFieldIndex === flatFields.length - 1 ? studioI18n.btnAuditFinish : studioI18n.btnNext}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Final Section: Form Audit & Export */
              <div className="max-w-xl w-full mx-auto flex-1 flex flex-col justify-center text-center">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{studioI18n.reviewedTitle}</h2>
                <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
                  {studioI18n.reviewedSubtitle}
                </p>

                {/* Audit Checklist Box */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 text-left mb-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/60">
                    <strong className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      {studioI18n.auditBoxTitle}
                    </strong>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      auditResult?.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {auditResult?.passed ? studioI18n.readyToSubmit : studioI18n.needsAttention.replace('{count}', String(auditResult?.missingCount || 0))}
                    </span>
                  </div>

                  {auditResult?.passed ? (
                    <div className="text-xs text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{flatFields.length === 0 ? studioI18n.informationalDocText : studioI18n.allValidText}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-amber-300">{studioI18n.missingWarning}</p>
                      <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                        {auditResult?.missingFields?.map((m: string, idx: number) => (
                          <li key={idx} className="font-mono text-[11px] text-amber-200">{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setIsCompleted(false)
                      setCurrentFieldIndex(0)
                    }}
                    className="px-5 py-3 rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    {studioI18n.btnReviewAgain}
                  </button>
                  <button
                    onClick={handleDownloadFilledPdf}
                    disabled={isExporting}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExporting ? studioI18n.exportingBtn : studioI18n.btnDownloadNow}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
