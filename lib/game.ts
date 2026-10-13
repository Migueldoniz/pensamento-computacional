export type PhaseKind = 'info' | 'single' | 'multi' | 'order'

export interface Option {
  id: string
  label: string
}

export interface TlBlock {
  start: number // hora decimal (14.5 = 14h30)
  end: number
  label?: string
  kind: 'existing' | 'request' | 'invalid'
}

export interface TlLane {
  name: string
  blocks: TlBlock[]
}

export interface TimelineSpec {
  day: string
  window: [number, number]
  lanes: TlLane[]
}

export interface Phase {
  id: string
  act: string
  title: string
  prompt: string
  kind: PhaseKind
  options?: Option[]
  correctIds?: string[] // single: 1 item · multi: vários
  correctOrder?: string[] // order
  explain?: string
  timeline?: TimelineSpec
  robotThinking: string
  robotCorrect: string
  robotWrong: string
}

/** Codifica a escolha do jogador numa string (guardada no store). */
export function encodeChoice(kind: PhaseKind, value: string | string[]): string {
  if (Array.isArray(value)) return value.join(kind === 'order' ? '>' : ',')
  return value
}

export function isCorrect(phase: Phase | undefined, choice: string | null): boolean {
  if (!phase || !choice) return false
  if (phase.kind === 'single') return choice === phase.correctIds?.[0]
  if (phase.kind === 'multi') {
    const a = choice.split(',').filter(Boolean).sort().join(',')
    const b = (phase.correctIds || []).slice().sort().join(',')
    return a === b
  }
  if (phase.kind === 'order') return choice === (phase.correctOrder || []).join('>')
  return false
}

export const PHASES: Phase[] = [
  {
    id: 'boot',
    act: 'BOOT',
    title: 'Você é o robô',
    prompt:
      'Você é o robô de agendamento do laboratório da escola. Missão: aceitar ou recusar pedidos — sem nunca deixar duas aulas na mesma sala. A plateia te programa; no fim, você vira uma máquina afinada.',
    kind: 'info',
    robotThinking: 'Sistema iniciado. Aguardando instruções da equipe.',
    robotCorrect: '',
    robotWrong: '',
  },
  {
    id: 'sensores',
    act: 'SENSORES',
    title: 'Quais dados você enxerga?',
    prompt:
      'Seu robô recebe uma pilha de dados. Selecione TODOS os que você precisa para decidir conflito de horário.',
    kind: 'multi',
    options: [
      { id: 'data', label: 'Data da reserva' },
      { id: 'inicio', label: 'Horário inicial' },
      { id: 'fim', label: 'Horário final' },
      { id: 'existentes', label: 'Reservas já existentes' },
      { id: 'nome', label: 'Nome do solicitante' },
      { id: 'celular', label: 'Modelo do celular' },
    ],
    correctIds: ['data', 'inicio', 'fim', 'existentes'],
    explain:
      'Abstrair é escolher o que importa para uma finalidade. Data + início + fim + reservas existentes alimentam a decisão. O nome identifica o responsável (mas não decide conflito) e o celular é irrelevante.',
    robotThinking: 'Processando 6 tipos de dados…',
    robotCorrect: 'Sensores calibrados: só o essencial.',
    robotWrong: 'Fiquei com dados inúteis entupindo meu processamento.',
  },
  {
    id: 'cerebro',
    act: 'CÉREBRO',
    title: 'O que NÃO é sua responsabilidade?',
    prompt:
      'Para decidir conflito, você segue alguns passos. Um destes NÃO é sua responsabilidade AGORA. Qual?',
    kind: 'single',
    options: [
      { id: 'validar', label: 'Validar o intervalo (início antes do fim)' },
      { id: 'selecionar', label: 'Selecionar reservas da mesma data' },
      { id: 'autenticar', label: 'Autenticar quem está pedindo a reserva' },
      { id: 'comparar', label: 'Comparar sobreposição entre intervalos' },
    ],
    correctIds: ['autenticar'],
    explain:
      'Decompor é separar responsabilidades. Autenticar existe, mas não neste nível. Guarde esta carta: ela volta na Temporada 2.',
    robotThinking: 'Dividindo a decisão em responsabilidades…',
    robotCorrect: 'Etapa removida. Fluxo enxuto.',
    robotWrong: 'Erro: assumi uma tarefa que não era minha agora.',
  },
  {
    id: 'plano',
    act: 'PLANO',
    title: 'Monte o plano de decisão',
    prompt:
      'Coloque as etapas na ordem correta para decidir se uma reserva entra. Toque na ordem que você acha certa e envie.',
    kind: 'order',
    options: [
      { id: 'selecionar', label: 'Selecionar reservas da mesma data' },
      { id: 'receber', label: 'Receber data, início e fim' },
      { id: 'sobrepor', label: 'Verificar sobreposição com as selecionadas' },
      { id: 'validar', label: 'Verificar se o início antecede o fim' },
      { id: 'decidir', label: 'Rejeitar se houver conflito; senão aceitar' },
      { id: 'obrigatorios', label: 'Verificar dados obrigatórios' },
    ],
    correctOrder: ['receber', 'obrigatorios', 'validar', 'selecionar', 'sobrepor', 'decidir'],
    explain:
      'Primeiro receber e checar os dados; validar o intervalo; só então buscar reservas do mesmo dia e comparar sobreposição; por fim decidir. Ordem errada gera bug.',
    robotThinking: 'Montando o fluxo de decisão…',
    robotCorrect: 'Fluxo na ordem certa. Nada de conflito.',
    robotWrong: 'Meu fluxo ficou embaralhado — vou errar feio.',
  },
  {
    id: 'd1',
    act: 'DECISÃO 1/5',
    title: 'Pedido: 14h30 – 15h30',
    prompt:
      'Já existe aula aprovada das 14h às 15h. Chegou um pedido das 14h30 às 15h30. Aceitar ou recusar?',
    kind: 'single',
    options: [
      { id: 'aceitar', label: 'Aceitar' },
      { id: 'recusar', label: 'Recusar' },
    ],
    correctIds: ['recusar'],
    timeline: {
      day: 'hoje',
      window: [13, 17],
      lanes: [
        {
          name: 'Laboratório',
          blocks: [
            { start: 14, end: 15, label: 'aprovada 14–15', kind: 'existing' },
            { start: 14.5, end: 15.5, label: 'pedido', kind: 'request' },
          ],
        },
      ],
    },
    explain: 'Há sobreposição: 14h30–15h30 invade o intervalo 14h–15h. Recusar.',
    robotThinking: 'Comparando intervalos…',
    robotCorrect: 'Recusei. Duas aulas não cabem na mesma sala.',
    robotWrong: 'PERIGO: deixei duas turmas na mesma sala!',
  },
  {
    id: 'd2',
    act: 'DECISÃO 2/5',
    title: 'Pedido: 15h – 16h  (fronteira)',
    prompt:
      'A aula existente termina às 15h. Chegou um pedido começando exatamente às 15h. Aceitar ou recusar?',
    kind: 'single',
    options: [
      { id: 'aceitar', label: 'Aceitar' },
      { id: 'recusar', label: 'Recusar' },
    ],
    correctIds: ['aceitar'],
    timeline: {
      day: 'hoje',
      window: [13, 17],
      lanes: [
        {
          name: 'Laboratório',
          blocks: [
            { start: 14, end: 15, label: 'aprovada 14–15', kind: 'existing' },
            { start: 15, end: 16, label: 'pedido', kind: 'request' },
          ],
        },
      ],
    },
    explain:
      'O instante final não pertence ao período ocupado. 15h começa quando a outra termina: NÃO há conflito. A fronteira engana a intuição.',
    robotThinking: 'Verificando a fronteira…',
    robotCorrect: 'Aceitei. Encaixou certinho, sem sobreposição.',
    robotWrong: 'Recusei uma aula válida! Corredor vazio à toa.',
  },
  {
    id: 'd3',
    act: 'DECISÃO 3/5',
    title: 'Pedido: 16h – 15h',
    prompt: 'Chegou um pedido das 16h às 15h. Aceitar ou recusar?',
    kind: 'single',
    options: [
      { id: 'aceitar', label: 'Aceitar' },
      { id: 'recusar', label: 'Recusar' },
    ],
    correctIds: ['recusar'],
    explain:
      'Intervalo inválido: o início precisa ser anterior ao fim. Antes de comparar conflito, valide o intervalo.',
    robotThinking: 'Validando o intervalo…',
    robotCorrect: 'Recusei. Um horário que termina antes de começar não existe.',
    robotWrong: 'Erro fatal: aceitei uma reserva impossível.',
  },
  {
    id: 'd4',
    act: 'DECISÃO 4/5',
    title: 'Pedido: 15h – 15h30  (encaixe entre duas)',
    prompt:
      'Existem DUAS aulas aprovadas: 14h–15h e 15h30–16h30, na mesma sala. Chegou um pedido das 15h às 15h30. Aceitar ou recusar?',
    kind: 'single',
    options: [
      { id: 'aceitar', label: 'Aceitar' },
      { id: 'recusar', label: 'Recusar' },
    ],
    correctIds: ['aceitar'],
    timeline: {
      day: 'hoje',
      window: [13, 17],
      lanes: [
        {
          name: 'Laboratório',
          blocks: [
            { start: 14, end: 15, label: '14–15', kind: 'existing' },
            { start: 15.5, end: 16.5, label: '15h30–16h30', kind: 'existing' },
            { start: 15, end: 15.5, label: 'pedido', kind: 'request' },
          ],
        },
      ],
    },
    explain:
      'O pedido encosta no FIM da primeira (15h) e no INÍCIO da segunda (15h30). Encostar é permitido — não há sobreposição. Compare com todas e aceite: é um encaixe perfeito.',
    robotThinking: 'Verificando as duas pontas…',
    robotCorrect: 'Aceitei: encostou nas duas e ainda sobrou espaço.',
    robotWrong: 'Recusei um encaixe perfeito!',
  },
  {
    id: 'd5',
    act: 'DECISÃO 5/5',
    title: 'Pedido: 15h15 – 15h45  (invade a segunda)',
    prompt:
      'Mesma situação: aprovadas 14h–15h e 15h30–16h30, na mesma sala. Agora o pedido é das 15h15 às 15h45. Aceitar ou recusar?',
    kind: 'single',
    options: [
      { id: 'aceitar', label: 'Aceitar' },
      { id: 'recusar', label: 'Recusar' },
    ],
    correctIds: ['recusar'],
    timeline: {
      day: 'hoje',
      window: [13, 17],
      lanes: [
        {
          name: 'Laboratório',
          blocks: [
            { start: 14, end: 15, label: '14–15', kind: 'existing' },
            { start: 15.5, end: 16.5, label: '15h30–16h30', kind: 'existing' },
            { start: 15.25, end: 15.75, label: 'pedido', kind: 'request' },
          ],
        },
      ],
    },
    explain:
      'O pedido NÃO toca a primeira reserva (começa depois das 15h), mas invade a segunda (15h30–16h30). Basta UM conflito — e ele pode estar em qualquer reserva, não só na primeira.',
    robotThinking: 'Comparando com a segunda reserva…',
    robotCorrect: 'Recusei: conflitei com a segunda reserva, não com a primeira.',
    robotWrong: 'Escapou! Eu só comparei com a primeira reserva.',
  },
  {
    id: 'boss',
    act: 'CHEFÃO',
    title: 'Agora há DOIS laboratórios',
    prompt:
      'A escola abriu o laboratório B. Reservas no mesmo horário podem existir se forem em salas diferentes. O que muda em você, robô?',
    kind: 'single',
    options: [
      { id: 'nada', label: 'Nada — continuo com a regra antiga' },
      { id: 'labdata', label: 'Adicionar o laboratório e comparar por data + laboratório' },
      { id: 'recusar', label: 'Recusar tudo que tiver o mesmo horário' },
      { id: 'duplicar', label: 'Virar dois robôs, um para cada sala' },
    ],
    correctIds: ['labdata'],
    timeline: {
      day: 'hoje',
      window: [13, 17],
      lanes: [
        { name: 'Lab A', blocks: [{ start: 14, end: 15, label: 'aula', kind: 'existing' }] },
        { name: 'Lab B', blocks: [{ start: 14, end: 15, label: 'pedido (ok!)', kind: 'request' }] },
      ],
    },
    explain:
      'Um dado novo entra (o laboratório) e a comparação passa a filtrar por data E laboratório. Escalar não é só “criar outra lista”.',
    robotThinking: 'Detectei um recurso novo…',
    robotCorrect: 'Atualizado: agora comparo data + laboratório.',
    robotWrong: 'Confusão: tratei salas diferentes como se fossem a mesma.',
  },
  {
    id: 'outro',
    act: 'FINAL',
    title: 'Robô calibrado — mas e as regras?',
    prompt:
      'Você representou os dados, dividiu a decisão, montou o plano e escalou para dois laboratórios. Mas quem confirmou essas regras? Na Temporada 2, a carta “autenticar” volta: só a Coordenação aprova, e uma solicitação nasce pendente. A pergunta deixa de ser “como funciona?” e passa a ser “resolve o problema certo?”.',
    kind: 'info',
    robotThinking: 'Aguardando novos requisitos…',
    robotCorrect: '',
    robotWrong: '',
  },
]

/** Contagem por opção para os desafios de escolha. */
export function optionCounts(votes: Record<string, string> | undefined, phase: Phase) {
  const out: Record<string, number> = {}
  phase.options?.forEach((o) => (out[o.id] = 0))
  if (votes) {
    for (const raw of Object.values(votes)) {
      if (phase.kind === 'multi') {
        raw.split(',').filter(Boolean).forEach((id) => (out[id] = (out[id] || 0) + 1))
      } else {
        out[raw] = (out[raw] || 0) + 1
      }
    }
  }
  return out
}

/** Quantos jogadores acertaram exatamente (single/multi/order). */
export function correctSoFar(votes: Record<string, string> | undefined, phase: Phase) {
  if (!votes) return 0
  return Object.values(votes).filter((c) => isCorrect(phase, c)).length
}
