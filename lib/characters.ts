export interface Character {
  id: string
  name: string
  emoji: string
  movie: string
  img?: string
}

/**
 * Deixe `false` enquanto não houver fotos locais. Quando você colocar imagens
 * em `public/chars/<id>.jpg`, mude para `true` (o emoji vira reserva).
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
 * Lista baseada em "25 Side Characters In Marvel That Are Even Better Than The
 * Main Characters" (CBR, 2018).
 *
 * QUER USAR FOTO LOCAL? Coloque o arquivo em /public/chars/<id>.jpg e ligue
 * `CHAR_IMAGES = true`. Ou preencha `img` com uma URL.
 */
export const CHARACTERS: Character[] = [
  { id: 'bucky', name: 'Soldado Invernal', emoji: '🦾', movie: 'Capitão América: O Soldado Invernal', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/21/Winter_Soldier_Infobox.jpg/revision/latest?cb=20250425194747' },
  { id: 'fury', name: 'Nick Fury', emoji: '🕵️', movie: 'Homem de Ferro', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/a3/Nick_Fury_Infobox.png/revision/latest?cb=20240802141551' },
  { id: 'colleen', name: 'Colleen Wing', emoji: '🥋', movie: 'Punho de Ferro (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/70/Colleen_Wing.jpg/revision/latest?cb=20170306022333' },
  { id: 'oldlace', name: 'Old Lace', emoji: '🦖', movie: 'Runaways (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/b/bc/Old_Lace_-_RS2.jpg/revision/latest?cb=20190325151627' },
  { id: 'ancientone', name: 'A Anciã', emoji: '🧘', movie: 'Doutor Estranho', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/dc/Ancient_One.png/revision/latest?cb=20231020202432' },
  { id: 'trish', name: 'Trish Walker', emoji: '📻', movie: 'Jessica Jones (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/80/Trish_Walker.jpg/revision/latest?cb=20221120194040' },
  { id: 'heimdall', name: 'Heimdall', emoji: '⚔️', movie: 'Thor', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/ea/Heimdall_Infobox.jpg/revision/latest?cb=20250203022212' },
  { id: 'nakia', name: 'Nakia', emoji: '🌿', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/2f/Black_Panther_Wakanda_Forever_poster_025_Textless.jpg/revision/latest?cb=20240802143959' },
  { id: 'sharon', name: 'Sharon Carter', emoji: '🎯', movie: 'Capitão América: O Soldado Invernal', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/0f/Sharon_Carter.png/revision/latest?cb=20180220124846' },
  { id: 'claire', name: 'Claire Temple', emoji: '🩺', movie: 'Demolidor (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/4/40/Claire_Temple.png/revision/latest?cb=20240802141123' },
  { id: 'foggy', name: 'Foggy Nelson', emoji: '⚖️', movie: 'Demolidor (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/3d/Foggy_Nelson_Infobox.png/revision/latest?cb=20250305135359' },
  { id: 'mbaku', name: "M'Baku", emoji: '🦍', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/e4/M%27Baku_Infobox.png/revision/latest?cb=20231021150505' },
  { id: 'korg', name: 'Korg', emoji: '🪨', movie: 'Thor: Ragnarok', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/80/Korg_-_Infobox.jpg/revision/latest?cb=20231021012818' },
  { id: 'peggy', name: 'Peggy Carter', emoji: '🇬🇧', movie: 'Capitão América: O Primeiro Vingador', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/6b/Peggy_Carter_Infobox.png/revision/latest?cb=20250209154948' },
  { id: 'luis', name: 'Luis', emoji: '🗣️', movie: 'Homem-Formiga', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/50/Luis_Infobox.jpg/revision/latest?cb=20150811230030' },
  { id: 'valkyrie', name: 'Valquíria', emoji: '🐎', movie: 'Thor: Ragnarok', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/d8/Valkyrie_in_LoveAndThunder_Poster.png/revision/latest?cb=20231021012751' },
  { id: 'pepper', name: 'Pepper Potts', emoji: '🧡', movie: 'Homem de Ferro', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/d4/Rescue_Infobox.png/revision/latest?cb=20231025192612' },
  { id: 'okoye', name: 'Okoye', emoji: '🛡️', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/25/Black_Panther_Wakanda_Forever_poster_024_Textless.jpg/revision/latest?cb=20240802144734' },
  { id: 'rhodey', name: 'Máquina de Combate', emoji: '🦿', movie: 'Homem de Ferro 2', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/77/WarMachine-EndgameProfile.jpg/revision/latest?cb=20231025163822' },
  { id: 'yondu', name: 'Yondu', emoji: '🏹', movie: 'Guardiões da Galáxia', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9b/Yondu_Infobox.png/revision/latest?cb=20250204003244' },
  { id: 'wong', name: 'Wong', emoji: '📚', movie: 'Doutor Estranho', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/00/Wong_in_She-Hulk.jpg/revision/latest?cb=20240802144541' },
  { id: 'shuri', name: 'Shuri', emoji: '🐆', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/dd/Princesse_shuri_legends.jpg/revision/latest?cb=20231005004342' },
  { id: 'sif', name: 'Sif', emoji: '🗡️', movie: 'Thor', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/a6/Lady_Sif_L%26T.png/revision/latest?cb=20220908184504' },
  { id: 'darcy', name: 'Darcy Lewis', emoji: '🔬', movie: 'Thor', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/c/c0/Darcy_Lewis_-_WandaVision.jpg/revision/latest?cb=20210209171614' },
  { id: 'coulson', name: 'Phil Coulson', emoji: '🕶️', movie: 'Homem de Ferro', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/98/Phil_Coulson_Infobox.jpg/revision/latest?cb=20250203215516' },
]
