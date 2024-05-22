import { PropsWithChildren, useState } from "react";
import HeadlessUploadFile, { type CustomFile } from "./HeadlessUploadFile";
import { Button } from "./components/ui/button";
import { cn } from "./utils";
import { X as RemoveIcon } from "lucide-react";

type Props = {
  keyName?: string | undefined;
  onFileChange?: (file: File | undefined) => void;
  onUploadComplete?: (keyName: string) => void;
  className?: string;
};

function Overlay(props: PropsWithChildren<{ visible: boolean }>) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-zinc-100/50 flex justify-center items-center transition opacity-0 pointer-events-none",
        { "opacity-100": props.visible },
      )}
    >
      {props.children}
    </div>
  );
}

export function ImageField(props: {
  keyName?: string | undefined;
  onFileChange?: (file: File | undefined) => void;
  onUploadComplete?: (keyName: string) => void;
  className?: string;
}) {
  const [hover, setHover] = useState(false);

  return (
    <HeadlessUploadFile
      keyName={props.keyName}
      onFileChange={props.onFileChange}
      onUploadComplete={props.onUploadComplete}
    >
      {(file) => {
        return (
          <div className="flex flex-col gap-1">
            <HeadlessUploadFile.Trigger
              className={cn(
                "w-96 aspect-video rounded border relative flex justify-center items-center overflow-hidden",
                { "border-dashed": file == undefined },
              )}
            >
              {file == undefined ? (
                <Button>Upload image</Button>
              ) : (
                <>
                  <img
                    className="object-cover absolute h-full w-full"
                    src={file.blobUrl}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  />

                  <Overlay visible={file.uploading && file.progress < 100}>
                    <LoadingSpinner />
                  </Overlay>

                  <Overlay visible={hover}>
                    <Button>Change image</Button>
                  </Overlay>
                </>
              )}
            </HeadlessUploadFile.Trigger>

            <div className="w-96 flex justify-between">{fileField(file)}</div>
          </div>
        );
      }}
    </HeadlessUploadFile>
  );
}

export function FileField(props: Props) {
  return (
    <HeadlessUploadFile
      keyName={props.keyName}
      onFileChange={props.onFileChange}
      onUploadComplete={props.onUploadComplete}
    >
      {fileField}
    </HeadlessUploadFile>
  );
}

function fileField(file: CustomFile | undefined) {
  const chooseFile = (
    <HeadlessUploadFile.Trigger className="border px-3 py-2 rounded text-sm w-full flex font-semibold hover:bg-zinc-100 transition text-zinc-800">
      Choose file...
    </HeadlessUploadFile.Trigger>
  );

  if (file)
    return (
      <div className="border rounded text-sm w-full flex transition text-zinc-800 justify-between overflow-hidden">
        <HeadlessUploadFile.Trigger className="flex-grow hover:bg-zinc-100 transition relative">
          <div className="px-3 py-2 flex">{file.name}</div>
          {file.uploading && (
            <div
              className="h-0.5 bg-primary absolute bottom-0 left-0 transition w-full origin-left"
              style={{ transform: `scaleX(${file.progress / 100})` }}
            />
          )}
        </HeadlessUploadFile.Trigger>
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

function LoadingSpinner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  );
}
