type FetcherRequese = {
  path: string;
  method?: "POST" | "GET";
  body?: Record<string, any>;
};

export const fetcher = async ({
  method = "POST",
  path,
  body,
}: FetcherRequese) => {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
    },
    method,
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (response.status !== 200) {
    throw (
      data.error || new Error(`Request failed with status ${response.status}`)
    );
  }

  return data;
};
