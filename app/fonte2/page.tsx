import Link from 'next/link'
import { RespostaBox } from '@/components/RespostaBox'

export const metadata = {
  title: 'Etapa de pesquisa — Fontes (Aula 2)',
}

export default function Fonte2Page({ searchParams }: { searchParams: { room?: string } }) {
  const room = (searchParams?.room || '').toUpperCase()
  const back = room ? `/play?room=${room}` : '/play'
  return (
    <div className="wrap" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="act">Etapa de pesquisa</div>
      <h1 style={{ marginBottom: 4 }}>Fontes de pesquisa (Aula 2)</h1>

      <div className="col" style={{ gap: 18, marginTop: 8 }}>
        <section className="source">
          <div className="source-tag">Fonte 1 · JCR</div>
          <h3>Potts, Takahashi &amp; Antón (1994) — inquiry-based requirements analysis</h3>
          <div className="quote">
            “We … prefer to view the analysis process as essentially{' '}
            <mark>inquiry-based — a series of questions and answers</mark> designed to pinpoint where
            information needs come from and when.”
            <div className="small muted" style={{ marginTop: 6 }}>
              — POTTS, C.; TAKAHASHI, K.; ANTÓN, A. I. <em>IEEE Software</em>, v. 11, n. 2, p. 21–32,
              1994. DOI: 10.1109/52.268952.
            </div>
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            O <strong>Inquiry Cycle</strong> tem três fases:{' '}
            <strong>documentação → discussão → evolução</strong>. A discussão é feita de{' '}
            <strong>perguntas, respostas e razões</strong> — e é ela que gera os pedidos de mudança.
            O caso estudado é um <strong>agendador de reuniões com salas</strong>.
          </p>
          <a
            className="btn"
            href="https://ieeexplore.ieee.org/document/276255"
            target="_blank"
            rel="noreferrer"
          >
            Ler Potts et al. (1994)
          </a>
        </section>

        <section className="source">
          <div className="source-tag">Fonte 2 · JCR</div>
          <h3>Arora, Sabetzadeh, Briand &amp; Zimmer (2015) — templates verificáveis</h3>
          <div className="quote">
            Os autores propõem <mark>templates de requisito</mark> e a{' '}
            <mark>checagem automática de conformidade</mark>: um requisito fora do padrão é detectado
            e apontado — ou seja, <strong>dá para verificar</strong>.
            <div className="small muted" style={{ marginTop: 6 }}>
              — <em>síntese do resumo</em> · ARORA, C.; SABETZADEH, M.; BRIAND, L.; ZIMMER, F.{' '}
              <em>IEEE Transactions on Software Engineering</em>, v. 41, n. 10, p. 944–968, 2015.
              DOI: 10.1109/TSE.2015.2428709.
            </div>
          </div>
          <a
            className="btn"
            href="https://doi.org/10.1109/TSE.2015.2428709"
            target="_blank"
            rel="noreferrer"
          >
            Ler Arora et al. (2015)
          </a>
        </section>
      </div>

      <div className="col" style={{ gap: 14, marginTop: 18 }}>
        <RespostaBox
          room={room}
          prompt="O que um requisito precisa ter para ser **discutível** (Potts) e **verificável** (Arora)?"
        />
        <Link href={back} className="small">
          ← voltar à sala{room ? ` ${room}` : ''}
        </Link>
      </div>
    </div>
  )
}
