'use client';

import { useState, useEffect, DragEvent, Dispatch, SetStateAction, useRef, forwardRef, useImperativeHandle } from 'react';
import { File, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export interface FileUploaderHandles {
  triggerFileInput: () => void;
}

interface FileUploaderProps {
  files: FileList | undefined;
  setFiles: Dispatch<SetStateAction<FileList | undefined>>;
}

export const FileUploader = forwardRef<FileUploaderHandles, FileUploaderProps>(({ files, setFiles }, ref) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      fileInputRef.current?.click();
    }
  }));

  useEffect(() => {
    if (files && files.length > 0) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    } else {
      setPreviewUrls([]);
    }
  }, [files]);

  const handleFileChange = (newFiles: FileList | null) => {
    if (newFiles && newFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      if (files) {
        Array.from(files).forEach(file => dataTransfer.items.add(file));
      }
      Array.from(newFiles).forEach(file => dataTransfer.items.add(file));
      setFiles(dataTransfer.files);
    }
  };

  const handleFileRemove = (indexToRemove: number) => {
    if (!files) return;
    const newFiles = Array.from(files).filter((_, index) => index !== indexToRemove);
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    setFiles(dataTransfer.files);
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <>
      <div
        onDragEnter={onDragEnter}
        onDragOver={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={isDragging ? 'border-2 border-dashed border-primary rounded-lg p-4' : ''}
      >
        <AnimatePresence>
          {files && files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-2 bg-muted rounded-md mb-2 overflow-x-auto"
            >
              {Array.from(files).map((file, index) => (
                <div key={index} className="relative flex-shrink-0">
                  {file.type.startsWith('image/') ? (
                    <img src={previewUrls[index]} alt={file.name} className="w-20 h-20 object-cover rounded-md" />
                  ) : (
                    <div className="w-20 h-20 bg-secondary rounded-md flex flex-col items-center justify-center p-2">
                      <File className="size-8 text-secondary-foreground" />
                      <span className="text-xs text-secondary-foreground truncate w-full text-center">{file.name}</span>
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => handleFileRemove(index)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {isDragging && (
          <div className="pointer-events-none absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
            <p className="text-white text-lg font-semibold">Drop files here</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files)}
        className="hidden"
        multiple
      />
    </>
  );
});
