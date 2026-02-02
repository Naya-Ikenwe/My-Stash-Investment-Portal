"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IoImageOutline } from "react-icons/io5";

interface FileDropzoneProps {
  onFileSelect?: (file: File) => void;
  acceptedFiles?: string;
  maxSize?: number; // in bytes, e.g., 5 * 1024 * 1024 for 5MB
}

export default function FileDropzone({ 
  onFileSelect,
  acceptedFiles = "image/*,.pdf,.jpeg,.jpg,.png",
  maxSize = 5 * 1024 * 1024 // Default 5MB
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      const sizeInMB = (maxSize / (1024 * 1024)).toFixed(1);
      setError(`File is too large. Maximum size is ${sizeInMB}MB`);
      return false;
    }

    // Check file type
    const acceptedTypes = acceptedFiles.split(',').map(type => type.trim());
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        // Extension check (e.g., .pdf)
        return `.${fileExtension}` === type;
      } else if (type.includes('/*')) {
        // MIME type check (e.g., image/*)
        const category = type.split('/*')[0];
        return fileType.startsWith(category);
      }
      return fileType === type;
    });

    if (!isValidType) {
      setError(`Invalid file type. Accepted: ${acceptedFiles}`);
      return false;
    }

    setError("");
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError("");
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect?.(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setFileName(file.name);
        onFileSelect?.(file);
      }
    }
  };

  const handleClick = () => {
    setError("");
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
        accept={acceptedFiles}
      />

      <div
        onClick={handleClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "flex h-32 cursor-pointer items-center gap-3 justify-center rounded-md bg-[#E7EEF680] border border-dashed border-muted-foreground/25 hover:border-muted-foreground transition",
          error && "border-red-300"
        )}
      >
        <IoImageOutline size={24} className="text-primary" />

        <div className="text-center">
          <h4 className="font-medium">Drag and drop here or click to upload</h4>
          <p className="text-sm text-muted-foreground">
            You can upload {acceptedFiles.replace(/,/g, ', ')} files
          </p>
          {maxSize && (
            <p className="text-xs text-gray-500 mt-1">
              Max size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3.5 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* File Info */}
      <div className={cn(
        "text-sm text-muted-foreground bg-[#F8F8F8] border border-[#F4F4F4] px-4 py-3.5 rounded",
        fileName && "bg-green-50 border-green-200"
      )}>
        {!fileName ? (
          <p>No document uploaded yet</p>
        ) : (
          <div>
            <p className="font-medium text-green-700">✓ Document uploaded:</p>
            <p className="mt-1">
              <span className="font-medium">{fileName}</span>
              <span className="text-xs text-gray-500 ml-2">
                (Click to change)
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}