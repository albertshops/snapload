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

type CustomFile = {
  name: string;
  uuid: string;
  progress: number;
  uploading: boolean;
  blobUrl: string;
  keyName: string;
};

const Context = createContext<Context>(undefined as any);

export default function UploadFiles(props: {
  onFilesChange?: (fileList: FileList) => void;
  onUploadComplete?: (keyName: string) => void;
  onUploadsComplete?: (keyNames: string[]) => void;
  children: (files: CustomFile[]) => React.ReactNode;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Record<string, CustomFile>>({});

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    if (event.target.files.length < 1) return;

    if (props.onFilesChange) props.onFilesChange(event.target.files);

    const customFiles: Record<string, CustomFile> = {};
    for (const file of event.target.files) {
      const uuid = v4();
      customFiles[uuid] = {
        uuid,
        name: file.name,
        progress: 0,
        uploading: true,
        blobUrl: URL.createObjectURL(file),
        keyName: `${uuid}/${file.name}`,
      };
    }

    setFiles(customFiles);

    await Promise.all(
      Object.values(customFiles).map(async (file) => {
        await emulateUploadFile((progress) => {
          setFiles((files) => ({
            ...files,
            [file.uuid]: {
              ...files[file.uuid],
              progress,
            },
          }));
        });

        setFiles((files) => ({
          ...files,
          [file.uuid]: {
            ...files[file.uuid],
            uploading: false,
          },
        }));

        if (props.onUploadComplete) {
          props.onUploadComplete(file.keyName);
        }
      }),
    );

    if (props.onUploadsComplete) {
      props.onUploadsComplete(Object.values(customFiles).map((f) => f.keyName));
    }
  };

  return (
    <Context.Provider value={{ ref }}>
      {props.children(Object.values(files))}
      <input
        type="file"
        ref={ref}
        style={{ display: "none" }}
        onChange={handleChange}
        multiple
      />

      <pre className="hidden">{JSON.stringify(files, null, 2)}</pre>
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
