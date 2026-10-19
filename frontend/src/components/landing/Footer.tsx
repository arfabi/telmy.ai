import React from 'react'
import { TranslationData } from '@/data/translations'
import { Shield, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FooterProps {
  t: TranslationData
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-16 text-slate-600 text-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/telmy_icon.png" alt="Telmy" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-xl text-slate-900 tracking-tight">
                Telmy<span className="text-blue-600">.ai</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
              {t.footerTagline}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 text-blue-600">
                <Sparkles className="w-3.5 h-3.5" /> Built with Google Gemini & Google Cloud
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> {t.footerA11yBadge}
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
              {t.footerNavTitle}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/features" className="hover:text-blue-600 transition-colors">{t.navFeatures}</Link></li>
              <li><Link to="/download" className="hover:text-blue-600 transition-colors">{t.navDownload}</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-600 transition-colors">{t.navPricing}</Link></li>
              <li><a href="/#simulator" className="hover:text-blue-600 transition-colors">{t.heroDemo}</a></li>
              <li><Link to="/academy" className="hover:text-blue-600 transition-colors">{t.navAcademy}</Link></li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
              {t.footerLegalTitle}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">{t.footerPrivacy}</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 transition-colors">{t.footerTerms}</Link></li>
              <li><Link to="/security" className="hover:text-blue-600 transition-colors">{t.footerSecurity}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>{t.footerCopyright}</p>
          <p className="flex items-center gap-1 text-slate-500">
            {t.scopeDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  )
}
