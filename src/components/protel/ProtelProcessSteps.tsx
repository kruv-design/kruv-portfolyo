import type { CSSProperties } from "react";
import type { ProtelProcessStep } from "@/types";
import { ProtelSectionHeading } from "./ProtelSectionHeading";

function progressForStep(index: number, total: number) {
  if (total <= 1) return 100;
  return Math.min(100, Math.round(((index + 1) / total) * 100));
}

export function ProtelProcessSteps({
  steps,
  duration = "2/3 HAFTA",
}: {
  steps: ProtelProcessStep[];
  duration?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <section className="protel-section protel-section--process" aria-labelledby="protel-process">
      <ProtelSectionHeading
        label="SÜREÇ NASIL İLERLİYOR?"
        aside={<span className="protel-process__duration">{duration}</span>}
      />

      <div className="protel-process">
        {steps.map((step, index) => {
          const percent = progressForStep(index, steps.length);
          const isLast = index === steps.length - 1;

          return (
            <article
              key={`${step.title}-${index}`}
              className={`protel-process__step${isLast ? " protel-process__step--last" : ""}`}
              style={{ "--protel-step-offset": index } as CSSProperties}
            >
              <div className="protel-process__rail" aria-hidden="true" />
              <div className="protel-process__content">
                <h3 className="protel-process__heading">{step.title}</h3>
                {step.description ? (
                  <p className="protel-process__text">{step.description}</p>
                ) : null}
                <div className="protel-process__progress">
                  <span className="protel-process__percent">%{percent}</span>
                  <div className="protel-process__bar">
                    <span
                      className="protel-process__bar-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                {isLast ? (
                  <div className="protel-process__hand" aria-hidden="true">
                    <img
                      src="/assets/protel-hand-part1.svg"
                      alt=""
                      className="protel-process__hand-shape"
                    />
                    <img
                      src="/assets/protel-hand-part2.svg"
                      alt=""
                      className="protel-process__hand-mark"
                    />
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
