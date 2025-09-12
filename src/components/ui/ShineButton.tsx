'use client'

import * as React from 'react'

type ShineButtonSize = 'sm' | 'md' | 'lg'

export interface ShineButtonProps {
  label?: string
  onClick?: () => void
  className?: string
  size?: ShineButtonSize
  bgColor?: string // hex or gradient
}

const sizeStyles: Record<ShineButtonSize, { padding: string; fontSize: string }> = {
  sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
  md: { padding: '0.6rem 1.4rem', fontSize: '1rem' },
  lg: { padding: '0.8rem 1.8rem', fontSize: '1.125rem' },
}

export const ShineButton: React.FC<ShineButtonProps> = ({
  label = 'Shine now',
  onClick,
  className = '',
  size = 'md',
  bgColor = 'linear-gradient(325deg, hsl(160 84% 39%) 0%, hsl(174 84% 40%) 55%, hsl(160 84% 39%) 90%)', // emerald/cyan
}) => {
  const { padding, fontSize } = sizeStyles[size]

  const backgroundImage = bgColor.startsWith('linear-gradient')
    ? bgColor
    : `linear-gradient(to right, ${bgColor}, ${bgColor})`

  return (
    <button
      onClick={onClick}
      className={`group relative text-white font-medium rounded-md min-w-[120px] min-h-[44px] transition-all duration-700 ease-in-out border-none cursor-pointer shadow-[0px_0px_20px_rgba(16,185,129,0.35),0px_5px_5px_-1px_rgba(16,185,129,0.25),inset_4px_4px_8px_rgba(167,243,208,0.35),inset_-4px_-4px_8px_rgba(14,116,144,0.35)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-500 hover:bg-[length:280%_auto] active:scale-95 ${className}`}
      style={{
        backgroundImage,
        backgroundSize: '280% auto',
        backgroundPosition: 'initial',
        color: 'hsl(0 0% 100%)',
        fontSize,
        padding,
        transition: '0.8s',
      }}
      onMouseEnter={(e) => {
        ;(e.target as HTMLButtonElement).style.backgroundPosition = 'right top'
      }}
      onMouseLeave={(e) => {
        ;(e.target as HTMLButtonElement).style.backgroundPosition = 'initial'
      }}
    >
      {label}
      <div
        className="pointer-events-none absolute top-0 left-[-75%] z-20 h-full w-[200%] skew-x-[-20deg] bg-white/35 opacity-0 group-hover:opacity-100 animate-shine"
      />
    </button>
  )
}

export default ShineButton


