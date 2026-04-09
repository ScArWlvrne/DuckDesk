import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`px-4 py-6 sm:px-6 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}
