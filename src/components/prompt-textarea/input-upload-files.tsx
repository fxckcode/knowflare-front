import { Plus } from "lucide-react";
import { RefObject, SetStateAction } from "react";
import { Dispatch } from "react";

interface InputUploadFiles {
  setFiles: Dispatch<SetStateAction<FileList | undefined>>;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export const InputUploadFiles = ({ setFiles, fileInputRef }: InputUploadFiles) => {
  return (
    <label
      htmlFor="file-upload"
      className="chat-tools__button w-[34px] flex items-center justify-center"
    >
      <Plus className="size-4" />
      <input
        id="file-upload"
        type="file"
        className="hidden w-0 h-0 absolute"
        onChange={event => {
          if (event.target.files) {
            setFiles(event.target.files);
          }
        }}
        multiple
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/jpg,image/webp"
      />
    </label>
  );
};
