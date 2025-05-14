"use client";

import { PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { PromptInput } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Square } from "lucide-react";
import { ModelDropdown } from "@/components/chat/model-dropdown";
import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction, useState } from "react";
import { Models } from "@/lib/types";
import { Globe } from "@/components/extras/icons";
import { cn } from "@/lib/utils";

interface PromptTextarea {
  inputValue: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  stop?: () => void;
  setIsSearchGrounding: Dispatch<SetStateAction<boolean>>;
  isSearchGrounding: boolean;
}

export const PromptTextarea = ({
  inputValue,
  handleInputChange,
  handleSubmit,
  handleKeyDown,
  isLoading,
  stop,
  setIsSearchGrounding,
  isSearchGrounding
}: PromptTextarea) => {
  const [model, setModel] = useState(globalThis?.localStorage?.getItem("model") || Models.GEMINI_2_5_FLASH_PREVIEW_04_17);

  const handleModelChange = (model: string) => {
    setModel(model);
    globalThis?.localStorage?.setItem("model", model);
  };

  return (
    <PromptInput
      onSubmit={handleSubmit}
      className="w-full rounded-xl"
    >
      <PromptInputTextarea
        className="min-h-[40px] max-h-[100px]"
        placeholder="Ask Idle anything"
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={handleInputChange}
      />

      <PromptInputActions className="flex justify-between items-end mt-3">
        <div className="flex items-center gap-2">
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
            className="h-9 w-9 bg-brand-green rounded-lg"
            onClick={isLoading ? stop : handleSubmit}
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
