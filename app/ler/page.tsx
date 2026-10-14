import Link from 'next/link'

const DOCS: Record<string, { title: string; url: string }> = {
  wing: {
    title: 'Wing (2006) — Computational Thinking',
    url: 'https://www.cs.cmu.edu/~wing/publications/Wing06.pdf',
  },
  bombasar: {
    title: 'Bombasar, Raabe & Santiago (2017) — seção 2',
    url: 'https://periodicos.univali.br/index.php/IJCThink/article/view/8928/6208',
  },
}

export const metadata = {
  title: 'Leitor — Operação Agenda',
}

export default function LerPage({ searchParams }: { searchParams: { doc?: string } }) {
  const key = searchParams?.doc === 'bombasar' ? 'bombasar' : 'wing'
  const d = DOCS[key]
  const viewer = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(d.url)}`

  return (
    <div className="wrap" style={{ maxWidth: 1100 }}>
      <div className="row spread" style={{ marginBottom: 10 }}>
        <div>
          <div className="act">Operação Agenda · leitor</div>
          <h1 style={{ margin: 0, fontSize: 22 }}>{d.title}</h1>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <Link href="/fonte" className="small">← fontes</Link>
          <a className="btn" href={d.url} target="_blank" rel="noreferrer">
            Abrir PDF direto
          </a>
        </div>
      </div>

      <iframe
        title={d.title}
        src={viewer}
        style={{ width: '100%', height: '80vh', border: '1px solid var(--line)', borderRadius: 12, background: '#fff' }}
      />

      <p className="small muted" style={{ marginTop: 10 }}>
        Se o leitor embutido não carregar, use <strong>Abrir PDF direto</strong>.
      </p>
    </div>
  )
}
