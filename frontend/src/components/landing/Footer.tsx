import React from 'react'
import { TranslationData } from '@/data/translations'
import { Shield, Award } from 'lucide-react'

interface FooterProps {
  t: TranslationData
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-16 text-slate-600 text-sm">
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
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-600" /> {t.footerSecurityBadge}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-600" /> {t.footerA11yBadge}
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
              {t.footerNavTitle}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="/features" className="hover:text-blue-600">{t.navFeatures}</a></li>
              <li><a href="/pricing" className="hover:text-blue-600">{t.navPricing}</a></li>
              <li><a href="/download" className="hover:text-blue-600">{t.navDownload}</a></li>
              <li><a href="/academy" className="hover:text-blue-600">{t.navAcademy}</a></li>
              <li><a href="#faq" className="hover:text-blue-600">{t.navFaq}</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
              {t.footerLegalTitle}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><a href="/privacy" className="hover:text-blue-600">{t.footerPrivacy}</a></li>
              <li><a href="/terms" className="hover:text-blue-600">{t.footerTerms}</a></li>
              <li><a href="/security" className="hover:text-blue-600">{t.footerSecurity}</a></li>
              <li><a href="/dashboard" className="text-blue-600 font-semibold hover:underline">{t.footerDashboard}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>{t.footerCopyright}</p>
          <p className="flex items-center gap-1">
            {t.footerMission}
          </p>
        </div>
      </div>
    </footer>
  )
}
