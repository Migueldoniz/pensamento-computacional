import { writeFileSync } from 'fs'

const character = process.argv[2] || 'Luis'
const H = { headers: { 'User-Agent': 'operacao-agenda/0.1' } }
const API = 'https://marvelcinematicuniverse.fandom.com/api.php'

async function getJson(url) {
  const r = await fetch(url, H)
  return r.json()
}

async function run() {
  const images = []

  // 1) Imagem do infobox (a que o app usa por padrão)
  const infoData = await getJson(
    `${API}?action=query&prop=pageimages&piprop=original&format=json&titles=${encodeURIComponent(character)}`,
  )
  const infoPage = Object.values(infoData?.query?.pages || {})[0]
  if (infoPage?.original?.source) {
    images.push({ title: 'INFOBOX (atual)', url: infoPage.original.source })
  }

  // 2) Imagens da subpágina /Gallery
  const galData = await getJson(
    `${API}?action=query&prop=images&format=json&titles=${encodeURIComponent(character + '/Gallery')}`,
  )
  const galPage = Object.values(galData?.query?.pages || {})[0]
  const galFiles = (galPage?.images || []).map((i) => i.title)

  if (galFiles.length) {
    const infoData2 = await getJson(
      `${API}?action=query&prop=imageinfo&iiprop=url&format=json&titles=${encodeURIComponent(galFiles.join('|'))}`,
    )
    for (const p of Object.values(infoData2?.query?.pages || {})) {
      if (p.imageinfo?.[0]?.url) images.push({ title: p.title, url: p.imageinfo[0].url })
    }
  }

  if (!images.length) {
    console.log('Nenhuma imagem encontrada para:', character)
    return
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>Galeria</title>
<style>
body{font-family:sans-serif;background:#111;color:#eee;padding:20px}
h1{margin-bottom:10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.card{background:#222;border-radius:12px;overflow:hidden;border:2px solid transparent}
.card.current{border-color:#4f8cff}
img{width:100%;height:auto;display:block}
.info{padding:12px;font-size:13px;color:#aaa;word-break:break-all}
.tag{display:inline-block;background:#4f8cff;color:#000;font-weight:700;font-size:11px;border-radius:6px;padding:2px 8px;margin:0 12px}
button{margin:8px 12px 12px;padding:6px 12px;background:#4f8cff;border:none;border-radius:8px;color:#000;font-weight:700;cursor:pointer}
</style></head><body>
<h1>${character} — ${images.length} imagens</h1>
<div class="grid">
${images
  .map(
    (img) => `
<div class="card ${img.title === 'INFOBOX (atual)' ? 'current' : ''}">
  <img src="${img.url}" alt="${img.title}" loading="lazy">
  ${img.title === 'INFOBOX (atual)' ? '<span class="tag">EM USO NO APP</span>' : ''}
  <div class="info">${img.title}</div>
  <button data-url="${img.url}">Copiar URL</button>
</div>`,
  )
  .join('')}
</div>
<script>
document.querySelectorAll('button').forEach(b=>b.onclick=()=>{navigator.clipboard.writeText(b.dataset.url);b.textContent='Copiado!'})
</script>
</body></html>`

  writeFileSync('public/gallery.html', html)
  console.log(`Galeria de "${character}" gerada (${images.length} imagens, infobox primeiro).`)
  console.log('Abra public/gallery.html ou http://localhost:3000/gallery.html')
}

run()
