import Link from 'next/link'

export const metadata = {
  title: 'Fontes de pesquisa — Operação Agenda',
}

export default function FontePage({ searchParams }: { searchParams: { room?: string } }) {
  const room = (searchParams?.room || '').toUpperCase()
  const back = room ? `/play?room=${room}` : '/play'
  return (
    <div className="wrap" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="act">Etapa de pesquisa</div>
      <h1 style={{ marginBottom: 4 }}>Fontes de pesquisa</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Com base na pesquisa: o que é abstração? Resuma em 1 frase.
      </p>

      <div className="col" style={{ gap: 18, marginTop: 8 }}>
        <section className="source">
          <div className="source-tag">Fonte 1</div>
          <h3>Wing (2006) — abstração e decomposição</h3>
          <div className="quote">
            “Pensamento computacional é usar <mark>abstração e decomposição</mark> ao atacar uma tarefa
            grande e complexa ou projetar um sistema complexo e grande. É a separação de interesses. É{' '}
            <mark>escolher uma representação apropriada para um problema ou modelagem dos aspectos
            relevantes de um problema para torná-lo tratável</mark>. … De forma mais fundamental, ele
            trata a questão: <em>O que é computável?</em>”
            <div className="small muted" style={{ marginTop: 6 }}>
              — Tradução de Cleverson Sebastião dos Anjos (WING, 2016, RBECT; CC BY 4.0)
            </div>
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            Original (2006): “Computational thinking is using <strong>abstraction and decomposition</strong>…
            It is <strong>choosing an appropriate representation</strong> for a problem or modeling the
            relevant aspects of a problem to make it tractable.”
          </p>
          <div className="row" style={{ gap: 10, alignItems: 'center' }}>
            <a className="btn" href="/ler?doc=wing" target="_blank" rel="noreferrer">
              Ler no leitor (PDF)
            </a>
            <a
              className="small"
              href="https://periodicos.utfpr.edu.br/rbect/article/view/4711"
              target="_blank"
              rel="noreferrer"
            >
              Tradução PT (RBECT, CC BY)
            </a>
            <a
              className="small"
              href="https://www.cs.cmu.edu/~wing/publications/Wing08a.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Original (2008) — PDF
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

        <section className="source">
          <div className="source-tag">Fonte 4</div>
          <h3>Armoni (2013) — como ensinar abstração a iniciantes</h3>
          <div className="quote">
            <mark>Ensinar abstração é ensinar a omitir e justificar:</mark> o aluno escolhe o que
            manter e o que descartar, explica por quê e <strong>revê a representação</strong> quando o
            objetivo muda.
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            ARMONI, Michal. <em>On teaching abstraction in computer science to novices.</em> Journal
            of Computers in Mathematics and Science Teaching, v. 32, n. 3, p. 265–284, 2013.
          </p>
          <a className="btn" href="https://eric.ed.gov/?id=EJ1006186" target="_blank" rel="noreferrer">
            Ler Armoni (2013)
          </a>
        </section>
      </div>

      <Link href={back} className="small">← voltar à sala{room ? ` ${room}` : ''}</Link>
    </div>
  )
}
