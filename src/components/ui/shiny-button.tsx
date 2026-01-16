import { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ShinyButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const ShinyButton = ({ onClick, children, className, disabled, type = 'button', icon }: ShinyButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current;
    if (!btn) return;
    
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const inkSplash = btn.querySelector('.ink-splash') as HTMLElement;
    if (inkSplash) {
      inkSplash.style.setProperty('--x', `${x}px`);
      inkSplash.style.setProperty('--y', `${y}px`);
    }
  }, []);

  const spawnParticle = useCallback((type: 'ice' | 'white', x: number, y: number) => {
    const container = particleContainerRef.current;
    if (!container) return;

    const p = document.createElement('span');
    p.className = `particle p-${type}`;
    
    const size = type === 'ice' ? Math.random() * 6 + 4 : Math.random() * 5 + 3;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    if (type === 'ice') {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 60 + 30;
      p.style.setProperty('--startX', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--startY', `${Math.sin(angle) * dist}px`);
      p.style.setProperty('--life', `${Math.random() * 0.4 + 0.4}s`);
    } else {
      p.style.setProperty('--moveX', `${(Math.random() - 0.5) * 120}px`);
      p.style.setProperty('--moveY', `${(Math.random() - 0.5) * 120}px`);
      p.style.setProperty('--life', `${Math.random() * 0.8 + 0.8}s`);
    }

    container.appendChild(p);
    
    const lifetime = type === 'ice' ? 800 : 1600;
    setTimeout(() => p.remove(), lifetime);
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current;
    if (!btn) return;
    
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    for (let i = 0; i < 12; i++) {
      setTimeout(() => spawnParticle('ice', x, y), i * 30);
    }
  }, [spawnParticle]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current;
    if (!btn) return;
    
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    for (let i = 0; i < 8; i++) {
      setTimeout(() => spawnParticle('white', x, y), i * 40);
    }
  }, [spawnParticle]);

  return (
    <div className={cn("btn-wrapper-mesclado", className)}>
      <button
        ref={buttonRef}
        type={type}
        disabled={disabled}
        className={cn(
          "shiny-ink-button",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="ink-filter-shiny" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <div className="shimmer-container-shiny">
          <div className="shimmer-gradient-shiny" />
        </div>

        <div className="ink-splash-shiny" />

        <div className="wrapper-icones-shiny">
          {icon}
        </div>

        <span className="texto-principal-shiny">{children}</span>
        <span className="texto-hover-shiny">{children}</span>

        <div ref={particleContainerRef} className="particle-container" />
      </button>
    </div>
  );
};
