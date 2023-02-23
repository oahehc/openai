import { useState } from "react";
import { Input, Image, Button, Space, Alert, Select } from "antd";
import { fetcher } from "../utils/fetcher";

const artists = [
  "Leonardo da Vinci",
  "Pablo Picasso",
  "Michelangelo",
  "Claude Monet",
  "Rembrandt Van Rijn",
  "Frida Kahlo",
  "Salvador Dali",
  "Johannes Vermeer",
  "Pierre-Auguste Renoir",
].map((v) => ({
  value: v,
  label: v,
}));

export default function Page() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [selectedArtist, setArtist] = useState("");

  async function generateImages() {
    if (input) {
      try {
        setIsLoading(true);
        setError("");

        let text = input;
        if (selectedArtist) {
          text = `${text} in style of ${selectedArtist}`;
        }

        const data = await fetcher({
          method: "POST",
          path: "/api/images_generation",
          body: { text },
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
  function handleEnter(e) {
    if (e.isTrusted && !e.shiftKey) {
      e.preventDefault();
      generateImages();
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
          onPressEnter={handleEnter}
        />
        <Space>
          <span>in style of</span>
          <Select
            style={{ width: 240 }}
            onChange={setArtist}
            options={artists}
          />
        </Space>
        <Space>
          <Button type="primary" loading={isLoading} onClick={generateImages}>
            {isLoading ? "Loading" : "Generate Images"}
          </Button>
          {selectedUrl && (
            <Button loading={isLoading} onClick={generateVariation}>
              {isLoading ? "Loading" : "Generate Variation"}
            </Button>
          )}
        </Space>
        <div>
          {result.length > 0 &&
            result.map(({ url }) => (
              <Image
                key={url}
                src={url}
                width={256}
                preview={false}
                onClick={() => setSelectedUrl(url)}
                style={
                  url === selectedUrl
                    ? {
                        transform: "scale(1.25)",
                        zIndex: 1,
                        position: "relative",
                      }
                    : { cursor: "pointer" }
                }
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
