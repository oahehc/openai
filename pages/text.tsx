import { useState } from "react";
import { Input, List, Button, Space, Alert, Tag, Badge } from "antd";
import { fetcher } from "../utils/fetcher";
import CopyButton from "../components/CopyButton";
import useCount from "../hooks/useCount";

const { TextArea } = Input;

type ApiType = "completion" | "edit";
type TagType = "correction" | "native" | "translation" | "casual";

// support color: https://ant.design/components/tag
const TagColorMap: Record<TagType | ApiType, string> = {
  completion: "default",
  edit: "default",
  correction: "gold",
  native: "geekblue",
  translation: "purple",
  casual: "cyan",
  // "fix-grammar": "volcano",
  // temp: 'orange',
  // temp: 'magenta',
};

export default function Page() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<
    { text: string; tags: (TagType | ApiType)[] }[]
  >([]);
  const { getCount, addCount, resetAll } = useCount();

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
        ...data.result.map(({ message }) => ({
          text: message.content,
          tags: [...tags, type],
        })),
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
    setResult([]);
    sendRequest({
      type: "completion",
      text: `Correct this to standard English: ${text}. The correct sentence is: `,
      tags: ["correction"],
    });
    sendRequest({
      type: "completion",
      text: `Make this sound more natural: ${text}. This sounds more natural: `,
      tags: ["native"],
    });
    sendRequest({
      type: "completion",
      text: `Make this sound less formal: ${text}. This sounds less formal: `,
      tags: ["casual"],
    });

    // sendRequest({
    //   type: "edit",
    //   text,
    //   instruction: "Fix the grammar mistakes",
    //   tags: ["correction"],
    // });
    // sendRequest({
    //   type: "edit",
    //   text,
    //   instruction: "Make it sound more natural",
    //   tags: ["native"],
    // });
    // sendRequest({
    //   type: "edit",
    //   text,
    //   instruction: "Make it sound less formal",
    //   tags: ["casual"],
    // });
  }

  function handleEnter(e) {
    if (e.isTrusted && !e.shiftKey) {
      e.preventDefault();
      handelSubmit();
    }
  }

  function handleClear() {
    setResult([]);
    resetAll();
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
          allowClear
          autoFocus
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
            <Button danger onClick={handleClear}>
              Clear
            </Button>
          }
          bordered
          dataSource={result}
          renderItem={({ text, tags }) => {
            return (
              text && (
                <List.Item style={{ display: "flex" }}>
                  <Badge count={getCount(`en-${tags.join("-")}`)}>
                    <CopyButton
                      content={text}
                      onClick={() => addCount(`en-${tags.join("-")}`)}
                    />
                  </Badge>
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
