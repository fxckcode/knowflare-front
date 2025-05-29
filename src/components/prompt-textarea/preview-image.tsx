import { X } from "lucide-react";

interface PreviewImageProps {
  image: string;
  alt: string;
  onRemove: () => void;
};

export const PreviewImage = ({ image, alt, onRemove }: PreviewImageProps) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-md p-1 relative" key={image}>
      <img
        src={image}
        alt={alt}
        className="w-10 h-10 object-cover rounded"
      />
      <button onClick={onRemove} className="cursor-pointer absolute -top-1 -right-1 rounded-full bg-gray-100">
        <X className="size-4 text-gray-500 hover:bg-red-300 hover:text-red-700 rounded-full p-0.5" />
      </button>
    </div>
  );
};
