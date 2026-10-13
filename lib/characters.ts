export interface Character {
  id: string
  name: string
  emoji: string
  movie: string
  img?: string
  /** ponto focal da foto no corte quadrado, ex.: '50% 15%' (x% y%) */
  pos?: string
  /** zoom da foto (1 = sem zoom) */
  zoom?: number
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
  { id: 'bucky', name: 'Soldado Invernal', emoji: '🦾', movie: 'Capitão América: O Soldado Invernal', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/82/BuckyBarnes-AvengersEndgame.png/revision/latest?cb=20190728163617', pos: '66% 20%' },
  { id: 'fury', name: 'Nick Fury', emoji: '🕵️', movie: 'Homem de Ferro', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/a3/Nick_Fury_Infobox.png/revision/latest?cb=20240802141551', pos: '58% 20%' },
  { id: 'colleen', name: 'Colleen Wing', emoji: '🥋', movie: 'Punho de Ferro (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/70/Colleen_Wing.jpg/revision/latest?cb=20170306022333', pos: '58% 10%', zoom: 1.7 },
  { id: 'groot', name: 'Groot', emoji: '🌳', movie: 'Guardiões da Galáxia', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/6/6d/Groot-240x240.jpg/revision/latest?cb=20170421031107', pos: '50% 20%' },
  { id: 'ancientone', name: 'A Anciã', emoji: '🧘', movie: 'Doutor Estranho', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/f/fb/AncientOne2012Infobox.png/revision/latest?cb=20210525164935', pos: '50% 0%', zoom: 1.3 },
  { id: 'trish', name: 'Trish Walker', emoji: '📻', movie: 'Jessica Jones (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/80/Trish_Walker.jpg/revision/latest?cb=20221120194040', pos: '50% 20%' },
  { id: 'heimdall', name: 'Heimdall', emoji: '⚔️', movie: 'Thor', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/ea/Heimdall_Infobox.jpg/revision/latest?cb=20250203022212', pos: '50% 20%', zoom: 2.45 },
  { id: 'nakia', name: 'Nakia', emoji: '🌿', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/2f/Black_Panther_Wakanda_Forever_poster_025_Textless.jpg/revision/latest?cb=20240802143959', pos: '50% 0%' },
  { id: 'sharon', name: 'Sharon Carter', emoji: '🎯', movie: 'Capitão América: O Soldado Invernal', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/f/f7/Sharon123.jpg/revision/latest?cb=20210415032604', pos: '50% 0%', zoom: 1.55 },
  { id: 'claire', name: 'Claire Temple', emoji: '🩺', movie: 'Demolidor (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/4/40/Claire_Temple.png/revision/latest?cb=20240802141123', pos: '50% 20%' },
  { id: 'foggy', name: 'Foggy Nelson', emoji: '⚖️', movie: 'Demolidor (série)', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/3d/Foggy_Nelson_Infobox.png/revision/latest?cb=20250305135359', pos: '50% 0%', zoom: 1.25 },
  { id: 'mbaku', name: "M'Baku", emoji: '🦍', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/e/e4/M%27Baku_Infobox.png/revision/latest?cb=20231021150505', pos: '50% 0%' },
  { id: 'korg', name: 'Korg', emoji: '🪨', movie: 'Thor: Ragnarok', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/8/80/Korg_-_Infobox.jpg/revision/latest?cb=20231021012818', pos: '50% 0%', zoom: 1.65 },
  { id: 'peggy', name: 'Peggy Carter', emoji: '🇬🇧', movie: 'Capitão América: O Primeiro Vingador', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/5d/PeggyCarter-Poster.jpg/revision/latest?cb=20140306061511', pos: '50% 7%', zoom: 1.85 },
  { id: 'luis', name: 'Luis', emoji: '🗣️', movie: 'Homem-Formiga', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/50/Luis_Infobox.jpg/revision/latest?cb=20150811230030', pos: '50% 4%', zoom: 1.25 },
  { id: 'valkyrie', name: 'Valquíria', emoji: '🐎', movie: 'Thor: Ragnarok', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/d8/Valkyrie_in_LoveAndThunder_Poster.png/revision/latest?cb=20231021012751', pos: '67% 6%', zoom: 2.35 },
  { id: 'pepper', name: 'Pepper Potts', emoji: '🧡', movie: 'Homem de Ferro', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/d4/Rescue_Infobox.png/revision/latest?cb=20231025192612', pos: '46% 5%', zoom: 1.35 },
  { id: 'okoye', name: 'Okoye', emoji: '🛡️', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/25/Black_Panther_Wakanda_Forever_poster_024_Textless.jpg/revision/latest?cb=20240802144734', pos: '0% 0%' },
  { id: 'rhodey', name: 'Máquina de Combate', emoji: '🦿', movie: 'Homem de Ferro 2', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/77/WarMachine-EndgameProfile.jpg/revision/latest?cb=20231025163822', pos: '50% 7%', zoom: 1.35 },
  { id: 'yondu', name: 'Yondu', emoji: '🏹', movie: 'Guardiões da Galáxia', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/9b/Yondu_Infobox.png/revision/latest?cb=20250204003244', pos: '50% 20%' },
  { id: 'wong', name: 'Wong', emoji: '📚', movie: 'Doutor Estranho', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/0/00/Wong_in_She-Hulk.jpg/revision/latest?cb=20240802144541', pos: '50% 0%', zoom: 1.15 },
  { id: 'shuri', name: 'Shuri', emoji: '🐆', movie: 'Pantera Negra', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/7/7e/ShuriMeetsToussaint.png/revision/latest?cb=20230205163607', pos: '35% 0%' },
  { id: 'sif', name: 'Sif', emoji: '🗡️', movie: 'Thor', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/a/a6/Lady_Sif_L%26T.png/revision/latest?cb=20220908184504', pos: '50% 0%', zoom: 1.25 },
  { id: 'darcy', name: 'Darcy Lewis', emoji: '🔬', movie: 'Thor', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/2/24/Darcy_Lewis_%28Mockumentary%29.png/revision/latest?cb=20210221162445', pos: '50% 15%', zoom: 1.9 },
  { id: 'coulson', name: 'Phil Coulson', emoji: '🕶️', movie: 'Homem de Ferro', img: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/13/Phil-Coulson-gives-Gonzales-Toolbox.jpg/revision/latest?cb=20150504213953', pos: '100% 23%', zoom: 1.1 },
]
