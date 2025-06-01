"use client";

import { File, Image, Plus } from "lucide-react";
import { RefObject, SetStateAction, useState } from "react";
import { Dispatch } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface InputUploadFiles {
  setFiles: Dispatch<SetStateAction<FileList | undefined>>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const InputUploadFiles = ({ setFiles, fileInputRef }: InputUploadFiles) => {
  const validFiles = ["image/png,image/jpeg,image/jpg,image/webp", "application/pdf"];
  const [selectedTypeFiles, setSelectedTypeFiles] = useState<string>(validFiles[0]);

  const handleClick = (type: 'images' | 'files') => {
    setSelectedTypeFiles(type === 'images' ? validFiles[0] : validFiles[1]);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  return (
    <>
      <input
        id="file-upload"
        type="file"
        className="hidden w-0 h-0 absolute"
        onChange={event => {
          if (event.target.files) {
            setFiles(event.target.files);
          }
        }}
        multiple
        ref={fileInputRef}
        accept={selectedTypeFiles}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="chat-tools__button">
          <Plus className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-[300px] rounded-xl">
          <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => handleClick('images')}>
            <Image className="size-4" />
            <span>
              Upload images
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => handleClick('files')}>
            <File className="size-4" />
            <span>
              Upload files
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
