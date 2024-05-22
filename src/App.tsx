import { v4 } from "uuid";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

function App() {
  const [value, setValue] = useState<string>();

  return (
    <div className="p-10">
      <Root value={value} onChange={setValue}>
        <File>
          {(file) => {
            if (file.name == undefined) return <Trigger>nothing</Trigger>;
            return (
              <div>
                <p>uploading: {file.uploading ? "yes" : "no"}</p>
                <p>progress: {file.progress}</p>
                <Trigger>
                  keyName: {file.uuid}/{file.name}
                </Trigger>
              </div>
            );
          }}
        </File>
      </Root>

      <button onClick={() => setValue("id/name.jpg")}>change</button>
    </div>
  );
}

export default App;

type Context = {
  name: string | undefined;
  uuid: string | undefined;
  setKeyName: (keyName: string | undefined) => void;
  ref: React.RefObject<HTMLInputElement>;
  progress: number;
  uploading: boolean;
};

const Context = createContext<Context>(undefined as any);

function Root(
  props: PropsWithChildren<{
    value: string | undefined;
    onChange: (value: string | undefined) => void;
  }>,
) {
  const [uuid, name] = props.value?.split("/") ?? [undefined, undefined];

  const setKeyName = props.onChange;
  const ref = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    if (event.target.files[0] == undefined) return;
    const file = event.target.files[0];
    const keyName = `${v4()}/${file.name}`;

    setKeyName(keyName);

    setUploading(true);
    await emulateFileUpload((progress) => setProgress(progress));
    setUploading(false);
  };

  return (
    <Context.Provider
      value={{ uuid, name, setKeyName, ref, progress, uploading }}
    >
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

function Trigger(props: PropsWithChildren) {
  const { ref } = useContext(Context);

  return (
    <>
      <button
        onClick={() => {
          ref.current?.click();
        }}
      >
        {props.children}
      </button>
    </>
  );
}

function File(props: {
  children: (
    args: Pick<Context, "progress" | "uploading" | "uuid" | "name">,
  ) => React.ReactNode;
}) {
  const { uuid, name, uploading, progress } = useContext(Context);
  return props.children({ uuid, name, uploading, progress });
}

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
    }, 200); // 200ms interval to simulate a 2-second upload time
  });
}
