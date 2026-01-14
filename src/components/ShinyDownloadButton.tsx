import { useRef, useCallback } from 'react';
import { Download } from 'lucide-react';

interface ShinyDownloadButtonProps {
  onClick: () => void;
}

export const ShinyDownloadButton = ({ onClick }: ShinyDownloadButtonProps) => {
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
    <div className="btn-wrapper-mesclado">
      <button
        ref={buttonRef}
        className="aura-ink-button"
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="ink-filter-glitch" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <div className="shimmer-container">
          <div className="shimmer-gradient" />
        </div>

        <div className="ink-splash" />

        <div className="wrapper-icones">
          <Download className="w-5 h-5" style={{ color: 'inherit' }} />
        </div>

        <span className="texto-principal">Download Page</span>
        <span className="texto-hover">Download Page</span>

        <div ref={particleContainerRef} className="particle-container" />
      </button>
    </div>
  );
};
