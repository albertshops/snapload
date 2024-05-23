import { useState } from "react";
import { ImageField } from "./ImageField";
import { FileField } from "./FileField";

export default function App() {
  const [name, setName] = useState<string>();
  const [url, setUrl] = useState<string>();
  return (
    <div className="p-10 flex flex-col gap-4">
      <ImageField
        imgClassName="aspect-square"
        containerClassName="w-96"
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

      <FileField containerClassName="w-96" />
    </div>
  );
}
