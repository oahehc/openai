import type { NextApiRequest, NextApiResponse } from "next";
import { configuration, openai } from "../../utils/openAI";
import { apiErrorHandler } from "../../utils/apiErrorHandler";

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
    const result = await openai.createModeration({
      input: text,
    });

    res.status(200).json({ result: result.data.results });
  } catch (error) {
    apiErrorHandler("/moderation", res, error);
  }
}
