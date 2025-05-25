"use client";

import { PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { PromptInput } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Plus, Square, X } from "lucide-react";
import { ModelDropdown } from "@/components/chat/model-dropdown";
import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction, useRef, useState, useEffect } from "react";
import { Models } from "@/lib/types";
import { Globe } from "@/components/fundations/icons";
import { cn } from "@/lib/utils";
import { ChatRequestOptions } from "ai";

interface PromptTextarea {
  inputValue: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event?: {
    preventDefault?: () => void;
  }, chatRequestOptions?: ChatRequestOptions) => void
  handleKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  stop?: () => void;
  setIsSearchGrounding: Dispatch<SetStateAction<boolean>>;
  isSearchGrounding: boolean;
  files: FileList | undefined;
  setFiles: Dispatch<SetStateAction<FileList | undefined>>;
}

export const PromptTextarea = ({
  inputValue,
  handleInputChange,
  handleSubmit,
  handleKeyDown,
  isLoading,
  stop,
  setIsSearchGrounding,
  isSearchGrounding,
  files,
  setFiles
}: PromptTextarea) => {
  const [model, setModel] = useState(globalThis?.localStorage?.getItem("model") || Models.GEMINI_2_5_FLASH_PREVIEW_04_17);
  const isDisabled = inputValue.length === 0;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (files && files.length > 0) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);

      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    }
  }, [files]);

  const handleModelChange = (model: string) => {
    setModel(model);
    globalThis?.localStorage?.setItem("model", model);
  };

  const handleFileRemove = (file: File) => {
    if (!files) return;
    const fileIndex = Array.from(files).findIndex(f => f.name === file.name);

    if (fileIndex !== -1 && previewUrls[fileIndex]) {
      URL.revokeObjectURL(previewUrls[fileIndex]);
    }

    const newFiles = Array.from(files).filter(f => f.name !== file.name);
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    setFiles(dataTransfer.files);
  };

  return (
    <PromptInput
      onSubmit={() => {
        handleSubmit({}, {
          experimental_attachments: files
        });
        setFiles(undefined);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }}
      className="w-full rounded-xl pt-3"
    >
      {files && files.length > 0 &&
        <div className="flex items-center gap-2 pb-1.5">
          {Array.from(files).map((file, index) => (
            <div className="flex items-center gap-2 bg-gray-100 rounded-md px-2.5 py-1.5" key={file.name}>
              <img
                src={previewUrls[index]}
                alt={file.name}
                className="w-8 h-8 object-cover rounded border"
              />
              <button onClick={() => handleFileRemove(file)} className="cursor-pointer">
                <X className="size-4 text-gray-500 hover:bg-red-300 hover:text-red-700 rounded-full p-0.5" />
              </button>
            </div>
          ))}
        </div>
      }

      <PromptInputTextarea
        className="min-h-[40px] max-h-[100px] h-auto px-2 sm:px-4 leading-[24px]"
        placeholder="Ask Idle anything"
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={handleInputChange}
      />

      <PromptInputActions className="flex justify-between items-end mt-3">
        <div className="flex items-center gap-2">
          <PromptInputAction tooltip="Upload files">
            <label htmlFor="file-upload" className="cursor-pointer p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors duration-200">
              <Plus className="size-5" />
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={event => {
                  if (event.target.files) {
                    setFiles(event.target.files);
                  }
                }}
                multiple
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/jpg,image/webp"
              />
            </label>
          </PromptInputAction>
          <PromptInputAction tooltip="Select Model">
            <ModelDropdown model={model} setModel={handleModelChange} />
          </PromptInputAction>
          <PromptInputAction tooltip="Search in the web">
            <button
              onClick={() => setIsSearchGrounding(prev => !prev)}
              className={cn("cursor-pointer p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors duration-200", isSearchGrounding && "text-brand-green bg-brand-green-light/10 hover:bg-brand-green-light/20 hover:text-brand-green")}
            >
              <Globe className="size-5" />
            </button>
          </PromptInputAction>
        </div>

        <PromptInputAction
          tooltip={isLoading ? "Stop generation" : "Send message"}
        >
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9 bg-brand-green rounded-lg hover:bg-brand-green-light cursor-pointer disabled:cursor-not-allowed"
            onClick={isLoading ? stop : handleSubmit}
            disabled={isDisabled}
          >
            {isLoading ? (
              <Square className="size-5 fill-current" />
            ) : (
              <ArrowUp className="size-5" />
            )}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
};
