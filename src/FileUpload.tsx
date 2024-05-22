import { v4 } from "uuid";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Context = {
  name: string | undefined;
  uuid: string | undefined;
  ref: React.RefObject<HTMLInputElement>;
  progress: number;
  uploading: boolean;
  blobUrl: string | undefined;
};

const Context = createContext<Context>(undefined as any);

export default function FileUpload(
  props: PropsWithChildren<{
    keyName: string | undefined;
    onFileChange?: (file: File | undefined) => void;
    onUploadComplete?: (keyName: string) => void;
  }>,
) {
  const ref = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string>();
  const [uuid, setUuid] = useState<string>();
  const [name, setName] = useState<string>();

  useEffect(() => {
    console.log("kn", props.keyName);
    const [uuid, name] = props.keyName?.split("/") ?? [undefined, undefined];
    setUuid(uuid);
    setName(name);
    setProgress(0);
    setUploading(false);
    setBlobUrl(undefined);
  }, [props.keyName]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    if (event.target.files[0] == undefined) return;
    const file = event.target.files[0];
    if (props.onFileChange) props.onFileChange(file);

    const uuid = v4();

    setUuid(uuid);
    setName(file.name);
    setBlobUrl(URL.createObjectURL(file));
    setUploading(true);
    await emulateFileUpload((progress) => setProgress(progress));
    setUploading(false);

    if (props.onUploadComplete) {
      const keyName = `${v4()}/${file.name}`;
      props.onUploadComplete(keyName);
    }
  };

  return (
    <Context.Provider value={{ uuid, name, ref, progress, uploading, blobUrl }}>
      {props.children}
      <input
        type="file"
        ref={ref}
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </Context.Provider>
  );
}

FileUpload.Trigger = function Trigger(props: PropsWithChildren) {
  const { ref } = useContext(Context);

  return (
    <button
      onClick={() => {
        ref.current?.click();
      }}
    >
      {props.children}
    </button>
  );
};

FileUpload.Empty = function Empty(props: PropsWithChildren) {
  const { uuid } = useContext(Context);
  if (uuid != undefined) return <></>;
  return props.children;
};

FileUpload.File = function File(props: {
  children: (args: {
    [K in keyof Pick<
      Context,
      "progress" | "uploading" | "uuid" | "name" | "blobUrl"
    >]-?: NonNullable<Context[K]>;
  }) => React.ReactNode;
}) {
  const { blobUrl, uuid, name, uploading, progress } = useContext(Context);
  if (uuid == undefined) return <></>;
  if (name == undefined) return <></>;

  return props.children({ uuid, name, uploading, progress, blobUrl: blobUrl! });
};

function emulateFileUpload(
  onProgress: (percentage: number) => void,
): Promise<void> {
  return new Promise((resolve) => {
    let percentage = 0;

    const interval = setInterval(() => {
      percentage += 10;
      onProgress(percentage);

      if (percentage >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
}
