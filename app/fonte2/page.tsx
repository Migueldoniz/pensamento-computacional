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
          <h3>Potts, Takahashi &amp; Antón (1994) — análise de requisitos por indagação</h3>
          <div className="quote">
            “Preferimos ver o processo de análise como essencialmente{' '}
            <mark>baseado em indagação — uma série de perguntas e respostas</mark> feitas para
            localizar de onde vêm as necessidades de informação e quando.”
            <div className="small muted" style={{ marginTop: 6 }}>
              <em>Tradução nossa</em> de: “We … prefer to view the analysis process as essentially
              inquiry-based — a series of questions and answers designed to pinpoint where
              information needs come from and when.” (p. 21)
            </div>
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            O <strong>Ciclo de Indagação</strong> tem três fases:{' '}
            <strong>documentação → discussão → evolução</strong>. Na <strong>discussão</strong>, os
            requisitos são contestados com <strong>perguntas, respostas e razões</strong> — e é ela
            que gera os pedidos de mudança. O caso estudado é um{' '}
            <strong>agendador de reuniões com salas</strong>.
          </p>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            POTTS, C.; TAKAHASHI, K.; ANTÓN, A. I. Inquiry-based requirements analysis.{' '}
            <em>IEEE Software</em>, v. 11, n. 2, p. 21–32, 1994. DOI: 10.1109/52.268952.
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
            “Os templates são ferramentas eficazes para <mark>aumentar a precisão</mark> dos
            requisitos em linguagem natural e para <mark>evitar ambiguidades</mark>. Quando os
            templates são aplicados, é importante <strong>verificar</strong> se os requisitos estão
            de fato escritos conforme os templates.”
            <div className="small muted" style={{ marginTop: 6 }}>
              <em>Tradução nossa</em> do resumo: “Templates are effective tools for increasing the
              precision of natural language requirements and for avoiding ambiguities … When
              templates are applied, it is important to verify that the requirements are indeed
              written according to the templates.”
            </div>
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            ARORA, C.; SABETZADEH, M.; BRIAND, L.; ZIMMER, F. Automated Checking of Conformance to
            Requirements Templates Using Natural Language Processing.{' '}
            <em>IEEE Transactions on Software Engineering</em>, v. 41, n. 10, p. 944–968, 2015.
            DOI: 10.1109/TSE.2015.2428709.
          </p>
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
