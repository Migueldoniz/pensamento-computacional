import Link from 'next/link'

export const metadata = {
  title: 'Fonte de pesquisa — Operação Agenda',
}

export default function FontePage({ searchParams }: { searchParams: { room?: string } }) {
  const room = (searchParams?.room || '').toUpperCase()
  const back = room ? `/play?room=${room}` : '/play'
  return (
    <div className="wrap" style={{ maxWidth: 820, margin: '0 auto' }}>
      <div className="act">Operação Agenda · fonte de pesquisa</div>
      <h1 style={{ fontSize: 24 }}>Fonte de pesquisa (seção 2)</h1>

      <div className="card col" style={{ gap: 12 }}>
        <p style={{ margin: 0 }}>
          <strong>Referência:</strong> BOMBASAR, James Roberto; RAABE, André; SANTIAGO, Rafael de.
          <em> Design of a Logic Game for Introducing Computational Thinking and Computability
          Concepts in Basic Education.</em> Journal on Computational Thinking (JCThink), v. 1, n. 1,
          2017. DOI: 10.14210/ijcthink.v1.n1.p3.
        </p>

        <div>
          <div className="act">Resumo da seção 2 (em nossas palavras)</div>
          <ul style={{ margin: '6px 0 0', paddingLeft: 20, lineHeight: 1.6 }}>
            <li>
              O artigo parte de <strong>Wing (2006)</strong>: pensamento computacional é resolver
              problemas e projetar sistemas usando conceitos fundamentais da computação.
            </li>
            <li>
              A partir dessas definições, aponta <strong>duas características</strong> do pensamento
              computacional: <strong>(1)</strong> usar conhecimentos da Ciência da Computação e{' '}
              <strong>(2)</strong> <strong>não se limitar</strong> ao ambiente dos computadores.
            </li>
            <li>
              Resgata a pergunta central de Wing: <strong>“o que é computável?”</strong>, pouco
              explorada na prática.
            </li>
            <li>
              Propõe um <strong>jogo de lógica inspirado em modelos computacionais</strong> para
              introduzir pensamento computacional e computabilidade na Educação Básica.
            </li>
          </ul>
        </div>

        <div className="bubble" style={{ borderColor: 'var(--warn)' }}>
          <div className="small muted" style={{ marginBottom: 4 }}>Trecho (citação curta, atribuída)</div>
          “duas características do PC podem ser claramente identificadas: o uso de conhecimentos da
          Ciência da Computação e a não limitação ao ambiente dos computadores.”
          <div className="small muted" style={{ marginTop: 6 }}>
            — Bombasar, Raabe &amp; Santiago (2017, seção 2)
          </div>
        </div>

        <div className="row">
          <a
            href="https://periodicos.univali.br/index.php/IJCThink/article/view/8928"
            target="_blank"
            rel="noreferrer"
          >
            Página do artigo (resumo e metadados)
          </a>
          <a
            href="https://periodicos.univali.br/index.php/IJCThink/article/view/8928/6208"
            target="_blank"
            rel="noreferrer"
          >
            PDF completo (baixa o arquivo)
          </a>
        </div>
      </div>

      <p className="small muted">
        A citação é curta e atribuída, para uso educacional. O resumo acima é uma paráfrase; o texto
        completo está nos links oficiais.
      </p>

      <Link href={back} className="small">← voltar à sala{room ? ` ${room}` : ''}</Link>
    </div>
  )
}
