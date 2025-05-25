import { ReactNode } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  image: string;
  children: ReactNode;
  className?: string;
}

export const ImagePreview = ({ image, children, className }: ImagePreviewProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn("p-0 rounded-xl overflow-hidden", className)}>
        <DialogHeader>
          <DialogTitle className="sr-only">Are you absolutely sure?</DialogTitle>
          <img src={image} alt="Image" className="w-full h-full object-cover" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
