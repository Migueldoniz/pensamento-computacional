'use client'

import { useState } from 'react'

/**
 * CONCEITO da Aula 2 — a "conversa de requisitos".
 * Revela, em etapas: documentação → pergunta → resposta → razão → (⚠ suposição).
 */
export function ReqDialogue({
  d,
}: {
  d: { doc: string; pergunta: string; resposta: string; razao: string; suposicao: string }
}) {
  const [s1, setS1] = useState(false)
  const [s2, setS2] = useState(false)
  const [s3, setS3] = useState(false)

  return (
    <div className="col" style={{ gap: 10 }}>
      <div className="ccc">
        <div className="ccc-tag">① O requisito</div>
        <div className="ccc-big">“{d.doc}”</div>
        <div className="small muted">como está escrito</div>
      </div>

      {s1 && (
        <>
          <span className="ccc-arrow">↓</span>
          <div className="ccc">
            <div className="ccc-tag">② Pergunta</div>
            <div className="ccc-big">“{d.pergunta}”</div>
          </div>
          <span className="ccc-arrow">↓</span>
          <div className="ccc">
            <div className="ccc-tag">③ Resposta</div>
            <div className="ccc-big">“{d.resposta}”</div>
          </div>
        </>
      )}

      {s2 && (
        <>
          <span className="ccc-arrow">↓</span>
          <div className="ccc">
            <div className="ccc-tag">④ Razão — fica registrada</div>
            <div className="ccc-big">“{d.razao}”</div>
          </div>
        </>
      )}

      {s3 && (
        <>
          <span className="ccc-arrow">↓</span>
          <div className="ccc" style={{ borderColor: 'var(--bad)' }}>
            <div className="ccc-tag" style={{ color: 'var(--bad)' }}>⚠ Suposição</div>
            <div className="ccc-big">“{d.suposicao}”</div>
            <div className="small muted">ninguém perguntou → vira requisito sozinha</div>
          </div>
        </>
      )}

      <div className="row" style={{ gap: 10 }}>
        {!s1 && (
          <button className="primary" onClick={() => setS1(true)}>
            ▶ ver a conversa
          </button>
        )}
        {s1 && !s2 && (
          <button className="primary" onClick={() => setS2(true)}>
            ▶ ver a justificativa
          </button>
        )}
        {s2 && !s3 && (
          <button className="primary" onClick={() => setS3(true)}>
            ⚠ ver a armadilha
          </button>
        )}
        {s3 && (
          <button
            className="ghost"
            onClick={() => {
              setS1(false)
              setS2(false)
              setS3(false)
            }}
          >
            recolher
          </button>
        )}
      </div>
    </div>
  )
}
