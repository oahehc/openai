import Link from "next/link";

export default function Home() {
  return (
    <main>
      <ul>
        <li>
          <Link href="/pet">Generate pet name (tutorial)</Link>
        </li>
        <li>
          <Link href="/completion">Modify the sentences</Link>
        </li>
        <li>
          <Link href="/images">Generate images by text</Link>
        </li>
      </ul>
    </main>
  );
}
