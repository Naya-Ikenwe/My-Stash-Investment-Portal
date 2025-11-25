"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IoImageOutline } from "react-icons/io5";

export default function FileDropzone() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
            "flex h-32 cursor-pointer items-center gap-3 justify-center rounded-md bg-[#E7EEF680] border border-dashed border-muted-foreground/25 hover:border-muted-foreground transition"
        )}
      >
        <IoImageOutline size={24} className="text-primary" />

        <div>
          <h4>Drag and drop here or click to upload</h4>
          <p className="text-sm text-muted-foreground text-center">
            You can upload .jpeg, .png or pdf files
          </p>
        </div>
      </div>

      <div className="text-sm text-muted-foreground bg-[#F8F8F8] border border-[#F4F4F4] px-4 py-3.5">
        {!fileName ? (
          <p>no document uploaded yet</p>
        ) : (
          <p>
            Selected: <span className="font-medium">{fileName}</span>
          </p>
        )}
      </div>
    </div>
  );
}
