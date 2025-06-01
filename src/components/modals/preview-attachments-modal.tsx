import { ReactNode } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface PreviewAttachmentsProps {
  image: string;
  children: ReactNode;
  className?: string; 
}

export const PreviewAttachments = ({ image, children, className }: PreviewAttachmentsProps) => {
  return (
    <Dialog>
      <DialogTrigger className="aspect-[16/9] rounded-md overflow-hidden border object-cover" asChild>
        {children}
      </DialogTrigger>
      <DialogContent
        className={cn("p-0 rounded-xl overflow-hidden max-h-[75vh] overflow-y-scroll", className)}
        hasCloseButton={true}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <img src={image} alt="Image" className="w-full h-full object-cover" />
      </DialogContent>
    </Dialog>
  );
};
