'use client'

import { Fragment, useEffect, useState } from 'react'
import { MapStage } from '@/components/Art'

/**
 * Fluxograma de etapas da abstração: parte do propósito do mundo real e chega
 * à abstração, mostrando **uma visão do mapa a cada etapa**.
 * O apresentador (ou o aluno) navega clicando nas etapas / nas setas.
 */
export function AbstractionFlow({ steps }: { steps: { name: string; detail?: string }[] }) {
  const [step, setStep] = useState(0)
  useEffect(() => setStep(0), [steps])

  if (!steps?.length) return null
  const cur = steps[step]

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="abst-flow">
        {steps.map((s, i) => (
          <Fragment key={i}>
            <button
              className={`step-chip ${i === step ? 'on' : ''}`}
              onClick={() => setStep(i)}
              aria-current={i === step}
            >
              {i + 1}. {s.name}
            </button>
            {i < steps.length - 1 && <span className="step-arrow">→</span>}
          </Fragment>
        ))}
      </div>

      <MapStage step={step} />

      <div className="col" style={{ gap: 4 }}>
        <b>
          {step + 1}. {cur.name}
        </b>
        {cur.detail && <div className="muted small">{cur.detail}</div>}
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          ◀ anterior
        </button>
        <button
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
        >
          próxima ▶
        </button>
        <span className="small muted">
          {step + 1}/{steps.length}
        </span>
      </div>
    </div>
  )
}
