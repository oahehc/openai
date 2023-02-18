import React, { useState } from "react";
import { CopyFilled, CopyOutlined } from "@ant-design/icons";

type Props = {
  content: string;
  onClick?: () => void;
};

const CopyButton = ({ content, onClick }: Props) => {
  const [copySuccess, setCopySuccess] = useState(false);

  function copyText() {
    setCopySuccess(false);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).then(
        function () {
          setCopySuccess(true);
          setTimeout(() => {
            setCopySuccess(false);
          }, 3000);
        },
        function () {
          console.error("copy fail");
        }
      );
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }

    if (onClick) onClick();
  }

  return (
    <div onClick={copyText} style={{ cursor: "pointer", fontSize: "2rem" }}>
      {copySuccess ? <CopyFilled /> : <CopyOutlined />}
    </div>
  );
};

export default CopyButton;
