import { useState } from "react";
import { Input, List, Button, Space } from "antd";

const { TextArea } = Input;

export default function Page() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any[]>();

  async function onSubmit() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1>Modify the sentence</h1>
      <Space direction="vertical" style={{ display: "flex" }}>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a sentence"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
        <Button type="primary" loading={isLoading} onClick={onSubmit}>
          {isLoading ? "Loading" : "Submit"}
        </Button>
        <List
          header={<h3>Result</h3>}
          bordered
          dataSource={result}
          renderItem={(item) => <List.Item>{item.text}</List.Item>}
        />
      </Space>
    </>
  );
}
