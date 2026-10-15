import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean
  hoverGlow?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glass = false,
  hoverGlow = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${
        glass
          ? 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50'
          : 'bg-white border border-slate-200/80 shadow-sm'
      } ${
        hoverGlow
          ? 'hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200/80 hover:-translate-y-0.5'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { variant?: 'blue' | 'slate' | 'green' | 'amber' }> = ({
  children,
  className = '',
  variant = 'blue',
  ...props
}) => {
  const variantStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border tracking-wide uppercase ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
