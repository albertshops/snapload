import { useState } from "react";
import HeadlessUploadFiles from "./HeadlessUploadFiles";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn, toggle } from "./utils";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10">
      <HeadlessUploadFiles
        onFilesChange={() => {
          setOpen(true);
        }}
        onUploadComplete={() => {}}
        onUploadsComplete={() => {
          setOpen(false);
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
                    onClick={() => setOpen(toggle)}
                  >
                    <ChevronDownIcon
                      className={cn("w-4", { "rotate-180": open })}
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
                    className="border-b last:border-none px-3 py-2 relative flex justify-between"
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
    </div>
  );
}

export default App;
