"use client";

import { PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { PromptInput } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Square } from "lucide-react";
import { ModelDropdown } from "@/components/chat/model-dropdown";
import { useState } from "react";

interface PromptTextarea {
  inputValue: string;
  handleInputChange: (value: string) => void;
  handleSubmit: () => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

export const PromptTextarea = ({
  inputValue,
  handleInputChange,
  handleSubmit,
  handleKeyDown,
  isLoading
}: PromptTextarea) => {
  const [model, setModel] = useState("gpt-4.1");

  return (
    <PromptInput
      value={inputValue}
      onValueChange={handleInputChange}
      onSubmit={handleSubmit}
      className="w-full p-2"
    >
      <PromptInputTextarea
        placeholder="Ask Idle anything"
        onKeyDown={handleKeyDown}
      />

      <PromptInputActions className="flex justify-between items-end">
        <div>
          <PromptInputAction tooltip="Select Model">
            <ModelDropdown model={model} setModel={setModel} />
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
