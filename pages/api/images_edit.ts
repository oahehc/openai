import { createReadStream } from "node:fs";
import path from "node:path";
import { GENERATE_IMAGE_NUM, IMAGE_SIZE } from "../../utils/constants";
import { downloadFile } from "../../utils/file";
import { configuration, openai } from "../../utils/openAI";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const { url, text } = req.body;
  if (!url || url.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid url",
      },
    });
    return;
  }
  if (!text || text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      },
    });
    return;
  }

  try {
    const directory = path.join(process.cwd(), "temp");
    const filePath = `${directory}/file.jpg`;
    await downloadFile(url, filePath);
    // FIXME: PNG file only
    const response = await openai.createImageEdit(
      createReadStream(filePath) as any,
      createReadStream(filePath) as any,
      text,
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
