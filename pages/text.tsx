import { useState } from "react";
import { Input, List, Button, Space, Alert, Tag } from "antd";
import { fetcher } from "../utils/fetcher";
import CopyButton from "../components/CopyButton";

const { TextArea } = Input;

type TagType = "fix-grammar" | "correction" | "native" | "translation";
// support color: https://ant.design/components/tag
const TagColorMap: Record<TagType, string> = {
  "fix-grammar": "magenta",
  correction: "gold",
  native: "geekblue",
  translation: "volcano",
  // temp: 'orange',
  // temp: 'cyan',
  // temp: 'purple',
};

export default function Page() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any[]>([]);

  async function sendRequest({
    type,
    text,
    instruction,
    tags = [],
  }: {
    type: "completion" | "edit";
    text: string;
    tags?: TagType[];
    instruction?: string;
  }) {
    try {
      setIsLoading((cur) => cur + 1);
      setError("");

      const data = await fetcher({
        method: "POST",
        path: `/api/${type}`,
        body: {
          text,
          instruction: type === "edit" && instruction ? instruction : "",
        },
      });

      setResult((cur) => [
        ...cur,
        ...data.result.map(({ text }) => ({ text, tags })),
      ]);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading((cur) => cur - 1);
    }
  }

  function getTranslations() {
    sendRequest({
      type: "completion",
      text: `Translate this into 1. Chinese, 2. Japanese:\n\n${text}\n\n`,
      tags: ["translation"],
    });
  }
  function handelSubmit() {
    sendRequest({
      type: "completion",
      text: `Correct this to standard English:\n\n${text}`,
      tags: ["correction"],
    });
    sendRequest({
      type: "completion",
      text: `To make 「${text}」 close to native speaker, we can say:`,
      tags: ["native"],
    });
    sendRequest({
      type: "edit",
      text,
      instruction: "Fix the grammar mistakes",
      tags: ["fix-grammar"],
    });
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
          renderItem={({ text, tags }) => {
            return (
              text && (
                <List.Item style={{ display: "flex" }}>
                  <CopyButton content={text} />
                  <p style={{ flex: 1, marginLeft: "8px" }}>{text}</p>
                  {tags.map((tag) => (
                    <Tag key={tag} color={TagColorMap[tag]}>
                      {tag}
                    </Tag>
                  ))}
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
