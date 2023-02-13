import { useState } from "react";
import styles from "./index.module.css";

export default function Page() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any[]>();

  async function onSubmit(event) {
    event.preventDefault();
    try {
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
    }
  }

  return (
    <main className={styles.main}>
      <h3>Modify the sentence</h3>
      <textarea
        rows={4}
        cols={60}
        placeholder="Enter a sentence"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input type="button" value="Submit" onClick={onSubmit} />
      <div className={styles.result}>
        {result && result.map(({ text }) => <div key={text}>{text}</div>)}
      </div>
    </main>
  );
}
