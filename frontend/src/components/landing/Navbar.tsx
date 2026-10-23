import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { JAPAC_LANGUAGES } from '@/data/languages'
import { LanguageModal } from '@/components/landing/LanguageModal'
import { Menu, X, LayoutDashboard } from 'lucide-react'

export const Navbar: React.FC = () => {
  const { lang, t } = useLanguage()
  const { userProfile } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const currentLangObj = JAPAC_LANGUAGES.find((l) => l.code === lang) || JAPAC_LANGUAGES[0]

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to={`/${lang}`} className="flex items-center gap-2.5 group">
            <img
              src="/telmy_icon.png"
              alt="Telmy Icon"
              className="w-9 h-9 rounded-xl shadow-xs group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Telmy<span className="text-blue-600">.ai</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a
              href="/#simulator"
              onClick={(e) => {
                const el = document.getElementById('simulator')
                if (el) {
                  e.preventDefault()
                  el.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              {lang === 'id' ? 'Cara Kerja' : 'How It Works'}
            </a>
            <Link to="/features" className="hover:text-blue-600 transition-colors">{t.navFeatures}</Link>
            <Link to="/download" className="hover:text-blue-600 transition-colors">{t.navDownload}</Link>
            <Link to="/academy" className="hover:text-blue-600 transition-colors">{t.navAcademy}</Link>
            <Link to="/pricing" className="hover:text-blue-600 transition-colors">{t.navPricing}</Link>
            <Link to="/faq" className="hover:text-blue-600 transition-colors">{t.navFaq}</Link>
          </nav>

          {/* Right Action: Language Modal, Sign In, CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher Trigger */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:border-slate-300 rounded-xl transition-all cursor-pointer border border-slate-200/60 shadow-2xs group"
              title="Pilih Bahasa / Change Language"
            >
              <div
                className="w-4 h-3 flex items-center overflow-hidden rounded-xs"
                dangerouslySetInnerHTML={{ __html: currentLangObj.svg }}
              />
              <span className="font-bold uppercase tracking-wider">{currentLangObj.code}</span>
              <span className="text-slate-400 group-hover:text-slate-600 text-[11px] font-normal">
                ({currentLangObj.nativeName})
              </span>
            </button>

            {/* Sign in or Dashboard */}
            {userProfile?.uid ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link to="/signin">
                <Button variant="ghost" size="sm" className="font-semibold text-slate-700 hover:text-blue-600">
                  {t.navSignIn}
                </Button>
              </Link>
            )}

            {/* Primary CTA */}
            <Link to="/download">
              <Button size="sm" className="font-semibold shadow-sm shadow-blue-500/20">
                {t.navCta}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="p-2 rounded-xl text-slate-700 bg-slate-100 flex items-center gap-1.5 text-xs font-bold"
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="uppercase">{currentLangObj.code}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4">
            <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700">
              <a
                href="/#simulator"
                onClick={(e) => {
                  setMobileMenuOpen(false)
                  const el = document.getElementById('simulator')
                  if (el) {
                    e.preventDefault()
                    el.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="py-1 hover:text-blue-600 font-semibold text-blue-600 cursor-pointer"
              >
                {lang === 'id' ? 'Cara Kerja' : 'How It Works'}
              </a>
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-600"
              >
                {t.navFeatures}
              </Link>
              <Link
                to="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-600"
              >
                {t.navDownload}
              </Link>
              <Link
                to="/academy"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-600"
              >
                {t.navAcademy}
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-600"
              >
                {t.navPricing}
              </Link>
              <Link
                to="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-blue-600"
              >
                {t.navFaq}
              </Link>
              {userProfile?.uid ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 font-semibold text-blue-600 flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 font-semibold text-blue-600"
                >
                  {t.navSignIn}
                </Link>
              )}
            </nav>

            <div className="pt-2">
              <Link
                to="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block"
              >
                <Button className="w-full font-bold">
                  {t.navCta}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Language Modal */}
      <LanguageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
