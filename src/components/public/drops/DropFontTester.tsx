"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "kruv-drops-tester-text";
const MIN_SIZE = 24;
const MAX_SIZE = 160;
const DEFAULT_SIZE = 72;

type Props = {
  defaultText: string;
  placeholder: string;
  samplePhrases: string[];
  labels: {
    input: string;
    size: string;
    decrease: string;
    increase: string;
  };
};

export function DropFontTester({
  defaultText,
  placeholder,
  samplePhrases,
  labels,
}: Props) {
  const [text, setText] = useState(defaultText);
  const [size, setSize] = useState(DEFAULT_SIZE);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setText(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, text);
  }, [text]);

  function clamp(n: number) {
    return Math.min(MAX_SIZE, Math.max(MIN_SIZE, n));
  }

  return (
    <section className="drops-tester" aria-label={labels.input}>
      <div className="drops-tester__controls">
        <label className="drops-tester__field">
          <span className="drops-tester__label">{labels.input}</span>
          <textarea
            className="drops-tester__textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            rows={2}
          />
        </label>
        <div className="drops-tester__size-row">
          <span className="drops-tester__label">{labels.size}</span>
          <div className="drops-tester__size-controls">
            <button
              type="button"
              className="drops-tester__size-btn"
              aria-label={labels.decrease}
              onClick={() => setSize((s) => clamp(s - 8))}
            >
              −
            </button>
            <input
              type="range"
              className="drops-tester__range"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              aria-valuenow={size}
              aria-valuemin={MIN_SIZE}
              aria-valuemax={MAX_SIZE}
            />
            <button
              type="button"
              className="drops-tester__size-btn"
              aria-label={labels.increase}
              onClick={() => setSize((s) => clamp(s + 8))}
            >
              +
            </button>
            <span className="drops-tester__size-value">{size}px</span>
          </div>
        </div>
        {samplePhrases.length > 0 ? (
          <div className="drops-tester__samples">
            {samplePhrases.map((phrase) => (
              <button
                key={phrase}
                type="button"
                className="drops-tester__sample-btn"
                onClick={() => setText(phrase)}
              >
                {phrase}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div
        className="drops-tester__preview"
        style={{ fontSize: `${size}px` }}
        aria-live="polite"
      >
        {text || placeholder}
      </div>
    </section>
  );
}
