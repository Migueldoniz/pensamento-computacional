export interface Character {
  id: string
  name: string
  emoji: string
  movie: string
  img?: string
}

/**
 * Deixe `false` enquanto não houver fotos. Quando você colocar as imagens em
 * `public/chars/<id>.jpg`, mude para `true` e elas aparecem automaticamente
 * (com o emoji como reserva, caso algum arquivo falte).
 */
export const CHAR_IMAGES = false

export function charImg(c: Character) {
  return c.img || `/chars/${c.id}.jpg`
}

export function characterById(id: string) {
  return CHARACTERS.find((c) => c.id === id)
}

export function characterByName(name: string) {
  return CHARACTERS.find((c) => c.name === name)
}

/**
 * Personagens secundários da Marvel para escolher como nickname.
 *
 * QUER USAR FOTO? Cada personagem aceita um campo `img` com a URL da imagem.
 * Ex.:  { id: 'korg', name: 'Korg', emoji: '🪨', movie: 'Thor: Ragnarok',
 *         img: 'https://exemplo.com/korg.jpg' }
 * Se `img` estiver preenchido, a foto aparece; senão, usa o avatar redondo.
 */
export const CHARACTERS: Character[] = [
  { id: 'howard', name: 'Howard, o Pato', emoji: '🦆', movie: 'Guardiões da Galáxia' },
  { id: 'korg', name: 'Korg', emoji: '🪨', movie: 'Thor: Ragnarok' },
  { id: 'miek', name: 'Miek', emoji: '🦗', movie: 'Thor: Ragnarok' },
  { id: 'luis', name: 'Luis', emoji: '🗣️', movie: 'Homem-Formiga' },
  { id: 'ned', name: 'Ned Leeds', emoji: '🧑‍💻', movie: 'Homem-Aranha: De Volta ao Lar' },
  { id: 'happy', name: 'Happy Hogan', emoji: '🥊', movie: 'Homem de Ferro' },
  { id: 'darcy', name: 'Darcy Lewis', emoji: '🔬', movie: 'Thor' },
  { id: 'woo', name: 'Jimmy Woo', emoji: '🕵️', movie: 'Homem-Formiga e a Vespa' },
  { id: 'mobius', name: 'Mobius M. Mobius', emoji: '🕰️', movie: 'Loki (série)' },
  { id: 'casey', name: 'Casey (TVA)', emoji: '🗄️', movie: 'Loki (série)' },
  { id: 'okoye', name: 'Okoye', emoji: '🛡️', movie: 'Pantera Negra' },
  { id: 'shuri', name: 'Shuri', emoji: '🐆', movie: 'Pantera Negra' },
  { id: 'nakia', name: 'Nakia', emoji: '🌿', movie: 'Pantera Negra' },
  { id: 'wong', name: 'Wong', emoji: '📚', movie: 'Doutor Estranho' },
  { id: 'trevor', name: 'Trevor Slattery', emoji: '🎭', movie: 'Homem de Ferro 3' },
  { id: 'kraglin', name: 'Kraglin', emoji: '🏹', movie: 'Guardiões da Galáxia' },
  { id: 'mantis', name: 'Mantis', emoji: '🦋', movie: 'Guardiões da Galáxia Vol. 2' },
  { id: 'nebula', name: 'Nebula', emoji: '🤖', movie: 'Guardiões da Galáxia' },
  { id: 'yelena', name: 'Yelena Belova', emoji: '🕷️', movie: 'Viúva Negra' },
  { id: 'kate', name: 'Kate Bishop', emoji: '🎯', movie: 'Gavião Arqueiro (série)' },
  { id: 'katy', name: 'Katy', emoji: '🚌', movie: 'Shang-Chi e a Lenda dos Dez Anéis' },
  { id: 'coulson', name: 'Phil Coulson', emoji: '🕶️', movie: 'Os Vingadores' },
  { id: 'foggy', name: 'Foggy Nelson', emoji: '⚖️', movie: 'Demolidor (série)' },
  { id: 'karen', name: 'Karen Page', emoji: '📰', movie: 'Demolidor (série)' },
]
