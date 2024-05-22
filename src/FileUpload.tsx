import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import HeadlessFileUpload from "./HeadlessFileUpload";
import { Button } from "./components/ui/button";
import { cn } from "./utils";
import { X as RemoveIcon } from "lucide-react";
import { useState } from "react";

/*
image field
file field
generic upload
*/

type Props = {
  keyName?: string | undefined;
  onFileChange?: (file: File | undefined) => void;
  onUploadComplete?: (keyName: string) => void;
  className?: string;
};

export function ImageField(props: {
  keyName?: string | undefined;
  onFileChange?: (file: File | undefined) => void;
  onUploadComplete?: (keyName: string) => void;
  className?: string;
}) {
  const [hover, setHover] = useState(false);

  return (
    <HeadlessFileUpload
      keyName={props.keyName}
      onFileChange={props.onFileChange}
      onUploadComplete={props.onUploadComplete}
    >
      {(file) => {
        return (
          <div className="flex flex-col gap-1">
            <HeadlessFileUpload.Trigger
              className="border w-96 aspect-video rounded border-dashed relative flex justify-center items-center overflow-hidden"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {file == undefined ? (
                <Button>Upload</Button>
              ) : (
                <>
                  <img
                    className="object-cover absolute h-full w-full"
                    src={file.blobUrl}
                  />

                  <div
                    className={cn(
                      "absolute inset-0 bg-zinc-100/50 flex justify-center items-center transition opacity-0",
                      { "opacity-100": file.uploading && file.progress < 100 },
                    )}
                  >
                    <div className="h-20 w-20">
                      <CircularProgressbar value={file.progress} />
                    </div>
                  </div>
                </>
              )}
            </HeadlessFileUpload.Trigger>
            <HeadlessFileUpload.Trigger
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <Button variant="outline" className="w-96 flex justify-between">
                {(() => {
                  if (hover) return <span>Choose file...</span>;
                  if (file)
                    return (
                      <>
                        <span>{file.name}</span>
                        <button className="p-2 pr-0">
                          <RemoveIcon className="w-4 text-red-600" />
                        </button>
                      </>
                    );

                  return <span>Choose file...</span>;
                })()}
              </Button>
            </HeadlessFileUpload.Trigger>
          </div>
        );
      }}
    </HeadlessFileUpload>
  );
}

export function FileField(props: Props) {
  return (
    <HeadlessFileUpload
      keyName={props.keyName}
      onFileChange={props.onFileChange}
      onUploadComplete={props.onUploadComplete}
    >
      {(file) => {
        return (
          <HeadlessFileUpload.Trigger>
            <Button variant="outline" className="w-96 flex justify-between">
              {file ? (
                <>
                  <span>{file.name}</span>
                  <button className="p-2 pr-0">
                    <RemoveIcon className="w-4" />
                  </button>
                </>
              ) : (
                <span>Choose file...</span>
              )}
            </Button>
          </HeadlessFileUpload.Trigger>
        );
      }}
    </HeadlessFileUpload>
  );
}
