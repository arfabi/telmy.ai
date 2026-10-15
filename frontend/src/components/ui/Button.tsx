import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 shadow-sm font-semibold'
  }[size]

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 shadow-md focus:ring-blue-500 hover:shadow-lg hover:shadow-blue-500/30',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400',
    outline: 'border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus:ring-slate-300',
    glass: 'bg-white/70 backdrop-blur-md border border-white/60 text-slate-800 hover:bg-white/90 shadow-sm hover:shadow'
  }[variant]

  // If custom className specifies bg-white or text-slate-*, avoid keeping conflicting classes
  const isCustomBg = className.includes('bg-')
  const isCustomText = className.includes('text-')
  
  let appliedVariant = variantStyles
  if (isCustomBg && isCustomText) {
    appliedVariant = appliedVariant
      .replace(/bg-[^\s]+/g, '')
      .replace(/text-[^\s]+/g, '')
      .replace(/hover:bg-[^\s]+/g, '')
  }

  return (
    <button className={`${baseStyles} ${sizeStyles} ${appliedVariant} ${className}`} {...props}>
      {children}
    </button>
  )
}
