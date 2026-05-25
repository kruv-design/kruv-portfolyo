"use client";

import { useState } from "react";
import { CoverUpload } from "./CoverUpload";
import { VideoUpload } from "./VideoUpload";
import { Field } from "@/components/ui/Field";

export function MediaSlotEditor({
  label,
  posterValue,
  posterOnChange,
  videoValue,
  videoOnChange,
  posterHint,
  posterError,
}: {
  label: string;
  posterValue: string;
  posterOnChange: (url: string) => void;
  videoValue: string;
  videoOnChange: (url: string) => void;
  posterHint?: string;
  posterError?: string;
}) {
  const [showVideo, setShowVideo] = useState(Boolean(videoValue.trim()));

  return (
    <div className="flex flex-col gap-3">
      <Field label={label} hint={posterHint} error={posterError}>
        <CoverUpload
          value={posterValue}
          onChange={posterOnChange}
          previewAlt={label}
        />
      </Field>

      {!showVideo && !videoValue.trim() ? (
        <button
          type="button"
          className="b3 self-start text-left underline"
          style={{ color: "var(--ink-soft)" }}
          onClick={() => setShowVideo(true)}
        >
          Video ekle (sessiz loop)
        </button>
      ) : null}

      {showVideo || videoValue.trim() ? (
        <Field
          label="Video (sessiz loop)"
          hint="Poster zorunlu; video yalnızca görünür alanda yüklenir."
        >
          <VideoUpload
            value={videoValue}
            onChange={videoOnChange}
            onRemove={() => {
              videoOnChange("");
              setShowVideo(false);
            }}
          />
        </Field>
      ) : null}
    </div>
  );
}
