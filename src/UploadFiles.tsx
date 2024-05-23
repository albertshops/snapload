import { useState } from "react";
import HeadlessUploadFiles from "./HeadlessUploadFiles";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "./utils";

type Props = {
  keyName?: string | undefined;
  onFilesChange?: (fileList: FileList) => void;
  onUploadComplete?: (keyName: string) => void;
  onUploadsComplete?: (keyName: string[]) => void;
  className?: string;
};

export default function UploadFiles(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <HeadlessUploadFiles
      onFilesChange={(files) => {
        setOpen(true);
        if (props.onFilesChange) props.onFilesChange(files);
      }}
      onUploadComplete={(keyName) => {
        if (props.onUploadComplete) props.onUploadComplete(keyName);
      }}
      onUploadsComplete={(keyNames) => {
        setOpen(false);
        if (props.onUploadsComplete) props.onUploadsComplete(keyNames);
      }}
    >
      {(files) => (
        <div className="w-96 flex flex-col">
          <div className="border rounded text-sm w-full flex transition text-zinc-800 justify-between overflow-hidden">
            <HeadlessUploadFiles.Trigger className="flex-grow hover:bg-zinc-100 transition relative">
              <div className="px-3 py-2 flex">Upload files...</div>
            </HeadlessUploadFiles.Trigger>
            {files.length > 0 && (
              <>
                <span className="border-r" />
                <button
                  className="px-2 hover:bg-zinc-100 transition"
                  onClick={() => setOpen((o) => !o)}
                >
                  <ChevronDownIcon
                    className={cn("w-4 transition", { "-scale-y-100": open })}
                  />
                </button>
              </>
            )}
          </div>

          <Popover open={open}>
            <PopoverTrigger className="right-0 left-0" />
            <PopoverContent className="w-96 p-0">
              {files.map((file) => (
                <div
                  key={file.uuid}
                  className="border-b last:border-none px-3 py-2 relative flex justify-between items-center text-sm"
                >
                  <span>{file.name}</span>
                  <span>
                    <CheckIcon
                      className={cn("w-4 opacity-0", {
                        "opacity-100":
                          file.uploading == false && file.progress == 100,
                      })}
                    />
                  </span>
                  {file.uploading && (
                    <div
                      className="h-0.5 bg-primary absolute bottom-0 left-0 transition w-full origin-left"
                      style={{ transform: `scaleX(${file.progress / 100})` }}
                    />
                  )}
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      )}
    </HeadlessUploadFiles>
  );
}
