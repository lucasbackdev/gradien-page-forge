import llomelloLogo from '@/assets/llomello-logo.png';

interface LogoBrandProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const LogoBrand = ({ size = 'md', showText = true }: LogoBrandProps) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3">
      <img 
        src={llomelloLogo} 
        alt="Llomello Pages" 
        className={`${sizeClasses[size]} object-contain`} 
      />
      {showText && (
        <span className={`font-sora font-semibold ${textSizeClasses[size]} text-foreground`}>
          Llomello Pages
        </span>
      )}
    </div>
  );
};
