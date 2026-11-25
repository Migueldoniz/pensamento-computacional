import Link from 'next/link'
import { RespostaBox } from '@/components/RespostaBox'

export const metadata = {
  title: 'Etapa de pesquisa — Fontes (Aula 3)',
}

export default function Fonte3Page({ searchParams }: { searchParams: { room?: string } }) {
  const room = (searchParams?.room || '').toUpperCase()
  const back = room ? `/play?room=${room}` : '/play'
  return (
    <div className="wrap" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="act">Etapa de pesquisa</div>
      <h1 style={{ marginBottom: 4 }}>Fontes de pesquisa (Aula 3)</h1>

      <div className="col" style={{ gap: 18, marginTop: 8 }}>
        <section className="source">
          <div className="source-tag">Fonte 1 · JCR</div>
          <h3>Wing (2008) — o processo de abstração introduz camadas</h3>
          <div className="quote">
            “O processo de abstração <mark>introduz camadas</mark>. Na computação, trabalhamos
            simultaneamente com pelo menos duas, geralmente mais, camadas de abstração…{' '}
            <mark>Interfaces bem definidas entre as camadas</mark> nos permitem construir sistemas
            grandes e complexos.”
            <div className="small muted" style={{ marginTop: 6 }}>
              <em>Tradução nossa</em> de: “The abstraction process introduces layers… Well-defined
              interfaces between layers enable us to build large, complex systems.”
            </div>
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            WING, Jeannette M. Computational thinking and thinking about computing.{' '}
            <em>Philosophical Transactions of the Royal Society A</em>, v. 366, n. 1881, p.
            3717–3725, 2008. DOI: 10.1098/rsta.2008.0118.
          </p>
          <a
            className="btn"
            href="https://doi.org/10.1098/rsta.2008.0118"
            target="_blank"
            rel="noreferrer"
          >
            Ler Wing (2008)
          </a>
        </section>

        <section className="source">
          <div className="source-tag">Fonte 2 · conceitual</div>
          <h3>Armoni (2013) — os quatro níveis (hierarquia PGK)</h3>
          <div className="quote">
            Os quatro níveis são <mark>problema → algoritmo → programa → execução</mark>. A autora
            renomeia o nível “objeto” para <strong>nível do algoritmo</strong>:
            <div className="small muted" style={{ marginTop: 6 }}>
              “o nível do objeto apreende o que é comum e popularmente chamado de ‘algoritmo’ — uma
              solução que não é apresentada em uma linguagem de programação específica.” (p. 273)
            </div>
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            ARMONI, Michal. <em>On teaching abstraction in computer science to novices.</em> Journal
            of Computers in Mathematics and Science Teaching, v. 32, n. 3, p. 265–284, 2013.
            <br />
            <strong>Nota:</strong> é uma <em>proposta</em> de quadro didático (não empírica) e este
            periódico <strong>não é JCR</strong> — por isso a fonte JCR da pesquisa é a Wing.
          </p>
        </section>

        <section className="source">
          <div className="source-tag">Fonte 3 · origem do quadro</div>
          <h3>Perrenet, Groote &amp; Kaasenbrood (2005) — a hierarquia original</h3>
          <div className="quote">
            É de onde vem a <strong>hierarquia PGK</strong> (as iniciais dos autores) adaptada por
            Armoni: os alunos compreendem o conceito de algoritmo em <mark>níveis de abstração</mark>{' '}
            distintos.
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            PERRENET, J. C.; GROOTE, J. F.; KAASENBROOD, E. J. Exploring students’ understanding of
            the concept of algorithm: levels of abstraction. <em>ACM SIGCSE Bulletin</em>, v. 37, n.
            3, p. 64–68, 2005.
          </p>
        </section>
      </div>

      <div className="col" style={{ gap: 14, marginTop: 18 }}>
        <RespostaBox
          room={room}
          prompt="Segundo **Wing (2008)**, o que o processo de abstração introduz — e o que as interfaces entre camadas permitem?"
        />
        <Link href={back} className="small">
          ← voltar à sala{room ? ` ${room}` : ''}
        </Link>
      </div>
    </div>
  )
}
