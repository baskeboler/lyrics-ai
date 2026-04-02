import { useEffect, useRef, useState } from "react";

type CopyToClipboardButtonProps = {
  text: string;
  className?: string;
};

export function CopyToClipboardButton({ text, className = "" }: CopyToClipboardButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const queueReset = () => {
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
      resetTimeoutRef.current = null;
    }, 1600);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      queueReset();
    } catch {
      setStatus("error");
      queueReset();
    }
  };

  const label = status === "copied" ? "Copied" : status === "error" ? "Failed" : "Copy";

  return (
    <button
      aria-label="Copy to clipboard"
      className={`copy-button ${className}`.trim()}
      type="button"
      onClick={() => void handleCopy()}
    >
      {label}
    </button>
  );
}
