import { useState } from "react";
import { ImageField } from "./ImageField";

export default function App() {
  const [name, setName] = useState<string>();
  const [url, setUrl] = useState<string>();
  return (
    <div className="p-10">
      <ImageField
        name={name}
        url={url}
        onSuccess={(result) => {
          const name = result.key.split("/")[1];
          setName(name);
          setUrl(result.url);
        }}
        clear={() => {
          setName(undefined);
          setUrl(undefined);
        }}
      />
    </div>
  );
}
