import { useState } from "react";
import { Input, List, Button, Space, Alert, Tag } from "antd";
import { fetcher } from "../utils/fetcher";
import CopyButton from "../components/CopyButton";

const { TextArea } = Input;

type ApiType = "completion" | "edit";
type TagType =
  | "fix-grammar"
  | "correction"
  | "native"
  | "translation"
  | "casual"
  | "business";

// support color: https://ant.design/components/tag
const TagColorMap: Record<TagType | ApiType, string> = {
  completion: "default",
  edit: "default",
  "fix-grammar": "volcano",
  correction: "gold",
  native: "geekblue",
  translation: "purple",
  casual: "cyan",
  business: "orange",
  // temp: 'magenta',
};

export default function Page() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<
    { text: string; tags: (TagType | ApiType)[] }[]
  >([]);

  async function sendRequest({
    type,
    text,
    instruction,
    tags = [],
  }: {
    type: ApiType;
    text: string;
    instruction?: string;
    tags?: TagType[];
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
        ...data.result.map(({ text }) => ({ text, tags: [...tags, type] })),
      ]);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading((cur) => cur - 1);
    }
  }

  function handelSubmit() {
    setResult([]);
    sendRequest({
      type: "edit",
      text,
      instruction: "文法の間違いを直す",
      tags: ["correction"],
    });
    sendRequest({
      type: "completion",
      text: `文法の間違いを直す:\n\n${text}`,
      tags: ["correction"],
    });
    sendRequest({
      type: "completion",
      text: `日常的な会話にする:\n\n${text}`,
      tags: ["native"],
    });
    sendRequest({
      type: "edit",
      text,
      instruction: "日常的な会話にする",
      tags: ["native"],
    });
    sendRequest({
      type: "completion",
      text: `敬語を使わない:\n\n${text}`,
      tags: ["casual"],
    });
    sendRequest({
      type: "edit",
      text,
      instruction: "敬語を使わない",
      tags: ["casual"],
    });
    sendRequest({
      type: "completion",
      text: `ビジネスっぽい、丁寧にする:\n\n${text}`,
      tags: ["business"],
    });
    sendRequest({
      type: "edit",
      text,
      instruction: "ビジネスっぽい、丁寧にする",
      tags: ["business"],
    });
  }

  function handleEnter(e) {
    if (e.isTrusted && !e.shiftKey) {
      e.preventDefault();
      handelSubmit();
    }
  }

  function handleClear() {
    setResult([]);
  }

  return (
    <>
      <h1>日本語の文法</h1>
      <Space direction="vertical" style={{ display: "flex" }}>
        <TextArea
          size="large"
          placeholder="入力"
          autoSize={{ minRows: 4, maxRows: 6 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPressEnter={handleEnter}
        />
        <Space>
          <Button type="primary" loading={isLoading > 0} onClick={handelSubmit}>
            {isLoading ? "加載中" : "提出"}
          </Button>
        </Space>
        <List
          header={<h3>結果</h3>}
          footer={
            <Button danger onClick={handleClear}>
              リセット
            </Button>
          }
          bordered
          dataSource={result}
          renderItem={({ text, tags }) => {
            return (
              text && (
                <List.Item style={{ display: "flex" }}>
                  <CopyButton content={text} />
                  <p style={{ flex: 1, marginLeft: "20px" }}>{text}</p>
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
