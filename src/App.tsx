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
        <Trigger>click me</Trigger>
        <Value>{(value) => <div>value: {value}</div>}</Value>
      </Root>
    </div>
  );
}

export default App;

// fileIds will be <uuid>/<file-name>

type Context = {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  ref: React.RefObject<HTMLInputElement>;
};

const Context = createContext<Context>(undefined as any);

function Root(
  props: PropsWithChildren<{
    value: string | undefined;
    onChange: (value: string | undefined) => void;
  }>,
) {
  const value = props.value;
  const setValue = props.onChange;
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    if (event.target.files[0] == undefined) return;
    const file = event.target.files[0];
    const fileKey = `${v4()}/${file.name}`;
    setValue(fileKey);
  };

  return (
    <Context.Provider value={{ value, setValue, ref }}>
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

function Value(props: {
  children: (value: string | undefined) => React.ReactNode;
}) {
  const { value } = useContext(Context);
  return props.children(value);
}

function FileList() {}

function FileItem() {}
