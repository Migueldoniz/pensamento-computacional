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
  { id: 'howard', name: 'Howard, o Pato', emoji: '🦆', movie: 'Guardiões da Galáxia', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/d0/Howard_duck.png/revision/latest?cb=20230707222901' },
  { id: 'korg', name: 'Korg', emoji: '🪨', movie: 'Thor: Ragnarok', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/80/Korg_-_Infobox.jpg/revision/latest?cb=20231021012818' },
  { id: 'miek', name: 'Miek', emoji: '🦗', movie: 'Thor: Ragnarok', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/ad/Tlat_miek.png/revision/latest?cb=20230710000319' },
  { id: 'luis', name: 'Luis', emoji: '🗣️', movie: 'Homem-Formiga', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/50/Luis_Infobox.jpg/revision/latest?cb=20150811230030' },
  { id: 'ned', name: 'Ned Leeds', emoji: '🧑‍💻', movie: 'Homem-Aranha: De Volta ao Lar', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/88/Ned_Leeds_Infobox.jpg/revision/latest?cb=20260617111633' },
  { id: 'happy', name: 'Happy Hogan', emoji: '🥊', movie: 'Homem de Ferro', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/89/Happy_Hogan_Infobox.png/revision/latest?cb=20240807203350' },
  { id: 'darcy', name: 'Darcy Lewis', emoji: '🔬', movie: 'Thor', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c0/Darcy_Lewis_-_WandaVision.jpg/revision/latest?cb=20210209171614' },
  { id: 'woo', name: 'Jimmy Woo', emoji: '🕵️', movie: 'Homem-Formiga e a Vespa', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/ee/Jimmy_Woo_-_WandaVision.jpg/revision/latest?cb=20210209171716' },
  { id: 'mobius', name: 'Mobius M. Mobius', emoji: '🕰️', movie: 'Loki (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/2d/Mobius_M._Mobius.png/revision/latest?cb=20231020213732' },
  { id: 'casey', name: 'Casey (TVA)', emoji: '🗄️', movie: 'Loki (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c6/Casey_Loki.png/revision/latest?cb=20231007174816' },
  { id: 'okoye', name: 'Okoye', emoji: '🛡️', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/25/Black_Panther_Wakanda_Forever_poster_024_Textless.jpg/revision/latest?cb=20240802144734' },
  { id: 'shuri', name: 'Shuri', emoji: '🐆', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/dd/Princesse_shuri_legends.jpg/revision/latest?cb=20231005004342' },
  { id: 'nakia', name: 'Nakia', emoji: '🌿', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/2f/Black_Panther_Wakanda_Forever_poster_025_Textless.jpg/revision/latest?cb=20240802143959' },
  { id: 'wong', name: 'Wong', emoji: '📚', movie: 'Doutor Estranho', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/00/Wong_in_She-Hulk.jpg/revision/latest?cb=20240802144541' },
  { id: 'trevor', name: 'Trevor Slattery', emoji: '🎭', movie: 'Homem de Ferro 3', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/22/TrevorSlatteryShangChi.jpeg/revision/latest?cb=20231210194425' },
  { id: 'kraglin', name: 'Kraglin', emoji: '🏹', movie: 'Guardiões da Galáxia', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/4/4e/Kraglin_Obfonteri_Infobox.jpg/revision/latest?cb=20241128003917' },
  { id: 'mantis', name: 'Mantis', emoji: '🦋', movie: 'Guardiões da Galáxia Vol. 2', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/27/Mantis_Infobox.jpg/revision/latest?cb=20241126000747' },
  { id: 'nebula', name: 'Nebula', emoji: '🤖', movie: 'Guardiões da Galáxia', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/37/Nebula_Vol._3.jpg/revision/latest?cb=20240802144159' },
  { id: 'yelena', name: 'Yelena Belova', emoji: '🕷️', movie: 'Viúva Negra' },
  { id: 'kate', name: 'Kate Bishop', emoji: '🎯', movie: 'Gavião Arqueiro (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/d9/Kate_Bishop_Infobox.jpg/revision/latest?cb=20240222150059' },
  { id: 'katy', name: 'Katy', emoji: '🚌', movie: 'Shang-Chi e a Lenda dos Dez Anéis', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/dc/Katy_infobox_poster.jpg/revision/latest?cb=20231021023245' },
  { id: 'coulson', name: 'Phil Coulson', emoji: '🕶️', movie: 'Os Vingadores', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/98/Phil_Coulson_Infobox.jpg/revision/latest?cb=20250203215516' },
  { id: 'foggy', name: 'Foggy Nelson', emoji: '⚖️', movie: 'Demolidor (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/3d/Foggy_Nelson_Infobox.png/revision/latest?cb=20250305135359' },
  { id: 'karen', name: 'Karen Page', emoji: '📰', movie: 'Demolidor (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/1e/Karen_Page_Infobox.png/revision/latest?cb=20260505180015' },
]
