import { Feather } from 'lucide-react'

interface LogoMarkProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LogoMark({ size = 'md', className = '' }: LogoMarkProps) {
  const config = {
    sm: { icon: 16, brand: 'text-base', sub: 'text-[7px] tracking-[0.22em]', gap: 'gap-1.5' },
    md: { icon: 22, brand: 'text-xl',   sub: 'text-[8px]  tracking-[0.25em]', gap: 'gap-2' },
    lg: { icon: 32, brand: 'text-3xl',  sub: 'text-[10px] tracking-[0.3em]',  gap: 'gap-3' },
  }

  const c = config[size]

  return (
    <div className={`flex items-center ${c.gap} ${className}`}>
      {/* Quill icon */}
      <Feather
        size={c.icon}
        strokeWidth={1.4}
        className="text-amber-600 flex-shrink-0"
      />

      {/* Wordmark */}
      <div className="flex flex-col leading-none gap-[3px]">
        <span
          className={`font-serif font-bold text-slate-900 ${c.brand} leading-none tracking-tight`}
          style={{
            background: 'linear-gradient(135deg, #b8902a 0%, #d4af37 40%, #f0d060 60%, #c9972c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          DEE&apos;S
        </span>
        <span
          className={`font-semibold uppercase ${c.sub} leading-none`}
          style={{
            background: 'linear-gradient(135deg, #b8902a 0%, #d4af37 50%, #c9972c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Pen House
        </span>
      </div>
    </div>
  )
}
