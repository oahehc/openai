import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Page() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    if (input) {
      try {
        const response = await fetch("/api/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: input }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }

        setResult(data.result.data);
        setInput("");
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI API</title>
      </Head>
      <main className={styles.main}>
        <h3>Generate Images</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="type something" />
        </form>
        <div className={styles.result}>
          {result.length > 0 &&
            result.map(({ url }) => (
              <img key={url} src={url} width={128} height={128} atl="img" />
            ))}
        </div>
      </main>
    </div>
  );
}
