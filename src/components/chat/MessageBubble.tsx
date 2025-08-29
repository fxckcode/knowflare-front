'use client';

import { motion } from 'framer-motion';
import { Message as MessageAISDK, Attachment } from 'ai';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot, File, Pencil, Trash, Check, Copy, RefreshCcw, BookMarkedIcon } from 'lucide-react';
import { Markdown } from '@/components/ui/markdown';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PreviewAttachments } from '@/components/modals/preview-attachments-modal';
import { TextShimmer } from '../ui/text-shimmer';

interface MessageBubbleProps {
  message: MessageAISDK;
  onEdit?: (id: string, newText: string) => void;
  onDelete?: (id: string) => void;
  onReload?: () => void;
  onShowCanvas?: (isShowing: boolean) => void;
}

export const MessageBubble = ({ message, onEdit, onDelete, onReload, onShowCanvas }: MessageBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(message.content);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const isUser = message.role === 'user';

  const imageAttachments = message.experimental_attachments?.filter(attachment => attachment.contentType?.startsWith('image/'));
  const filesAttachments = message.experimental_attachments?.filter(attachment => attachment.contentType?.startsWith('application/pdf'));

  const toolInvocationParts = message.parts?.filter(part => part.type === "tool-invocation");
  const sourceParts = message.parts?.filter(part => part.type === "source");

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyMessage(content);
    setTimeout(() => setCopyMessage(null), 2000);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(message.id, editInput);
    }
    setIsEditing(false);
  };

  const bubbleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={cn('group flex items-start gap-3 w-full', { 'justify-end': isUser })}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 bg-background">
          <AvatarImage src="/images/logo.png" alt="Agent" />
          <AvatarFallback><Bot size={20} /></AvatarFallback>
        </Avatar>
      )}

      <div className={cn('flex flex-col gap-2 items-start', { 'items-end': isUser })}>
        <div
          className={cn(
            'relative max-w-full rounded-2xl px-4 py-2 space-y-2',
            isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'
          )}
        >
          {message.id === 'thinking' ? (
            <TextShimmer>Thinking...</TextShimmer>
          ) : (
            <>
              {/* User Message Content */}
              {isUser && (
                <>
                  <div className={cn("grid gap-2", imageAttachments && imageAttachments.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
                {imageAttachments && imageAttachments.map((attachment, index) => (
                  <PreviewAttachments key={`${message.id}-${index}`} image={attachment.url}>
                    <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover cursor-pointer rounded-md" />
                  </PreviewAttachments>
                ))}
              </div>
              <div>
                {filesAttachments && filesAttachments.map((attachment: Attachment, index) => (
                  <div className="bg-primary/10 text-primary-foreground rounded-md p-2 flex items-center gap-3" key={`${message.id}-${index}`}>
                    <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
                      <File className="size-5" />
                    </div>
                    <span className="text-sm font-semibold mr-1">{attachment.name}</span>
                  </div>
                ))}
              </div>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full resize-none bg-transparent outline-none text-primary-foreground"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); } if (e.key === "Escape") { setIsEditing(false); } }}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <Markdown>{message.content}</Markdown>
              )}
            </>
          )}

          {/* Assistant Message Content */}
          {!isUser && (
            <>
              <Markdown className="message-content">{message.content}</Markdown>
              {toolInvocationParts && toolInvocationParts.length > 0 && (
                <div className="flex flex-col gap-2">
                  {toolInvocationParts.map((tool) => {
                    if (tool.toolInvocation.toolName === 'showPromptInCanvas') {
                      return tool.toolInvocation.state === 'call' ? (
                        <TextShimmer key={tool.toolInvocation.toolCallId}>Writing prompt...</TextShimmer>
                      ) : (
                        <button key={tool.toolInvocation.toolCallId} className="text-gray-500 bg-muted/50 rounded-md p-2 flex items-center gap-3 cursor-pointer" onClick={() => onShowCanvas && onShowCanvas(true)}>
                          <div className="w-11 h-11 rounded-md border border-gray-200 flex items-center justify-center"><BookMarkedIcon className="size-5" /></div>
                          <span className="text-sm">Showing prompt in canvas...</span>
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
              {sourceParts && sourceParts.length > 0 && (
                 <div className="flex flex-wrap gap-1 w-full mt-2">
                    {sourceParts.map((source) => (
                      <a key={source.source.id} href={source.source.url} target="_blank" rel="noopener noreferrer" className="text-brand-green font-semibold bg-brand-green/10 rounded-full py-2 px-4 text-sm flex items-center gap-2">
                         <p className="text-sm">{source.source.title}</p>
                      </a>
                    ))}
                  </div>
              )}
            </>
          )}
        </>
       )}
      </div>
        {/* Action Buttons */}
        <div className={cn("self-end md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1", isUser ? 'justify-end' : 'justify-start')}>
          <Button variant="ghost" size="icon" className="group/item h-7 w-7" onClick={() => handleCopy(message.content)}>
            {copyMessage === message.content ? <Check className="size-4 text-green-500" /> : <Copy className="size-4 group-hover/item:rotate-[-10deg] transition-transform duration-500" />}
          </Button>
          {isUser && onDelete && (
            <Button variant="ghost" size="icon" className="group/item h-7 w-7 hover:bg-red-500/10" onClick={() => onDelete(message.id)}>
              <Trash className="size-4 group-hover/item:text-red-500" />
            </Button>
          )}
          {isUser && onEdit && (
            <Button variant="ghost" size="icon" className="group/item h-7 w-7" onClick={() => setIsEditing(true)}>
              <Pencil className="size-4" />
            </Button>
          )}
          {!isUser && onReload && (
            <Button variant="ghost" size="icon" className="group/item h-7 w-7" onClick={() => onReload()}>
              <RefreshCcw className="size-4 group-hover/item:rotate-180 transition-transform duration-700" />
            </Button>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 bg-background">
          <AvatarFallback><User size={20} /></AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};
