import type { NextApiResponse } from "next";

export function apiErrorHandler(path: string, res: NextApiResponse, error) {
  if (error.response) {
    console.error(`[${path}]`, error.response.status, error.response.data);
    res.status(error.response.status).json(error.response.data);
  } else {
    console.error(
      `[${path}]`,
      `Error with OpenAI API request: ${error.message}`
    );
    res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
