export interface LanguageItem {
  code: string
  name: string
  nativeName: string
  country: string
  flag: string
  svg: string
}

export const JAPAC_LANGUAGES: LanguageItem[] = [
  {
    code: 'en',
    name: 'English (US)',
    nativeName: 'English',
    country: 'United States',
    flag: '🇺🇸',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs"><rect width="640" height="480" fill="#bd3d44"/><path stroke="#fff" stroke-width="37" d="M0 55.4h640m0 73.8h-640m0 73.8h640m0 73.8h-640m0 73.8h640m0 73.8h-640"/><rect width="256" height="258" fill="#192f5d"/><g fill="#fff"><circle cx="40" cy="35" r="10"/><circle cx="100" cy="35" r="10"/><circle cx="160" cy="35" r="10"/><circle cx="220" cy="35" r="10"/><circle cx="70" cy="70" r="10"/><circle cx="130" cy="70" r="10"/><circle cx="190" cy="70" r="10"/><circle cx="40" cy="105" r="10"/><circle cx="100" cy="105" r="10"/><circle cx="160" cy="105" r="10"/><circle cx="220" cy="105" r="10"/></g></svg>'
  },
  {
    code: 'id',
    name: 'Bahasa Indonesia',
    nativeName: 'Indonesia',
    country: 'Indonesia',
    flag: '🇮🇩',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs border border-slate-200"><path fill="#e70011" d="M0 0h640v240H0z"/><path fill="#ffffff" d="M0 240h640v240H0z"/></svg>'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    country: 'Japan',
    flag: '🇯🇵',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs border border-slate-200"><path fill="#ffffff" d="M0 0h640v480H0z"/><circle fill="#bc002d" cx="320" cy="240" r="144"/></svg>'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    country: 'South Korea',
    flag: '🇰🇷',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs border border-slate-200"><path fill="#ffffff" d="M0 0h640v480H0z"/><g transform="translate(320,240)"><path fill="#cd2e3a" d="M0-120a120 120 0 0 1 120 120 60 60 0 0 1-60 60 60 60 0 0 0-60-60 60 60 0 0 0-60 60 60 60 0 0 1-60-60A120 120 0 0 1 0-120z"/><path fill="#0047a0" d="M0 120a120 120 0 0 1-120-120 60 60 0 0 1 60-60 60 60 0 0 0 60 60 60 60 0 0 0 60-60 60 60 0 0 1 60 60A120 120 0 0 1 0 120z"/></g></svg>'
  },
  {
    code: 'zh',
    name: 'Simplified Chinese',
    nativeName: '简体中文',
    country: 'China',
    flag: '🇨🇳',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs"><path fill="#ee1c25" d="M0 0h640v480H0z"/><polygon fill="#ffde00" points="120,60 133,100 175,100 141,125 154,165 120,140 86,165 99,125 65,100 107,100"/></svg>'
  },
  {
    code: 'zh-TW',
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    country: 'Taiwan',
    flag: '🇹🇼',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs"><path fill="#fe0000" d="M0 0h640v480H0z"/><path fill="#000095" d="M0 0h320v240H0z"/><circle fill="#fff" cx="160" cy="120" r="50"/><circle fill="#000095" cx="160" cy="120" r="34"/><circle fill="#fff" cx="160" cy="120" r="26"/></svg>'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    country: 'Vietnam',
    flag: '🇻🇳',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs"><path fill="#da251d" d="M0 0h640v480H0z"/><polygon fill="#ffff00" points="320,90 357,204 477,204 380,274 417,388 320,318 223,388 260,274 163,204 283,204"/></svg>'
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    country: 'Thailand',
    flag: '🇹🇭',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs"><path fill="#a51931" d="M0 0h640v480H0z"/><path fill="#f4f5f8" d="M0 80h640v320H0z"/><path fill="#2d2a4a" d="M0 160h640v160H0z"/></svg>'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    country: 'India',
    flag: '🇮🇳',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs border border-slate-200"><path fill="#ff9933" d="M0 0h640v160H0z"/><path fill="#ffffff" d="M0 160h640v160H0z"/><path fill="#128807" d="M0 320h640v160H0z"/><circle fill="#000088" cx="320" cy="240" r="30"/></svg>'
  },
  {
    code: 'fil',
    name: 'Filipino',
    nativeName: 'Filipino',
    country: 'Philippines',
    flag: '🇵🇭',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs"><path fill="#0038a8" d="M0 0h640v240H0z"/><path fill="#ce1126" d="M0 240h640v240H0z"/><polygon fill="#ffffff" points="0,0 280,240 0,480"/><circle fill="#fcd116" cx="95" cy="240" r="32"/></svg>'
  },
  {
    code: 'ms',
    name: 'Malay',
    nativeName: 'Bahasa Melayu',
    country: 'Malaysia',
    flag: '🇲🇾',
    svg: '<svg viewBox="0 0 640 480" width="28" height="20" class="rounded shadow-xs border border-slate-200"><rect width="640" height="34" y="0" fill="#cc0000"/><rect width="640" height="34" y="34" fill="#ffffff"/><rect width="640" height="34" y="68" fill="#cc0000"/><rect width="640" height="34" y="102" fill="#ffffff"/><rect width="640" height="34" y="137" fill="#cc0000"/><rect width="640" height="34" y="171" fill="#ffffff"/><rect width="640" height="34" y="205" fill="#cc0000"/><rect width="640" height="34" y="239" fill="#ffffff"/><rect width="640" height="34" y="274" fill="#cc0000"/><rect width="640" height="34" y="308" fill="#ffffff"/><rect width="640" height="34" y="342" fill="#cc0000"/><rect width="640" height="34" y="377" fill="#ffffff"/><rect width="640" height="34" y="411" fill="#cc0000"/><rect width="640" height="34" y="446" fill="#ffffff"/><rect width="320" height="274" fill="#000066"/><circle cx="160" cy="137" r="75" fill="#ffcc00"/></svg>'
  }
]
