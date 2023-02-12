import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>OpenAI API</title>
      </Head>
      <main>
        <ul>
          <li>
            <Link href="/pet">Generate pet name (tutorial)</Link>
          </li>
          <li>
            <Link href="/images">Generate images by text</Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
