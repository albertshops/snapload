import { v4 } from "uuid";
import {
  ComponentProps,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

type Context = {
  ref: React.RefObject<HTMLInputElement>;
};

type FileUpload = {
  name: string;
  url: string;
  progress: number;
  uploading: boolean;
  file: File;
};

const Context = createContext<Context>(undefined as any);

export default function UploadFiles<TResult>(props: {
  upload: (args: {
    file: File;
    onProgress: (progress: number) => void;
  }) => Promise<TResult>;
  onSuccess?: (result: TResult) => void;
  onStart?: () => void;
  onEnd?: () => void;
  children: (uploads: FileUpload[]) => React.ReactNode;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<Record<string, FileUpload>>({});

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    if (event.target.files.length < 1) return;

    const files = Array.from(event.target.files);

    const uploads: Record<string, FileUpload> = {};
    for (const file of files) {
      const uuid = v4();
      uploads[uuid] = {
        url: URL.createObjectURL(file),
        name: file.name,
        uploading: true,
        progress: 0,
        file,
      };
    }
    setUploads(uploads);

    if (props.onStart) props.onStart();
    await Promise.all(
      Object.entries(uploads).map(async ([uuid, upload]) => {
        await props.upload({
          file: upload.file,
          onProgress: (progress) => {
            setUploads((uploads) => ({
              ...uploads,
              [uuid]: {
                ...uploads[uuid],
                progress,
              },
            }));
          },
        });

        setUploads((uploads) => ({
          ...uploads,
          [uuid]: {
            ...uploads[uuid],
            uploading: false,
          },
        }));
      }),
    );

    if (props.onEnd) props.onEnd();
  };

  return (
    <Context.Provider value={{ ref }}>
      {props.children(Object.values(uploads))}
      <input
        type="file"
        ref={ref}
        style={{ display: "none" }}
        onChange={handleChange}
        multiple
      />
    </Context.Provider>
  );
}

UploadFiles.Trigger = function Trigger(props: ComponentProps<"button">) {
  const { ref } = useContext(Context);
  return (
    <button {...props} onClick={() => ref.current?.click()}>
      {props.children}
    </button>
  );
};
