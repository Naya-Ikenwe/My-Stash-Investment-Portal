import React from "react";
import { IoMdClose } from "react-icons/io";

type HoverWrapperProps = {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
};

export default function HoverWrapper({
  children,
  className,
  onClose,
}: HoverWrapperProps) {
  return (
    <main className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`${className} bg-[#FAFAFA] p-8 relative rounded-xl min-w-[500px] flex items-center justify-center`}
      >
        {/* <IoMdClose className="absolute top-4 right-10" onClick={onClose} /> */}
        {children}
      </div>
    </main>
  );
}
