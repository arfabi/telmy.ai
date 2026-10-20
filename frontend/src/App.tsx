import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/context/AuthContext'
import { LandingPage } from '@/pages/LandingPage'
import { FeaturesPage } from '@/pages/FeaturesPage'
import { PricingPage } from '@/pages/PricingPage'
import { DownloadPage } from '@/pages/DownloadPage'
import { AcademyPage } from '@/pages/AcademyPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { PdfEditorPage } from '@/pages/PdfEditorPage'
import { ConnectPage } from '@/pages/ConnectPage'
import { HelpPage } from '@/pages/HelpPage'
import { FaqPage } from '@/pages/FaqPage'
import { SignInPage } from '@/pages/SignInPage'
import { SecurityPage } from '@/pages/SecurityPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { TermsPage } from '@/pages/TermsPage'

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          {/* Root URL */}
          <Route path="/" element={<LandingPage />} />

          {/* 11 JAPAC Languages SEO Subpaths & Aliases for Landing */}
          <Route path="/id" element={<LandingPage />} />
          <Route path="/en" element={<LandingPage />} />
          <Route path="/ja" element={<LandingPage />} />
          <Route path="/ko" element={<LandingPage />} />
          <Route path="/zh" element={<LandingPage />} />
          <Route path="/cn" element={<LandingPage />} />
          <Route path="/tw" element={<LandingPage />} />
          <Route path="/zh-tw" element={<LandingPage />} />
          <Route path="/vi" element={<LandingPage />} />
          <Route path="/th" element={<LandingPage />} />
          <Route path="/hi" element={<LandingPage />} />
          <Route path="/fil" element={<LandingPage />} />
          <Route path="/ms" element={<LandingPage />} />

          {/* Core Product Pages */}
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Plan V5 Web Dashboard Platform */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pdf-editor" element={<PdfEditorPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  )
}
