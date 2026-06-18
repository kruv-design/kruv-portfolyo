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
  allowVideoWithoutPoster = false,
  posterOptional = false,
}: {
  label: string;
  posterValue: string;
  posterOnChange: (url: string) => void;
  videoValue?: string;
  videoOnChange?: (url: string) => void;
  posterHint?: string;
  posterError?: string;
  /** Görsel 1: yalnızca video da yeterli */
  allowVideoWithoutPoster?: boolean;
  posterOptional?: boolean;
}) {
  const hasVideo = Boolean(videoOnChange);
  const resolvedVideo = videoValue ?? "";
  const [showVideo, setShowVideo] = useState(Boolean(resolvedVideo.trim()));

  const posterFieldHint =
    posterHint ??
    (posterOptional
      ? "İsteğe bağlı — yalnızca video da kullanılabilir."
      : undefined);

  return (
    <div className="flex flex-col gap-3">
      <Field label={label} hint={posterFieldHint} error={posterError}>
        <CoverUpload
          value={posterValue}
          onChange={posterOnChange}
          previewAlt={label}
        />
      </Field>

      {hasVideo && !showVideo && !resolvedVideo.trim() ? (
        <button
          type="button"
          className="b3 self-start text-left underline"
          style={{ color: "var(--ink-soft)" }}
          onClick={() => setShowVideo(true)}
        >
          Video ekle (sessiz loop)
        </button>
      ) : null}

      {hasVideo && (showVideo || resolvedVideo.trim()) ? (
        <Field
          label="Video (sessiz loop)"
          hint={
            allowVideoWithoutPoster
              ? "Görsel veya video — ikisi de boş bırakılabilir."
              : "Poster zorunlu; video yalnızca görünür alanda yüklenir."
          }
        >
          <VideoUpload
            value={resolvedVideo}
            onChange={videoOnChange!}
            onRemove={() => {
              videoOnChange!("");
              setShowVideo(false);
            }}
          />
        </Field>
      ) : null}
    </div>
  );
}
