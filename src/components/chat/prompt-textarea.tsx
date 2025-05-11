"use client";

import { PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { PromptInput } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Square } from "lucide-react";
import { ModelDropdown } from "@/components/chat/model-dropdown";
import { ChangeEvent, KeyboardEvent, useState } from "react";

interface PromptTextarea {
  inputValue: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

export const PromptTextarea = ({
  inputValue,
  handleInputChange,
  handleSubmit,
  handleKeyDown,
  isLoading
}: PromptTextarea) => {
  const [model, setModel] = useState(globalThis?.localStorage?.getItem("model") || "gpt-4.1");

  const handleModelChange = (model: string) => {
    setModel(model);
    globalThis?.localStorage?.setItem("model", model);
  };

  return (
    <PromptInput
      onSubmit={handleSubmit}
      className="w-full"
    >
      <PromptInputTextarea
        className="min-h-[40px] max-h-[100px]"
        placeholder="Ask Idle anything"
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={handleInputChange}
      />

      <PromptInputActions className="flex justify-between items-end mt-3">
        <div>
          <PromptInputAction tooltip="Select Model">
            <ModelDropdown model={model} setModel={handleModelChange} />
          </PromptInputAction>
        </div>

        <PromptInputAction
          tooltip={isLoading ? "Stop generation" : "Send message"}
        >
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={handleSubmit}
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
