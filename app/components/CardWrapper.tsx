import React from "react";

interface CardWrapperProps {
  children: React.ReactNode;
  className?: string; // <-- add this line
}

export default function CardWrapper({ children, className }: CardWrapperProps) {
  return (
    <main
      className={`${
        className ?? ""
      } rounded-3xl border border-[#8080804D] bg-[#F7F7F7] custom-shadow`}
    >
      {children}
    </main>
  );
}
