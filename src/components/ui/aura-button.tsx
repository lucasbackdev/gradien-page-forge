import * as React from "react";
import { cn } from "@/lib/utils";

interface AuraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AuraButton = React.forwardRef<HTMLButtonElement, AuraButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative flex items-center justify-center h-[50px] px-6 rounded-full cursor-pointer overflow-hidden",
          "transition-all duration-300 hover:scale-[1.02]",
          className
        )}
        style={{
          background: "linear-gradient(135deg, #e040fb 0%, #7c4dff 50%, #448aff 100%)",
        }}
        {...props}
      >
        {/* Shimmer effect */}
        <div 
          className="absolute top-0 h-full w-20 pointer-events-none z-10"
          style={{
            background: "linear-gradient(10deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%)",
            mixBlendMode: "overlay",
            transform: "skew(-25deg)",
            animation: "shimmer 5s infinite ease-in-out",
          }}
        />
        
        {/* White background reveal on hover */}
        <div 
          className="absolute left-[5px] h-[calc(100%-10px)] bg-white rounded-full z-20 opacity-0 w-0 
                     group-hover:w-[calc(100%-10px)] group-hover:opacity-100
                     transition-all duration-700"
          style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
        />
        
        {/* Main text */}
        <span 
          className="relative z-30 text-white font-semibold text-sm whitespace-nowrap
                     transition-all duration-700 group-hover:opacity-0 group-hover:-translate-x-10"
          style={{ 
            fontFamily: "'Sora', sans-serif",
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" 
          }}
        >
          {children}
        </span>
        
        {/* Hover text */}
        <span 
          className="absolute left-1/2 top-1/2 z-30 text-black font-semibold text-sm whitespace-nowrap
                     opacity-0 transition-all duration-700
                     -translate-x-1/2 -translate-y-1/2 translate-x-[30px]
                     group-hover:opacity-100 group-hover:translate-x-[-50%] group-hover:-translate-y-1/2"
          style={{ 
            fontFamily: "'Sora', sans-serif",
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" 
          }}
        >
          {children}
        </span>
      </button>
    );
  }
);

AuraButton.displayName = "AuraButton";

export { AuraButton };
