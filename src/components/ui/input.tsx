// import * as React from "react"
import React, { useState } from "react";
import { cn } from "@/lib/utils"

interface InputWithIconProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode; // Prop untuk ikon opsional
}

// const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
//   ({ className, type, ...props }, ref) => {
    
//     return (
    
//       <div
//       className="relative flex items-center w-full"
//       style={{ position: "relative" }}
//     >
//       <input
//         type={type}
//         className={cn(
//           "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//           "border-[1px] border-[var(--System-Gray-1,#B1B1B4)] rounded-[5px] text-[var(--Text-Text-Tertiary,#B3B3B3)]",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//       {icon && (
//         <span
//           className="absolute right-3 pointer-events-none"
//           style={{ pointerEvents: "none" }}
//         >
//           {icon}
//         </span>
//       )}
//     </div>
//     )
//   }
// )

interface InputWithIconProps extends React.ComponentProps<"input"> {
  dropdownIcon?: React.ReactNode;
  dropupIcon?: React.ReactNode;
  onFieldClick?: () => void; 
  isDropdownField?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, type, dropdownIcon, dropupIcon, onFieldClick,  isDropdownField = false, ...props }, ref) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleClick = () => {
      if (isDropdownField) {
        setIsDropdownOpen((prev) => !prev);
        if (onFieldClick) onFieldClick();
      }
    };

    return (
      <div
        className="relative flex items-center w-full"
        style={{ position: "relative" }}
      >
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "border-[1px] border-[var(--System-Gray-1,#B1B1B4)] rounded-[5px] text-[var(--Text-Text-Tertiary,#B3B3B3)]",
            className
          )}
          ref={ref}
       
          onClick={handleClick} // Tangkap klik
          {...props}
        />
      {dropdownIcon && dropupIcon && (
        <span
          className="absolute right-3 pointer-events-none"
          style={{ pointerEvents: "none" }}
        >
          {isDropdownOpen ? dropupIcon : dropdownIcon}
        </span>
      )}
      </div>
    );
  }
);

Input.displayName = "Input"

export { Input }
