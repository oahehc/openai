import type { NextApiRequest, NextApiResponse } from "next";
import { configuration, openai } from "../../utils/openAI";

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
    const result = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      // suffix: "",
      max_tokens: 30,
      temperature: 0.8,
      // top_p: 1,
      n: 3,
      best_of: 3,
      presence_penalty: 0,
      frequency_penalty: 0,
    });

    res.status(200).json({ result: result.data.choices });
  } catch (error) {
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
