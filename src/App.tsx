import { v4 } from "uuid";
import { UploadFile } from "./HeadlessUploadFile";

export default function App() {
  return (
    <UploadFile
      name="name"
      url="url"
      upload={async ({ file, onProgress }) => {
        const { url, key } = emulatePresigned(file.name);
        await emulateUploadFile(onProgress);
        return { key, url };
      }}
      onSuccess={(file) => {
        console.log(file);
      }}
    >
      {({ meta }) => {
        if (meta == undefined)
          return <UploadFile.Trigger>choose file</UploadFile.Trigger>;

        return (
          <>
            <pre>{JSON.stringify(meta, null, 2)}</pre>
            <UploadFile.Trigger>choose file</UploadFile.Trigger>
          </>
        );
      }}
    </UploadFile>
  );
}

function emulatePresigned(filename: string) {
  return {
    key: `${v4()}/${filename}`,
    url: "http://blahblah",
  };
}

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
