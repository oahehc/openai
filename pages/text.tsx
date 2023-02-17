import { useState } from "react";
import { Input, List, Button, Space, Alert, Slider } from "antd";
import { fetcher } from "../utils/fetcher";

const { TextArea } = Input;

export default function Page() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any[]>();

  async function getTranslations() {
    try {
      setIsLoading(true);
      setError("");

      const data = await fetcher({
        method: "POST",
        path: "/api/completion",
        body: {
          text: `Translate this into 1. Chinese, 2. Japanese:\n\n${text}\n\n`,
        },
      });

      setResult(data.result);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkGrammar() {
    try {
      setIsLoading(true);
      setError("");

      const data = await fetcher({
        method: "POST",
        path: "/api/completion",
        body: { text: `Correct this to standard English:\n\n${text}` },
      });

      setResult(data.result);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getCompletion() {
    try {
      setIsLoading(true);
      setError("");

      const data = await fetcher({
        method: "POST",
        path: "/api/completion",
        body: { text },
      });

      setResult(data.result);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function getEdit() {
    try {
      setIsLoading(true);
      setError("");

      const data = await fetcher({
        method: "POST",
        path: "/api/edit",
        body: { text },
      });

      setResult(data.result);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const [moderationResult, setModerationResult] = useState<
    Record<string, number>
  >({});
  async function getModeration() {
    try {
      setIsLoading(true);
      setError("");
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
      setIsLoading(false);
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
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
        <Space>
          <Button type="primary" loading={isLoading} onClick={getTranslations}>
            {isLoading ? "Loading" : "Translate"}
          </Button>
          <Button type="primary" loading={isLoading} onClick={checkGrammar}>
            {isLoading ? "Loading" : "Grammar"}
          </Button>
          <Button type="primary" loading={isLoading} onClick={getCompletion}>
            {isLoading ? "Loading" : "Completion"}
          </Button>
          <Button type="primary" loading={isLoading} onClick={getEdit}>
            {isLoading ? "Loading" : "Edit"}
          </Button>
          <Button type="primary" loading={isLoading} onClick={getModeration}>
            {isLoading ? "Loading" : "Moderation"}
          </Button>
        </Space>
        <List
          header={<h3>Result</h3>}
          bordered
          dataSource={result}
          renderItem={(item) => <List.Item>{item.text}</List.Item>}
        />
        {moderationResult && (
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
                      [number * 100]: number * 100,
                    }}
                    defaultValue={number * 100}
                    disabled
                  />
                </div>
              </List.Item>
            )}
          />
        )}
        {error && (
          <Alert message="Error" description={error} type="error" showIcon />
        )}
      </Space>
    </>
  );
}
