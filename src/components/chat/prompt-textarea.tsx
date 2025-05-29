"use client";

import { PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { PromptInput } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Square } from "lucide-react";
import { ModelDropdown } from "@/components/chat/model-dropdown";
import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction, useRef, useState, useEffect } from "react";
import { Models } from "@/lib/types";
import { Globe } from "@/components/fundations/icons";
import { cn } from "@/lib/utils";
import { ChatRequestOptions } from "ai";
import { usePathname } from "next/navigation";
import { InputUploadFiles } from "@/components/prompt-textarea/input-upload-files";
import { PreviewImage } from "@/components/prompt-textarea/preview-image";

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
  /* eslint-disable-next-line */
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

  const isHome = usePathname() === "/";

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
      <div className="flex items-center gap-2">
        {files && files.length > 0 &&
          <div className="flex items-center gap-2 pb-1.5">
            {Array.from(files).map((file, index) => (
              <PreviewImage
                key={file.name}
                image={previewUrls[index]}
                alt={file.name}
                onRemove={() => handleFileRemove(file)}
              />
            ))}
          </div>
        }
      </div>

      <PromptInputTextarea
        className="min-h-[40px] max-h-[100px] h-auto px-2 leading-[24px]"
        placeholder="Ask Idle anything"
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={handleInputChange}
      />

      <PromptInputActions className="flex justify-between items-end mt-3">
        <div className="flex items-center gap-2">
          <div className="chat-tools">
            {!isHome && (
              <PromptInputAction tooltip="Upload files">
                <InputUploadFiles setFiles={setFiles} fileInputRef={fileInputRef} />
              </PromptInputAction>
            )}

            <PromptInputAction tooltip="Select Model">
              <ModelDropdown setModel={handleModelChange} />
            </PromptInputAction>

            <PromptInputAction tooltip="Search in the web">
              <button
                onClick={() => setIsSearchGrounding(prev => !prev)}
                className={cn("chat-tools__button", isSearchGrounding && "chat-tools__button--active")}
              >
                <Globe className="size-4" />
              </button>
            </PromptInputAction>
          </div>
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
