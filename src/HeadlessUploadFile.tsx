import { v4 } from "uuid";
import {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Context = {
  ref: React.RefObject<HTMLInputElement>;
};

export type CustomFile = {
  name: string;
  uuid: string;
  progress: number;
  uploading: boolean;
  blobUrl: string;
};

const Context = createContext<Context>(undefined as any);

export default function UploadFile(props: {
  keyName?: string | undefined;
  onFileChange?: (file: File | undefined) => void;
  onUploadComplete?: (keyName: string) => void;
  children: (args: {
    file: CustomFile | undefined;
    reset: () => void;
  }) => React.ReactNode;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string>();
  const [uuid, setUuid] = useState<string>();
  const [name, setName] = useState<string>();

  const reset = () => {
    const [uuid, name] = props.keyName?.split("/") ?? [undefined, undefined];
    setUuid(uuid);
    setName(name);
    setProgress(0);
    setUploading(false);
    setBlobUrl(undefined);
  };

  useEffect(reset, [props.keyName]);

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
    setProgress(0);
    await emulateUploadFile((progress) => setProgress(progress));
    setUploading(false);

    if (props.onUploadComplete) {
      const keyName = `${v4()}/${file.name}`;
      props.onUploadComplete(keyName);
    }
  };

  const render = () => {
    if (blobUrl && uuid && name)
      return props.children({
        file: {
          uuid,
          name,
          uploading,
          progress,
          blobUrl,
        },
        reset,
      });
    return props.children({ file: undefined, reset });
  };

  return (
    <Context.Provider value={{ ref }}>
      {render()}
      <input
        type="file"
        ref={ref}
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </Context.Provider>
  );
}

UploadFile.Trigger = function Trigger(props: ComponentProps<"button">) {
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