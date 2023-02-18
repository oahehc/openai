import { useState } from "react";
import { Input, List, Button, Space, Alert } from "antd";
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
  function handelSubmit() {
    useCompletion(`Correct this to standard English:\n\n${text}`);
    useCompletion(`To make 「${text}」 close to native speaker, we can say:`);
    useEdit(text, "Fix the grammar mistakes");
  }

  function handleEnter(e) {
    if (e.isTrusted && !e.shiftKey) {
      e.preventDefault();
      handelSubmit();
    }
  }

  return (
    <>
      <h1>Grammar Check</h1>
      <Space direction="vertical" style={{ display: "flex" }}>
        <TextArea
          size="large"
          placeholder="Enter here"
          autoSize={{ minRows: 4, maxRows: 6 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPressEnter={handleEnter}
        />
        <Space>
          <Button type="primary" loading={isLoading > 0} onClick={handelSubmit}>
            {isLoading ? "Loading" : "Submit"}
          </Button>
          <Button loading={isLoading > 0} onClick={getTranslations}>
            {isLoading ? "Loading" : "Translate"}
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
        {error && (
          <Alert message="Error" description={error} type="error" showIcon />
        )}
      </Space>
    </>
  );
}
