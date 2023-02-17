import { useState } from "react";
import { Input, Image, Button, Space } from "antd";

export default function Page() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");

  async function generateImages() {
    if (input) {
      try {
        setIsLoading(true);
        const response = await fetch("/api/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: input }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }

        setResult(data.result.data);
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function generateVariation() {
    if (selectedUrl) {
      try {
        setIsLoading(true);
        const response = await fetch("/api/images_variation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: selectedUrl }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }

        setResult((cur) => [...cur, ...data.result.data]);
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
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
      </Space>
    </>
  );
}
