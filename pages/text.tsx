import { useState } from "react";
import { Input, List, Button, Space, Alert, Slider } from "antd";
import { fetcher } from "../utils/fetcher";
import CopyButton from "../components/CopyButton";

const { TextArea } = Input;

export default function Page() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any[]>([]);

  function startFetching() {
    setIsLoading((cur) => cur + 1);
    setError("");
  }
  function finishFetching() {
    setIsLoading((cur) => cur - 1);
  }

  async function useCompletion(text) {
    try {
      startFetching();

      const data = await fetcher({
        method: "POST",
        path: "/api/completion",
        body: {
          text,
        },
      });

      setResult((cur) => [...cur, ...data.result]);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      finishFetching();
    }
  }
  async function useEdit(text, instruction) {
    try {
      startFetching();

      const data = await fetcher({
        method: "POST",
        path: "/api/edit",
        body: {
          text,
          instruction,
        },
      });

      setResult((cur) => [...cur, ...data.result]);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      finishFetching();
    }
  }

  function getTranslations() {
    useCompletion(
      `Translate this into 1. Chinese, 2. Japanese:\n\n${text}\n\n`
    );
  }
  function checkGrammar() {
    useCompletion(`Correct this to standard English:\n\n${text}`);
    useCompletion(`To make 「${text}」 close to native speaker, we can say:`);
    useEdit(text, "Fix the grammar mistakes");
  }
  function getCompletion() {
    useCompletion(text);
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
          <Button type="primary" loading={!!isLoading} onClick={checkGrammar}>
            {isLoading ? "Loading" : "Grammar"}
          </Button>
          <Button
            type="primary"
            loading={!!isLoading}
            onClick={getTranslations}
          >
            {isLoading ? "Loading" : "Translate"}
          </Button>
          <Button type="primary" loading={!!isLoading} onClick={getCompletion}>
            {isLoading ? "Loading" : "Completion"}
          </Button>
          <Button type="primary" loading={!!isLoading} onClick={getModeration}>
            {isLoading ? "Loading" : "Moderation"}
          </Button>
        </Space>
        <List
          header={<h3>Result</h3>}
          footer={
            <Button danger onClick={() => setResult([])}>
              reset
            </Button>
          }
          bordered
          dataSource={result}
          renderItem={({ text }) => {
            return (
              text && (
                <List.Item style={{ display: "flex" }}>
                  <CopyButton content={text} />
                  <p style={{ flex: 1, marginLeft: "8px" }}>{text}</p>
                </List.Item>
              )
            );
          }}
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
                      [number * 100]: (number * 100).toFixed(4),
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
