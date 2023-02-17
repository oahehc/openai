import { useState } from "react";
import { Input, List, Button, Space, Alert } from "antd";
import { fetcher } from "../utils/fetcher";

const { TextArea } = Input;

export default function Page() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any[]>();

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
        <Button type="primary" loading={isLoading} onClick={getCompletion}>
          {isLoading ? "Loading" : "Completion"}
        </Button>
        <List
          header={<h3>Result</h3>}
          bordered
          dataSource={result}
          renderItem={(item) => <List.Item>{item.text}</List.Item>}
        />
        {error && (
          <Alert message="Error" description={error} type="error" showIcon />
        )}
      </Space>
    </>
  );
}
