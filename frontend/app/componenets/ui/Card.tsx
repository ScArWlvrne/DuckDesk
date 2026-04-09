import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div 
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
