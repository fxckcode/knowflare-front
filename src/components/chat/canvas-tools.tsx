import { Check, Copy, Download } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface CanvasToolsProps {
  onCopy: () => void;
  copied: boolean;
  onDownload: () => void;
}

export const CanvasTools = ({ onCopy, copied, onDownload }: CanvasToolsProps) => {
  return (
    <div className="canvas-tools">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={onCopy}>
              {copied ? <Check className="text-green-500" /> : <Copy className="text-muted-foreground" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Copy to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={onDownload}>
              <Download />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Download as Markdown</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};