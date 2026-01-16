import * as React from "react";
import { cn } from "@/lib/utils";

interface AuraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AuraButton = React.forwardRef<HTMLButtonElement, AuraButtonProps>(
  ({ className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "group relative flex items-center justify-center h-[50px] px-6 rounded-full cursor-pointer overflow-hidden",
          "transition-all duration-300 hover:scale-[1.02]",
          disabled && "opacity-50 cursor-not-allowed hover:scale-100",
          className
        )}
        style={{
          background: "#1a1a1a",
          border: "2px solid transparent",
        }}
        {...props}
      >
        {/* Animated rotating border */}
        <div 
          className="absolute inset-[-2px] rounded-full pointer-events-none overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #333 0%, #555 50%, #333 100%)",
          }}
        >
          <div 
            className="absolute inset-0 animate-[borderRotation_3s_linear_infinite]"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent, transparent)",
            }}
          />
        </div>
        
        {/* Inner background */}
        <div 
          className="absolute inset-[2px] rounded-full z-[1]"
          style={{
            background: "#1a1a1a",
          }}
        />
        
        {/* Shimmer effect */}
        <div 
          className="absolute top-0 h-full w-20 pointer-events-none z-[5]"
          style={{
            background: "linear-gradient(10deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)",
            mixBlendMode: "overlay",
            transform: "skew(-25deg)",
            animation: "shimmer 5s infinite ease-in-out",
          }}
        />
        
        {/* White background reveal on hover */}
        <div 
          className="absolute left-[5px] h-[calc(100%-10px)] bg-white rounded-full z-[6] opacity-0 w-0 
                     group-hover:w-[calc(100%-10px)] group-hover:opacity-100
                     transition-all duration-700"
          style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
        />
        
        {/* Circle avatar - slides right on hover */}
        <div 
          className="absolute left-[6px] top-1/2 w-[34px] h-[34px] bg-[#2a2a2a] rounded-full z-[20] flex items-center justify-center
                     transition-all duration-700 -translate-y-1/2
                     group-hover:translate-x-[calc(100%-44px)] group-hover:bg-[#1a1a1a]"
          style={{ 
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
            // Dynamic translateX based on button width - will be calculated
          }}
        >
          {/* Animated gradient inside circle */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #333 0%, #222 100%)",
            }}
          >
            <div 
              className="absolute inset-0 animate-[borderRotation_4s_linear_infinite] opacity-40"
              style={{
                background: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.2), transparent, transparent)",
              }}
            />
          </div>
        </div>
        
        {/* Main text - visible by default, fades left on hover */}
        <span 
          className="relative z-[10] text-white font-semibold text-sm whitespace-nowrap ml-8
                     transition-all duration-700 group-hover:opacity-0 group-hover:-translate-x-10"
          style={{ 
            fontFamily: "'Sora', sans-serif",
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" 
          }}
        >
          {children}
        </span>
        
        {/* Hover text - hidden by default, slides in from right on hover */}
        <span 
          className="absolute left-1/2 top-1/2 z-[10] text-black font-semibold text-sm whitespace-nowrap
                     opacity-0 transition-all duration-700
                     -translate-y-1/2 translate-x-[30px]
                     group-hover:opacity-100 group-hover:-translate-x-1/2"
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
