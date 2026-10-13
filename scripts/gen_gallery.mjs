import { writeFileSync } from 'fs'

const character = process.argv[2] || 'Luis'

async function run() {
  const listUrl = `https://marvelcinematicuniverse.fandom.com/api.php?action=query&prop=images&format=json&titles=${encodeURIComponent(character + '/Gallery')}`
  const listRes = await fetch(listUrl, { headers: { 'User-Agent': 'operacao-agenda/0.1' } })
  const listData = await listRes.json()
  const page = Object.values(listData?.query?.pages || {})[0]
  if (!page?.images?.length) {
    console.log('Sem galeria para:', character)
    return
  }

  const titles = page.images.map((i) => i.title).join('|')
  const infoUrl = `https://marvelcinematicuniverse.fandom.com/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=${encodeURIComponent(page.images.map((i) => i.title).join('|'))}`
  const infoRes = await fetch(infoUrl, { headers: { 'User-Agent': 'operacao-agenda/0.1' } })
  const infoData = await infoRes.json()

  const images = []
  for (const p of Object.values(infoData?.query?.pages || {})) {
    if (p.imageinfo?.[0]?.url) images.push({ title: p.title, url: p.imageinfo[0].url })
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>Galeria</title>
<style>
body{font-family:sans-serif;background:#111;color:#eee;padding:20px}
h1{margin-bottom:10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.card{background:#222;border-radius:12px;overflow:hidden}
img{width:100%;height:auto;display:block}
.info{padding:12px;font-size:13px;color:#aaa;word-break:break-all}
button{margin-top:8px;padding:6px 12px;background:#4f8cff;border:none;border-radius:8px;color:#000;font-weight:700;cursor:pointer}
</style></head><body>
<h1>${process.argv[2] || 'Luis'} — ${images.length} imagens</h1>
<div class="grid">
${images.map(img => `
<div class="card">
  <img src="${img.url}" alt="${img.title}" loading="lazy">
  <div class="info">${img.title}</div>
  <button onclick="navigator.clipboard.writeText('${img.url.replace(/'/g, "\\'")}')">Copiar URL</button>
</div>
`).join('')}
</div>
<script>document.querySelectorAll('button').forEach(b=>b.onclick=()=>alert('Copiado!'))</script>
</body></html>`

  writeFileSync('public/gallery.html', html)
  console.log(`Galeria de "${process.argv[2] || 'Luis'}" gerada em public/gallery.html`)
  console.log('Abra http://localhost:3000/gallery.html ou abra o arquivo public/gallery.html no navegador')
}
run()