import Link from 'next/link'

export const metadata = {
  title: 'Fontes de pesquisa — Operação Agenda',
}

export default function FontePage({ searchParams }: { searchParams: { room?: string } }) {
  const room = (searchParams?.room || '').toUpperCase()
  const back = room ? `/play?room=${room}` : '/play'
  return (
    <div className="wrap" style={{ maxWidth: 860, margin: '0 auto' }}>
      <div className="act">Operação Agenda · fontes de pesquisa</div>
      <h1 style={{ fontSize: 24 }}>Fontes</h1>

      <div className="card col" style={{ gap: 14 }}>
        <div>
          <div className="act">Fonte 1 · abstração e decomposição</div>
          <p style={{ margin: '4px 0' }}>
            WING, Jeannette M. <strong>Computational Thinking</strong>. Communications of the ACM,
            v. 49, n. 3, p. 33–35, 2006.
          </p>
          <div className="bubble" style={{ borderColor: 'var(--warn)' }}>
            “Computational thinking is using <strong>abstraction and decomposition</strong> when
            attacking a large complex task… It is <strong>choosing an appropriate representation</strong>{' '}
            for a problem or modeling the relevant aspects of a problem to make it tractable.”
            <div className="small muted" style={{ marginTop: 6 }}>— e: “most fundamentally it addresses the question: What is computable?”</div>
          </div>
          <p className="small muted" style={{ margin: '6px 0 0' }}>
            Em português: usar <strong>abstração e decomposição</strong>, escolhendo a representação
            adequada e modelando os aspectos relevantes para tornar o problema tratável.
          </p>
          <a href="http://cs.cmu.edu/~wing/publications/Wing06.pdf" target="_blank" rel="noreferrer">
            Abrir Wing (2006) — PDF
          </a>
        </div>

        <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '4px 0' }} />

        <div>
          <div className="act">Fonte 2 · seção 2 (definições)</div>
          <p style={{ margin: '4px 0' }}>
            BOMBASAR, J. R.; RAABE, A.; SANTIAGO, R. de. <em>Design of a Logic Game for Introducing
            Computational Thinking and Computability Concepts in Basic Education.</em> JCThink, v. 1,
            n. 1, 2017. DOI: 10.14210/ijcthink.v1.n1.p3.
          </p>
          <div className="bubble" style={{ borderColor: 'var(--warn)' }}>
            Wing define PC como recorrer aos <em>conceitos fundamentais da Ciência da Computação</em>{' '}
            para resolver problemas; a Royal Society (2012) fala em reconhecer <em>aspectos
            computacionais no mundo que nos rodeia</em>. Wing dá exemplos do cotidiano: arrumar a mala
            (<em>busca e cache</em>), carro vs. táxi (<em>algoritmo online</em>), reencontrar um objeto
            perdido (<em>backtracking</em>).
          </div>
          <div className="row">
            <a href="https://periodicos.univali.br/index.php/IJCThink/article/view/8928" target="_blank" rel="noreferrer">
              Página do artigo
            </a>
            <a href="https://periodicos.univali.br/index.php/IJCThink/article/view/8928/6208" target="_blank" rel="noreferrer">
              PDF completo (baixa)
            </a>
          </div>
        </div>
      </div>

      <p className="small muted">
        Citações curtas e atribuídas, para uso educacional. O texto completo está nos links oficiais.
      </p>

      <Link href={back} className="small">← voltar à sala{room ? ` ${room}` : ''}</Link>
    </div>
  )
}
