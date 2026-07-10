interface LogoBrandProps {
  size?: 'sm' | 'md' | 'lg';
}

export const LogoBrand = ({ size = 'md' }: LogoBrandProps) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  return (
    <img 
      src="/logo.png" 
      alt="Presell Gads" 
      className={`${sizeClasses[size]} object-contain w-auto`} 
    />
  );
};
