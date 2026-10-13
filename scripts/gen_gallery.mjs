import { writeFileSync } from 'fs'

const character = process.argv[2] || 'Luis'
const H = { headers: { 'User-Agent': 'operacao-agenda/0.1 (educacional)' } }
const API = 'https://marvelcinematicuniverse.fandom.com/api.php'
const enc = encodeURIComponent
const first = (o) => Object.values(o?.query?.pages || {})[0]
const j = async (url) => (await fetch(url, H)).json()

async function run() {
  const seen = new Set()
  const images = []
  const add = (title, url, tag) => {
    if (!url || seen.has(url)) return
    seen.add(url)
    images.push({ title, url, tag })
  }

  // 1) Imagem do infobox (padrão da wiki)
  const pi = await j(`${API}?action=query&prop=pageimages&piprop=original&format=json&titles=${enc(character)}`)
  const pp = first(pi)
  if (pp?.original?.source) add('Infobox', pp.original.source, 'Infobox da wiki')

  // 2) Imagens da subpágina /Gallery
  const gi = await j(`${API}?action=query&prop=images&format=json&titles=${enc(character + '/Gallery')}`)
  const files = (first(gi)?.images || []).map((i) => i.title)
  if (files.length) {
    const ii = await j(
      `${API}?action=query&prop=imageinfo&iiprop=url&format=json&titles=${enc(files.join('|'))}`,
    )
    for (const p of Object.values(ii?.query?.pages || {})) {
      if (p.imageinfo?.[0]?.url) add(p.title, p.imageinfo[0].url)
    }
  }

  // 3) Busca por arquivos com o nome do personagem (fallback p/ Shuri, Yelena…)
  async function byPrefix(prefix) {
    const a = await j(`${API}?action=query&list=allimages&aiprefix=${enc(prefix)}&ailimit=40&format=json`)
    return a?.query?.allimages || []
  }
  let found = await byPrefix(character)
  if (!found.length && character.includes(' ')) found = await byPrefix(character.split(' ')[0])
  for (const f of found) add(f.name, f.url)

  if (!images.length) {
    console.log('Nenhuma imagem encontrada para:', character)
    return
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>Galeria — ${character}</title>
<style>
body{font-family:sans-serif;background:#111;color:#eee;padding:20px}
h1{margin:0 0 4px}p.sub{color:#9aa;margin:0 0 16px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.card{background:#222;border-radius:12px;overflow:hidden;border:2px solid transparent}
.card.box{border-color:#4f8cff}
img{width:100%;height:auto;display:block;background:#000}
.info{padding:10px 12px 0;font-size:13px;color:#aaa;word-break:break-all}
.bar{display:flex;align-items:center;justify-content:space-between;padding:8px 12px 12px}
.tag{background:#4f8cff;color:#000;font-weight:700;font-size:11px;border-radius:6px;padding:2px 8px}
button{padding:6px 12px;background:#4f8cff;border:none;border-radius:8px;color:#000;font-weight:700;cursor:pointer}
</style></head><body>
<h1>${character} — ${images.length} imagens</h1>
<p class="sub">O card azul é a imagem de infobox (a que o app costuma usar). Clique em “Copiar URL” e cole no campo <code>img</code> do personagem em <code>lib/characters.ts</code>.</p>
<div class="grid">
${images
  .map(
    (img) => `
<div class="card ${img.tag ? 'box' : ''}">
  <img src="${img.url}" alt="${img.title}" loading="lazy">
  <div class="info">${img.title}</div>
  <div class="bar">
    ${img.tag ? `<span class="tag">${img.tag}</span>` : '<span></span>'}
    <button data-url="${img.url}">Copiar URL</button>
  </div>
</div>`,
  )
  .join('')}
</div>
<script>
document.querySelectorAll('button').forEach(b=>b.onclick=()=>{navigator.clipboard.writeText(b.dataset.url);b.textContent='Copiado!';setTimeout(()=>b.textContent='Copiar URL',1200)})
</script>
</body></html>`

  writeFileSync('public/gallery.html', html)
  console.log(`Galeria de "${character}" gerada (${images.length} imagens).`)
  console.log('Abra public/gallery.html ou http://localhost:3000/gallery.html')
}

run()
