"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { normalizeDropFontText } from "@/lib/drops-font-assets";

const STORAGE_KEY = "kruv-drops-tester-text:v4";
const MIN_SIZE = 24;
const MAX_SIZE = 160;
const DEFAULT_SIZE = 32;

type Props = {
  fontSlug: string;
  locale: Locale;
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
  fontSlug,
  locale,
  defaultText,
  placeholder,
  samplePhrases,
  labels,
}: Props) {
  const storageKey = `${STORAGE_KEY}:${fontSlug}`;
  const [text, setText] = useState(defaultText);
  const [size, setSize] = useState(DEFAULT_SIZE);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      setText(saved && saved.trim() ? saved : defaultText);
    } catch {
      setText(defaultText);
    }
  }, [storageKey, defaultText]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, text);
    } catch {
      /* ignore */
    }
  }, [storageKey, text]);

  function clamp(n: number) {
    return Math.min(MAX_SIZE, Math.max(MIN_SIZE, n));
  }

  const previewRaw = text || placeholder;
  const previewText = normalizeDropFontText(previewRaw, fontSlug, locale);

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
            rows={3}
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
        className={`drops-tester__preview drops-drop-type drops-tester__preview--${fontSlug}`}
        style={{ fontSize: `${size}px` }}
        lang={fontSlug === "cove" || fontSlug === "marzano" ? "en" : undefined}
        aria-live="polite"
      >
        {previewText}
      </div>
    </section>
  );
}
