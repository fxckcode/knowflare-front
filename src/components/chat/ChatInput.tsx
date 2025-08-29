'use client';

import { ChangeEvent, Dispatch, SetStateAction, useRef, KeyboardEvent } from 'react';
import { ChatRequestOptions } from 'ai';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUploader, FileUploaderHandles } from './FileUploader';
import { Paperclip, Send, Square } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event?: { preventDefault?: () => void; }, chatRequestOptions?: ChatRequestOptions) => void;
  isLoading: boolean;
  stop?: () => void;
  files: FileList | undefined;
  setFiles: Dispatch<SetStateAction<FileList | undefined>>;
}

export const ChatInput = ({
  inputValue,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  files,
  setFiles
}: ChatInputProps) => {
  const fileUploaderRef = useRef<FileUploaderHandles>(null);

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  const submitMessage = () => {
    if (isLoading || (!inputValue.trim() && (!files || files.length === 0))) return;

    const chatRequestOptions: ChatRequestOptions = {};
    if (files && files.length > 0) {
      chatRequestOptions.experimental_attachments = Array.from(files);
    }

    handleSubmit(undefined, chatRequestOptions);
    setFiles(new DataTransfer().files);
  };

  const handleAttachClick = () => {
    fileUploaderRef.current?.triggerFileInput();
  };

  return (
    <div className="p-4 bg-background border-t">
      <FileUploader ref={fileUploaderRef} files={files} setFiles={setFiles} />
      <div className="relative flex items-center gap-2">
        <Textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleTextareaKeyDown}
          placeholder="Type a message or drop a file..."
          className="w-full resize-none rounded-full border-2 border-input bg-background py-3 pl-12 pr-20 shadow-sm"
          rows={1}
        />
        <div className="absolute left-4">
          <Button variant="ghost" size="icon" onClick={handleAttachClick} className="rounded-full">
            <Paperclip className="size-5" />
          </Button>
        </div>
        <div className="absolute right-4">
          <Button
            size="icon"
            className="rounded-full w-10 h-10"
            onClick={isLoading ? stop : submitMessage}
            disabled={isLoading && !stop || (!inputValue.trim() && (!files || files.length === 0))}
          >
            {isLoading ? <Square className="size-5" /> : <Send className="size-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
