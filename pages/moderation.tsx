import { useState } from "react";
import { Input, List, Button, Space, Alert, Slider } from "antd";
import { fetcher } from "../utils/fetcher";

const { TextArea } = Input;

export default function Page() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(0);
  const [error, setError] = useState("");

  function startFetching() {
    setIsLoading((cur) => cur + 1);
    setError("");
  }
  function finishFetching() {
    setIsLoading((cur) => cur - 1);
  }

  const [moderationResult, setModerationResult] = useState<
    Record<string, number>
  >({});
  async function getModeration() {
    try {
      startFetching();
      setModerationResult({});

      const data = await fetcher({
        method: "POST",
        path: "/api/moderation",
        body: { text },
      });

      setModerationResult(data.result?.[0]?.category_scores || {});
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      finishFetching();
    }
  }

  return (
    <>
      <h1>Modify the sentence</h1>
      <Space direction="vertical" style={{ display: "flex" }}>
        <TextArea
          size="large"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a sentence"
          autoSize={{ minRows: 4, maxRows: 8 }}
        />
        <Space>
          <Button type="primary" loading={!!isLoading} onClick={getModeration}>
            {isLoading ? "Loading" : "Moderation"}
          </Button>
        </Space>
        <List
          header={<h3>Moderation</h3>}
          bordered
          dataSource={Object.entries(moderationResult)}
          renderItem={([category, number]) => (
            <List.Item>
              <div
                style={{
                  width: "280px",
                  fontSize: "1.2rem",
                }}
              >
                {category}
              </div>
              <div style={{ flex: 1 }}>
                <Slider
                  marks={{
                    [number * 100]: (number * 100).toFixed(4),
                  }}
                  defaultValue={number * 100}
                  disabled
                />
              </div>
            </List.Item>
          )}
        />
        {error && (
          <Alert message="Error" description={error} type="error" showIcon />
        )}
      </Space>
    </>
  );
}
