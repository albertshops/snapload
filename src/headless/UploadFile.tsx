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

const Context = createContext<Context>(undefined as any);

export type FileUpload = {
  name: string;
  url: string;
  progress: number;
  uploading: boolean;
};

export function UploadFile<TResult>(props: {
  name?: string | undefined;
  url?: string | undefined;
  upload: (args: {
    file: File;
    onProgress: (progress: number) => void;
  }) => Promise<TResult>;
  onSuccess?: (result: TResult) => void;
  children: (file?: FileUpload) => React.ReactNode;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(props.url);
  const [name, setName] = useState(props.name);

  useEffect(() => {
    setName(props.name);
    setUrl(props.url);
  }, [props.name, props.url]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    if (event.target.files[0] == undefined) return;
    const file = event.target.files[0];

    setUrl(URL.createObjectURL(file));
    setName(file.name);
    setUploading(true);
    const result = await props.upload({ file, onProgress: setProgress });
    setUploading(false);
    setProgress(0);
    if (props.onSuccess) props.onSuccess(result);
  };

  const render = () => {
    if (name && url)
      return props.children({
        name,
        url,
        uploading,
        progress,
      });

    return props.children();
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
