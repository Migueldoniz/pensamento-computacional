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
          <div className="source-tag">Fonte conceitual</div>
          <h3>Armoni (2013) — ensinar abstração por níveis</h3>
          <div className="quote">
            A autora propõe ensinar abstração <mark>explicitando os níveis em que se está
            trabalhando</mark>, a partir da hierarquia PGK:{' '}
            <strong>problema → algoritmo → programa → execução</strong>. O aluno deve saber{' '}
            <em>em que nível está</em>, <strong>transitar entre os níveis</strong> e{' '}
            <strong>escolher o nível adequado</strong> à tarefa.
            <div className="small muted" style={{ marginTop: 6 }}>
              “O nível do objeto apreende o que é popularmente chamado de ‘algoritmo’ — uma solução
              que não está numa linguagem de programação específica.” (ARMONI, 2013, p. 273)
            </div>
          </div>
          <p className="small muted" style={{ margin: '0 0 12px' }}>
            ARMONI, Michal. <em>On teaching abstraction in computer science to novices.</em> Journal
            of Computers in Mathematics and Science Teaching, v. 32, n. 3, p. 265–284, 2013.
            <br />
            <strong>Nota:</strong> é uma <em>proposta</em> de quadro didático baseada na literatura —
            não um estudo empírico. E este periódico <strong>não é indexado no JCR</strong>.
          </p>
          <a className="btn" href="https://eric.ed.gov/?id=EJ1006186" target="_blank" rel="noreferrer">
            Ler Armoni (2013)
          </a>
        </section>
      </div>

      <div className="col" style={{ gap: 14, marginTop: 18 }}>
        <RespostaBox
          room={room}
          prompt="Quais são os **4 níveis** da hierarquia de Armoni (2013) e o que muda de um para o outro?"
        />
        <Link href={back} className="small">
          ← voltar à sala{room ? ` ${room}` : ''}
        </Link>
      </div>
    </div>
  )
}
