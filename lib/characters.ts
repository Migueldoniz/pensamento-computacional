export interface Character {
  id: string
  name: string
  emoji: string
}

/** Personagens secundários da Marvel para escolher como nickname. */
export const CHARACTERS: Character[] = [
  { id: 'howard', name: 'Howard, o Pato', emoji: '🦆' },
  { id: 'korg', name: 'Korg', emoji: '🪨' },
  { id: 'miek', name: 'Miek', emoji: '🦗' },
  { id: 'luis', name: 'Luis', emoji: '🗣️' },
  { id: 'ned', name: 'Ned Leeds', emoji: '🧑‍💻' },
  { id: 'happy', name: 'Happy Hogan', emoji: '🥊' },
  { id: 'darcy', name: 'Darcy Lewis', emoji: '🔬' },
  { id: 'woo', name: 'Jimmy Woo', emoji: '🕵️' },
  { id: 'mobius', name: 'Mobius M. Mobius', emoji: '🕰️' },
  { id: 'casey', name: 'Casey (TVA)', emoji: '🗄️' },
  { id: 'okoye', name: 'Okoye', emoji: '🛡️' },
  { id: 'shuri', name: 'Shuri', emoji: '🐆' },
  { id: 'nakia', name: 'Nakia', emoji: '🌿' },
  { id: 'wong', name: 'Wong', emoji: '📚' },
  { id: 'trevor', name: 'Trevor Slattery', emoji: '🎭' },
  { id: 'kraglin', name: 'Kraglin', emoji: '🏹' },
  { id: 'mantis', name: 'Mantis', emoji: '🦋' },
  { id: 'nebula', name: 'Nebula', emoji: '🤖' },
  { id: 'yelena', name: 'Yelena Belova', emoji: '🕷️' },
  { id: 'kate', name: 'Kate Bishop', emoji: '🎯' },
  { id: 'katy', name: 'Katy', emoji: '🚌' },
  { id: 'coulson', name: 'Phil Coulson', emoji: '🕶️' },
  { id: 'foggy', name: 'Foggy Nelson', emoji: '⚖️' },
  { id: 'karen', name: 'Karen Page', emoji: '📰' },
]

export function characterById(id: string): Character | undefined {
  return CHARACTERS.find((c) => c.id === id)
}
