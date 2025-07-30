import { type ReactNode } from "react";

interface ButtonProps {
  main?: string;
  low?: string;
  color?: string;
  onClick?:()=>void;
  children?:ReactNode
}

export function Button({ main, low, color,onClick,children }: ButtonProps) {
  return (
    <button
        onClick={onClick} 
      className="
        flex items-center             
        py-3 px-6                     
        rounded-lg                    
        text-white font-sans          
        transition hover:brightness-90 
      "
      style={{ backgroundColor: color }}
    >
      {children}
      <div className="flex flex-col text-left">
        <span className="text-2xl font-bold">{main}</span>
        <span className="text-sm font-normal mt-0.5">{low}</span>
      </div>
    </button>
  );
}