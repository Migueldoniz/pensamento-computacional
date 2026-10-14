import Link from 'next/link'

export const metadata = {
  title: 'Fontes de pesquisa — Operação Agenda',
}

export default function FontePage({ searchParams }: { searchParams: { room?: string } }) {
  const room = (searchParams?.room || '').toUpperCase()
  const back = room ? `/play?room=${room}` : '/play'
  return (
    <div className="wrap" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="act">Operação Agenda</div>
      <h1 style={{ marginBottom: 4 }}>Fontes de pesquisa</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Duas leituras curtas que sustentam a aula.
      </p>

      <div className="col" style={{ gap: 18, marginTop: 8 }}>
        <section className="source">
          <div className="source-tag">Fonte 1</div>
          <h3>Wing (2006) — abstração e decomposição</h3>
          <div className="quote">
            “Thinking like a computer scientist means more than being able to program a computer. It
            requires thinking at multiple levels of abstraction.{' '}
            <mark>Computational thinking is using abstraction and decomposition when attacking a large
            complex task or designing a large complex system. It is separation of concerns. It is
            choosing an appropriate representation for a problem or modeling the relevant aspects of
            a problem to make it tractable.</mark>{' '}
            … Most fundamentally it addresses the question: What is computable?”
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            Em português: pensar como cientista da computação é mais do que programar — é usar
            <strong> abstração e decomposição</strong>, escolhendo a representação adequada e modelando
            os aspectos relevantes para tornar o problema tratável. Wing também pergunta:
            <em> “o que é computável?”</em>.
          </p>
          <div className="row" style={{ gap: 10, alignItems: 'center' }}>
            <a className="btn" href="/ler?doc=wing" target="_blank" rel="noreferrer">
              Ler no leitor (PDF)
            </a>
            <a
              className="small"
              href="https://www.cs.cmu.edu/~wing/publications/Wing06.pdf"
              target="_blank"
              rel="noreferrer"
            >
              PDF direto (baixa)
            </a>
          </div>
        </section>

        <section className="source">
          <div className="source-tag">Fonte 2</div>
          <h3>Bombasar, Raabe &amp; Santiago (2017) — seção 2</h3>
          <div className="quote">
            “A Royal Society (2012) definiu o PC como ‘o processo de reconhecer os aspectos
            computacionais no mundo que nos rodeia e aplicar ferramentas e técnicas da Ciência da
            Computação…’.{' '}
            <mark>Nas definições apresentadas por Wing (2006) e pela Royal Society (2012), duas
            características do PC podem ser claramente identificadas: o uso de conhecimentos da Ciência
            da Computação e a não limitação ao ambiente dos computadores.</mark>{' '}
            Assim, o PC pode ser entendido como aplicar técnicas e ferramentas da Ciência da Computação
            não só a problemas que envolvem computadores, mas a qualquer problema onde essas técnicas
            possam ser aplicadas.”
          </div>
          <div className="row" style={{ gap: 10, alignItems: 'center' }}>
            <a className="btn" href="/ler?doc=bombasar" target="_blank" rel="noreferrer">
              Ler no leitor (PDF)
            </a>
            <a
              className="small"
              href="https://periodicos.univali.br/index.php/IJCThink/article/view/8928"
              target="_blank"
              rel="noreferrer"
            >
              Página do artigo
            </a>
            <a
              className="small"
              href="https://periodicos.univali.br/index.php/IJCThink/article/view/8928/6208"
              target="_blank"
              rel="noreferrer"
            >
              PDF direto (baixa)
            </a>
          </div>
        </section>

        <section className="source">
          <div className="source-tag">Fonte 3</div>
          <h3>Kramer (2007) — abstração = remover + generalizar</h3>
          <div className="quote">
            <mark>Abstrair é remover o detalhe desnecessário e generalizar</mark> — e o valor de uma
            abstração <strong>depende do propósito</strong>: o nível, o benefício e o valor de uma
            abstração dependem do problema que se quer resolver.
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            Kramer, J. <em>Is abstraction the key to computing?</em> Communications of the ACM, v. 50,
            n. 4, p. 36–42, 2007. DOI: 10.1145/1232743.1232745.
          </p>
          <a
            className="btn"
            href="https://dl.acm.org/doi/10.1145/1232743.1232745"
            target="_blank"
            rel="noreferrer"
          >
            Ler Kramer (2007)
          </a>
        </section>
      </div>

      <p className="small muted" style={{ marginTop: 16 }}>
        Citações curtas e atribuídas, para uso educacional.
      </p>
      <Link href={back} className="small">← voltar à sala{room ? ` ${room}` : ''}</Link>
    </div>
  )
}
