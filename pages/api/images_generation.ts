import { GENERATE_IMAGE_NUM, IMAGE_SIZE } from "../../utils/constants";
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

  const text = req.body.text || "";
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      },
    });
    return;
  }

  try {
    const response = await openai.createImage({
      prompt: text,
      n: GENERATE_IMAGE_NUM,
      size: IMAGE_SIZE,
    });
    res.status(200).json({ result: response.data });
  } catch (error) {
    apiErrorHandler("/images_generation", res, error);
  }
}
