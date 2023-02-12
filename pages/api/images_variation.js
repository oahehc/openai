import { Configuration, OpenAIApi } from "openai";
import { createReadStream, createWriteStream } from "node:fs";
import path from "node:path";
import https from "node:https";
import { GENERATE_IMAGE_NUM, IMAGE_SIZE } from "./constants";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const url = req.body.url || "";
  if (url.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid url",
      },
    });
    return;
  }

  try {
    const directory = path.join(process.cwd(), "temp");
    const filePath = `${directory}/file.jpg`;
    await downloadFile(url, filePath);
    const response = await openai.createImageVariation(
      createReadStream(filePath),
      GENERATE_IMAGE_NUM,
      IMAGE_SIZE
    );
    res.status(200).json({ result: response.data });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

const TIME_OUT_MS = 10 * 1000;

function downloadFile(url, filePath) {
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
