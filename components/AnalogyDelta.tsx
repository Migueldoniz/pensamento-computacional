'use client'

/**
 * Analogias da Aula 1, estendidas para mostrar o que a Aula 2 acrescenta.
 * Cada uma tem dois lados: "o que você já sabe" (Aula 1) e "o que muda" (Aula 2).
 */
export function AnalogyDelta({ kind }: { kind: 'sandwich' | 'map' }) {
  const d =
    kind === 'sandwich'
      ? {
          tag1: 'Aula 1 · você já sabe',
          titulo1: '“Prepare um sanduíche.”',
          corpo1: '1. Separe o pão. 2. Ponha o recheio.',
          tag2: 'Aula 2 · a pergunta que faltava',
          titulo2: '“Alguém tem restrição alimentar?”',
          corpo2:
            'Ninguém perguntou. A instrução muda: “SE houver restrição, troque o ingrediente.”',
          label: 'suposição',
        }
      : {
          tag1: 'Aula 1 · você já sabe',
          titulo1: '“Para achar um caminho: ruas e conexões.”',
          corpo1: 'O mapa abstrai o resto.',
          tag2: 'Aula 2 · a necessidade que muda',
          titulo2: '“E um trajeto acessível?”',
          corpo2: 'Agora precisa de rampas e escadas. A representação muda.',
          label: 'evolução',
        }

  return (
    <div className="row ccc-flow" style={{ gap: 10, alignItems: 'stretch' }}>
      <div className="ccc">
        <div className="ccc-tag">{d.tag1}</div>
        <div className="ccc-big">{d.titulo1}</div>
        <div className="small muted">{d.corpo1}</div>
      </div>

      <span className="ccc-arrow">→</span>

      <div className="ccc" style={{ borderColor: 'var(--accent)' }}>
        <div className="ccc-tag">{d.tag2}</div>
        <div className="ccc-big">{d.titulo2}</div>
        <div className="small" style={{ marginTop: 4 }}>
          {d.corpo2}
        </div>
        <div className="small muted" style={{ marginTop: 6 }}>
          → {d.label}
        </div>
      </div>
    </div>
  )
}
