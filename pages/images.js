import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Page() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");

  async function generateImages(event) {
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
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    }
  }

  async function generateVariation(event) {
    event.preventDefault();
    if (selectedUrl) {
      try {
        const response = await fetch("/api/images_variation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: selectedUrl }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }

        setResult((cur) => [...cur, ...data.result.data]);
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
        <h3>Generate Images by text</h3>
        <input
          type="text"
          name="text"
          placeholder="type something"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input type="button" value="Generate Images" onClick={generateImages} />
        {selectedUrl && (
          <input
            type="button"
            value="Generate Variation"
            onClick={generateVariation}
          />
        )}
        <div className={styles.result}>
          {result.length > 0 &&
            result.map(({ url }) => (
              <img
                key={url}
                src={url}
                width={128}
                height={128}
                atl="img"
                onClick={() => setSelectedUrl(url)}
                className={url === selectedUrl ? styles.selectedImage : ""}
              />
            ))}
        </div>
      </main>
    </div>
  );
}
