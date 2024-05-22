import { useState } from "react";
import FileUpload from "./FileUpload";

function App() {
  const [value, setValue] = useState<string>();
  console.log({ value });

  return (
    <div className="p-10">
      <FileUpload
        keyName={value}
        onUploadComplete={(keyName) => setValue(keyName)}
        onFileChange={console.log}
      >
        {(file) => {
          if (file == undefined)
            return <FileUpload.Trigger>nothing</FileUpload.Trigger>;

          if (file.uploading == false)
            return <FileUpload.Trigger>nothing</FileUpload.Trigger>;

          return (
            <div>
              <p>uploading: {file.uploading ? "yes" : "no"}</p>
              <p>progress: {file.progress}</p>
              <FileUpload.Trigger>
                <img src={file.blobUrl} className="h-40 w-40" />
                keyName: {file.uuid}/{file.name}
              </FileUpload.Trigger>
            </div>
          );
        }}
      </FileUpload>

      <button onClick={() => setValue("id/name.jpg")}>change</button>
      <button onClick={() => setValue(undefined)}>clear</button>
    </div>
  );
}

export default App;
