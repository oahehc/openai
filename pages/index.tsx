import Link from "next/link";
import { List } from "antd";

const links = [
  {
    path: "/text",
    description: "Text completion and editing",
  },
  {
    path: "/images",
    description: "Text to Images",
  },
  {
    path: "/pet",
    description: "Generate pet name (tutorial)",
  },
];

export default function Home() {
  return (
    <main>
      <List
        bordered
        dataSource={links}
        renderItem={({ path, description }) => (
          <List.Item>
            <Link href={path}>{description}</Link>
          </List.Item>
        )}
      />
    </main>
  );
}
