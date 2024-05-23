import { v4 } from "uuid";
import { UploadFile as HeadlessUploadFile } from "./headless/UploadFile";
import { X as RemoveIcon } from "lucide-react";

type Result = {
  key: string;
  url: string;
};

type Props = {
  name?: string | undefined;
  url?: string | undefined;
  onSuccess?: (result: Result) => void;
  clear?: () => void;
};

export function FileField(props: Props) {
  return (
    <HeadlessUploadFile
      name={props.name}
      url={props.url}
      onSuccess={props.onSuccess}
      upload={async ({ file, onProgress }) => {
        const { key, url } = await emulatePresignedUrl(file.name);
        await emulateUploadFile(onProgress);
        return { key, url };
      }}
    >
      {(file) => {
        if (file == undefined) {
          return (
            <HeadlessUploadFile.Trigger className="border px-3 py-2 rounded text-sm w-full flex font-semibold hover:bg-zinc-100 transition text-zinc-800">
              Choose file...
            </HeadlessUploadFile.Trigger>
          );
        }

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
              onClick={props.clear}
            >
              <RemoveIcon className="w-4 text-red-600" />
            </button>
          </div>
        );
      }}
    </HeadlessUploadFile>
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
