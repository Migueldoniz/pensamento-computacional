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
            “Computational thinking is using <strong>abstraction and decomposition</strong>… It is{' '}
            <strong>choosing an appropriate representation</strong> for a problem or modeling the
            relevant aspects of a problem to make it tractable.”
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            Em português: usar abstração e decomposição, escolhendo a representação adequada e
            modelando os aspectos relevantes para tornar o problema tratável. Wing também pergunta:
            <em> “o que é computável?”</em>.
          </p>
          <a
            className="btn"
            href="http://cs.cmu.edu/~wing/publications/Wing06.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Ler Wing (2006) — PDF
          </a>
        </section>

        <section className="source">
          <div className="source-tag">Fonte 2</div>
          <h3>Bombasar, Raabe &amp; Santiago (2017) — seção 2</h3>
          <div className="quote">
            Wing define PC como recorrer aos <em>conceitos fundamentais da Ciência da Computação</em>{' '}
            para resolver problemas; a Royal Society (2012) fala em reconhecer <em>aspectos
            computacionais no mundo que nos rodeia</em>. Wing dá exemplos do cotidiano: arrumar a
            mala (<em>busca e cache</em>), carro vs. táxi (<em>algoritmo online</em>), reencontrar um
            objeto perdido (<em>backtracking</em>) e <em>“qual fila do supermercado escolher?”</em>{' '}
            (<em>performance modeling</em>).
          </div>
          <div className="row" style={{ gap: 10 }}>
            <a
              className="btn"
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
              PDF completo (baixa o arquivo)
            </a>
          </div>
        </section>
      </div>

      <p className="small muted" style={{ marginTop: 16 }}>
        Citações curtas e atribuídas, para uso educacional.
      </p>
      <Link href={back} className="small">← voltar à sala{room ? ` ${room}` : ''}</Link>
    </div>
  )
}
