import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { TranslationData } from '@/data/translations'
import { Shield, Sparkles, ArrowRight, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react'

interface HeroProps {
  t: TranslationData
}

export const Hero: React.FC<HeroProps> = ({ t }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[560px] pointer-events-none -z-10">
        <div className="absolute top-4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-16 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 text-center lg:text-left">
            {/* Tagline Badge / Kicker (Spark Yellow & Telmy Blue accent) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB81F]/15 border border-[#FFB81F]/35 text-[#0A2357] text-xs font-bold mb-6 shadow-2xs backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
              <span>{t.heroKicker}</span>
            </div>

            {/* Main Headline (Display Nunito 800) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#0A2357] tracking-tight leading-[1.12]">
              {t.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/download" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-blue-500/25 px-7 py-3 text-base group">
                  <span>{t.heroCta}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#simulator" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold px-6 py-3 text-base border-slate-300 hover:bg-slate-50">
                  <Play className="w-4 h-4 text-blue-600 fill-blue-600 mr-2" />
                  <span>{t.heroDemo}</span>
                </Button>
              </a>
            </div>

            {/* Supporting Microcopy */}
            <p className="mt-4 text-xs text-slate-500 font-medium flex items-center justify-center lg:justify-start gap-2">
              <span>{t.heroSupportText}</span>
            </p>

            {/* Trustline Bar */}
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.heroTrustline}</span>
            </div>

            {/* Browser Support Badges / Horizontal Logo Showcase Grid */}
            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center lg:text-left mb-3.5">
                {t.heroWorksOn}:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto lg:mx-0">
                {[
                  { name: 'Chrome', icon: '/chrome.png', desc: 'Google Chrome' },
                  { name: 'Edge', icon: '/edge.png', desc: 'Microsoft Edge' },
                  { name: 'Firefox', icon: '/firefox.png', desc: 'Mozilla Firefox' },
                  { name: 'Opera', icon: '/opera.webp', desc: 'Opera Browser' },
                ].map((b) => (
                  <div
                    key={b.name}
                    className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/90 hover:bg-white border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-md transition-all duration-200"
                  >
                    <img
                      src={b.icon}
                      alt={b.name}
                      className="w-7 h-7 object-contain shrink-0 transition-transform group-hover:scale-110 drop-shadow-xs"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                        {b.name}
                      </span>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Product Demo Video Column (Enlarged ~20%) */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto max-w-2xl lg:max-w-none">
              {/* Soft decorative glow behind video */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 rounded-3xl blur-2xl opacity-25" />

              {/* Clean Video Container with custom floating controls on hover */}
              <div className="relative group rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
                <video
                  ref={videoRef}
                  src="/telmy-demo.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onClick={togglePlay}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-auto aspect-[16/10] sm:aspect-[16/9.5] object-cover object-top block cursor-pointer"
                >
                  Your browser does not support the video tag.
                </video>

                {/* Center click-to-play indicator when paused */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    aria-label="Play video"
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer backdrop-blur-xs"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                )}

                {/* Floating Glassmorphism Control Bar (Appears on Hover) */}
                <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="text-[11px] font-medium text-slate-300 select-none ml-1">
                      {isPlaying ? 'Demo Playing' : 'Paused'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={toggleFullscreen}
                      aria-label="Fullscreen"
                      className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
