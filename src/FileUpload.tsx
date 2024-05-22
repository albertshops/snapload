import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import HeadlessFileUpload, { type CustomFile } from "./HeadlessFileUpload";
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
  return (
    <HeadlessFileUpload
      keyName={props.keyName}
      onFileChange={props.onFileChange}
      onUploadComplete={props.onUploadComplete}
    >
      {(file) => {
        return (
          <div className="flex flex-col gap-1">
            <HeadlessFileUpload.Trigger className="border w-96 aspect-video rounded border-dashed relative flex justify-center items-center overflow-hidden">
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
                      <CircularProgressbar
                        value={file.progress}
                        key={file.uploading ? 1 : 0}
                      />
                    </div>
                  </div>
                </>
              )}
            </HeadlessFileUpload.Trigger>

            <div className="w-96 flex justify-between">{fileField(file)}</div>
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
      {fileField}
    </HeadlessFileUpload>
  );
}

function fileField(file: CustomFile | undefined) {
  const chooseFile = (
    <HeadlessFileUpload.Trigger className="border px-3 py-2 rounded text-sm w-full flex font-semibold hover:bg-zinc-100 transition text-zinc-800">
      Choose file...
    </HeadlessFileUpload.Trigger>
  );

  if (file)
    return (
      <div className="border rounded text-sm w-full flex transition text-zinc-800 justify-between">
        <HeadlessFileUpload.Trigger className="flex-grow hover:bg-zinc-100 transition px-3 py-2 flex">
          {file.name}
        </HeadlessFileUpload.Trigger>
        <span className="border-r" />
        <button
          className="px-2 hover:bg-zinc-100 transition"
          onClick={file.reset}
        >
          <RemoveIcon className="w-4 text-red-600" />
        </button>
      </div>
    );

  return chooseFile;
}
