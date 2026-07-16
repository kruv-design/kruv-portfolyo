import type { ProtelProcessStep } from "@/types";

export function ProtelProcessSteps({ steps }: { steps: ProtelProcessStep[] }) {
  if (steps.length === 0) return null;

  return (
    <section className="protel-process" aria-labelledby="protel-process-title">
      <h2 id="protel-process-title" className="h3 protel-process__title">
        Nasıl çalışıyoruz?
      </h2>
      <ol className="protel-process__list">
        {steps.map((step, i) => (
          <li key={`${step.title}-${i}`} className="protel-process__item">
            <span className="protel-process__num" aria-hidden="true">
              {i + 1}
            </span>
            <div className="protel-process__body">
              <h3 className="h4 protel-process__heading">{step.title}</h3>
              {step.description ? (
                <p className="b1 protel-process__text">{step.description}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
