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

  const { text, instruction } = req.body;
  if (!text || text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      },
    });
    return;
  }
  if (!instruction || instruction.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      },
    });
    return;
  }

  try {
    const result = await openai.createEdit({
      model: "gpt-3.5-turbo",
      input: text,
      instruction,
      n: 1,
      temperature: 0.9,
      // top_p: 1,
    });

    res.status(200).json({ result: result.data.choices });
  } catch (error) {
    apiErrorHandler("/edit", res, error);
  }
}
