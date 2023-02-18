import { createReadStream } from "node:fs";
import path from "node:path";
import { GENERATE_IMAGE_NUM, IMAGE_SIZE } from "../../utils/constants";
import { downloadFile } from "../../utils/file";
import { configuration, openai } from "../../utils/openAI";
import { apiErrorHandler } from "../../utils/apiErrorHandler";
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
      createReadStream(filePath) as any,
      GENERATE_IMAGE_NUM,
      IMAGE_SIZE
    );
    res.status(200).json({ result: response.data });
  } catch (error) {
    apiErrorHandler("/images_variation", res, error);
  }
}
