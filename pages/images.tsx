import { useState } from "react";
import { Input, Image, Button, Space, Alert } from "antd";
import { fetcher } from "../utils/fetcher";

export default function Page() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");

  async function generateImages() {
    if (input) {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetcher({
          method: "POST",
          path: "/api/images",
          body: { text: input },
        });

        setResult(data.result.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function generateVariation() {
    if (selectedUrl) {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetcher({
          method: "POST",
          path: "/api/images_variation",
          body: { url: selectedUrl },
        });

        setResult((cur) => [...cur, ...data.result.data]);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <h1>Generate Images by text</h1>
      <Space direction="vertical" style={{ display: "flex" }}>
        <Input
          placeholder="type something"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="primary" loading={isLoading} onClick={generateImages}>
          {isLoading ? "Loading" : "Generate Images"}
        </Button>
        {selectedUrl && (
          <Button
            type="primary"
            loading={isLoading}
            onClick={generateVariation}
          >
            {isLoading ? "Loading" : "Generate Variation"}
          </Button>
        )}
        <div>
          {result.length > 0 &&
            result.map(({ url }) => (
              <Image
                key={url}
                src={url}
                width={url === selectedUrl ? 320 : 256}
                onClick={() => setSelectedUrl(url)}
                preview={false}
              />
            ))}
        </div>
        {error && (
          <Alert message="Error" description={error} type="error" showIcon />
        )}
      </Space>
    </>
  );
}
