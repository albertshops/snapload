import { v4 } from "uuid";
import HeadlessUploadFiles from "./headless/UploadFiles";
import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "./utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";

type Result = {
  key: string;
  url: string;
};

type Props = {
  onSuccess?: (result: Result) => void;
};

export function UploadFiles(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <HeadlessUploadFiles
      upload={async ({ file, onProgress }) => {
        const { key, url } = await emulatePresignedUrl(file.name);
        await emulateUploadFile(onProgress);
        return { key, url };
      }}
      onSuccess={props.onSuccess}
      onStart={() => setOpen(true)}
      onEnd={() => setOpen(false)}
    >
      {(uploads) => (
        <div className="w-96 flex flex-col">
          <div className="border rounded text-sm w-full flex transition text-zinc-800 justify-between overflow-hidden">
            <HeadlessUploadFiles.Trigger className="flex-grow hover:bg-zinc-100 transition relative">
              <div className="px-3 py-2 flex">Upload files...</div>
            </HeadlessUploadFiles.Trigger>
            {uploads.length > 0 && (
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
              {uploads.map((upload) => (
                <div
                  key={upload.url}
                  className="border-b last:border-none px-3 py-2 relative flex justify-between items-center text-sm"
                >
                  <span>{upload.name}</span>
                  <span>
                    <CheckIcon
                      className={cn("w-4 opacity-0", {
                        "opacity-100":
                          upload.uploading == false && upload.progress == 100,
                      })}
                    />
                  </span>
                  {upload.uploading && (
                    <div
                      className="h-0.5 bg-primary absolute bottom-0 left-0 transition w-full origin-left"
                      style={{ transform: `scaleX(${upload.progress / 100})` }}
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

async function emulatePresignedUrl(filename: string) {
  return {
    key: `${v4()}/${filename}`,
    url: `aws.com/${v4()}/${filename}`,
  };
}

function emulateUploadFile(
  onProgress: (percentage: number) => void,
): Promise<void> {
  return new Promise((resolve) => {
    let percentage = 0;

    const interval = setInterval(
      () => {
        percentage += 5 + Math.random() * 10;
        onProgress(percentage);

        if (percentage >= 100) {
          onProgress(100);
          clearInterval(interval);
          resolve();
        }
      },
      150 + Math.random() * 100,
    );
  });
}
