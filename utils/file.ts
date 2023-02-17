import { createWriteStream } from "node:fs";
import https from "node:https";

const TIME_OUT_MS = 20 * 1000;

export function downloadFile(url, filePath) {
  const file = createWriteStream(filePath);
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      console.log("downloading...");

      if (Date.now() - start > TIME_OUT_MS) {
        clearInterval(timer);
        reject(new Error("Download file timeout"));
      }
    }, 1000);

    // TODO: AbortController
    https.get(url, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        console.log("Download Completed");
        clearInterval(timer);
        file.close();
        resolve(null);
      });
    });
  });
}
