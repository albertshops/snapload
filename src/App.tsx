import { useState } from "react";
import { FileField } from "./UploadFile";

export default function App() {
  const [name, setName] = useState<string>();
  const [url, setUrl] = useState<string>();

  return (
    <div className="p-10">
      <FileField
        name={name}
        url={url}
        onSuccess={({ key, url }) => {
          const name = key.split("/")[1];
          setName(name);
          setUrl(url);
        }}
        clear={() => {
          setName(undefined);
          setUrl(undefined);
        }}
      />
    </div>
  );
}
