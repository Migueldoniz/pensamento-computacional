export type PhaseKind = 'info' | 'objetivos' | 'conceito' | 'pesquisa' | 'regras' | 'debrief' | 'premiacao' | 'single' | 'multi' | 'order'

export interface Option {
  id: string
  label: string
}

export interface Objective {
  text: string
  cell: string
}

export interface ConceptStep {
  label: string
  detail?: string
}

export interface Research {
  intro?: string
  prompt: string
  scaffold?: string[]
  example?: { label: string; value: string }[]
  exampleNote?: string
  excerpt?: string
  template?: string
  hint?: string
  sourceLabel?: string
  sourceUrl?: string
  minutes: number
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
  activity: number // 1..5
  title: string
  prompt: string
  kind: PhaseKind
  options?: Option[]
  correctIds?: string[] // single: 1 item · multi: vários
  correctOrder?: string[] // order
  explain?: string
  timeline?: TimelineSpec
  objectives?: Objective[] // kind 'objetivos'
  concept?: ConceptStep[] // kind 'conceito'
  definition?: string // conceito: definição destacada
  strategies?: { name: string; detail?: string }[] // estratégias (ex.: de abstração)
  note?: string // observação final da fase
  pillars?: { name: string; detail?: string }[] // kind 'debrief'
  quote?: string // kind 'debrief'
  question?: string // kind 'debrief' (reflexão)
  sources?: string[] // referências mostradas na fase
  research?: Research // kind 'pesquisa'
  rules?: string[] // kind 'regras'
  robotThinking: string
  robotCorrect: string
  robotWrong: string
}

/** Nome de cada uma das 5 atividades (3 min cada). */
export const ACTIVITIES: Record<number, string> = {
  1: 'Fundamentos',
  2: 'Pesquisa',
  3: 'Jogo',
  4: 'Simulação',
  5: 'Transferência',
}

export function isInteractive(kind: PhaseKind) {
  return kind === 'single' || kind === 'multi' || kind === 'order'
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
    id: 'objetivos',
    act: 'OBJETIVOS',
    activity: 1,
    title: 'Objetivos da disciplina',
    prompt:
      'Computar é decidir: um programa é uma máquina que decide contra o que o ambiente manda. Base da aula (Taxonomia de Bloom Revisada):',
    kind: 'objetivos',
    objectives: [
      { text: 'Entender o que é uma decisão computável (decidir caso a caso).', cell: 'B2' },
      { text: 'Analisar quais dados bastam para decidir um conflito (abstração).', cell: 'B4' },
      { text: 'Decompor a decisão e distinguir o que conflita.', cell: 'B4' },
      { text: 'Planejar as verificações para aceitar ou rejeitar uma reserva.', cell: 'C6' },
      { text: 'Transferir o plano para um cenário novo (dois laboratórios).', cell: 'A1' },
    ],
    robotThinking: 'Objetivos carregados. Pronto para jogar.',
    robotCorrect: '',
    robotWrong: '',
  },
  {
    id: 'conceito',
    act: 'CONCEITO',
    activity: 1,
    title: 'O centro da aula: abstrair a decisão humana',
    prompt:
      'Algumas decisões os humanos tomam de bate-pronto, mas a máquina quase não consegue. Por quê?',
    kind: 'conceito',
    concept: [
      { label: 'Decisão humana "de bate-pronto"', detail: '"Essa mensagem é um elogio ou uma zombaria?" — você decide na hora, pelo tom e pelo contexto.' },
      { label: 'Por que a máquina trava', detail: 'Não há dado claro nem regra clara. O que representar: o texto? o tom? o histórico? Só decidir o que representar já é difícil.' },
      { label: 'Abstrair = escolher o que representar', detail: 'Sem uma boa abstração (dados + regras), não existe decisão computacional. É aí que entra o pensamento computacional.' },
      { label: 'Contraste: uma decisão que abstrai bem', detail: '"Cabe uma reserva das 15h às 16h?" → dados: data, início, fim, reservas; regra: sobreposição. Fácil de formalizar — e de decompor.' },
      { label: 'Decompor', detail: 'receber → validar → selecionar → comparar → decidir.' },
      { label: 'O que fica', detail: 'O difícil não é programar — é achar a abstração certa. Computar é decidir.' },
    ],
    sources: [
      'Japaridze (2003) — computação como jogo máquina × ambiente',
      'Bombasar, Raabe & Santiago (2017) — ensinar pensamento computacional com um jogo',
      'Wing (2006) — abstração e decomposição',
    ],
    robotThinking: 'Abstraindo a decisão humana…',
    robotCorrect: '',
    robotWrong: '',
  },
  {
    id: 'abstracao',
    act: 'ABSTRAÇÃO',
    activity: 1,
    title: 'O que é abstração — e como se faz',
    prompt: 'A essência do pensamento computacional é a abstração. Vamos dar nome às peças.',
    kind: 'conceito',
    definition:
      'Abstração é construir uma representação adequada a um PROPÓSITO: destacar o que é relevante e deixar de fora o que não importa naquele contexto. Não é só “simplificar” — a representação precisa continuar dando conta do problema.',
    strategies: [
      { name: 'Selecionar propriedades (filtro de detalhes)', detail: 'Deixar de fora o que não muda a decisão → Abstração de Dados: (sala, início, fim, solicitante).' },
      { name: 'Generalizar (achar o padrão)', detail: 'Uma representação que serve para muitos casos — em vez de uma solução por caso.' },
      { name: 'Separar interface de implementação', detail: 'Usar “há conflito?” sabendo o que faz e devolve — sem ver como funciona por dentro (abstração procedural).' },
      { name: 'Relacionar camadas', detail: 'Especificação → algoritmo → implementação: o que cada nível deixa explícito e o que esconde.' },
      { name: 'Cuidado: limites de borda', detail: 'Onde a abstração perde informação — ex.: o instante 15h e o tempo de troca de turma.' },
    ],
    note:
      'No jogo de hoje: SENSORES = Abstração de Dados · CÉREBRO = Abstração Procedural + Decomposição. No fim, veremos onde a abstração perde informação.',
    sources: [
      'Wing (2006; 2008): decidir o que destacar/ignorar; camadas e relações entre elas.',
      'Kramer (2007): seleção de detalhes + generalização — e a abstração depende do propósito.',
      'Armoni (2013): como ensinar abstração a iniciantes (omitir + justificar + revisar).',
    ],
    robotThinking: 'Nomeando as estratégias de abstração…',
    robotCorrect: '',
    robotWrong: '',
  },
  {
    id: 'boot',
    act: 'BOOT',
    activity: 1,
    title: 'Você é o robô',
    prompt:
      'Você é o robô de agendamento do laboratório. Missão: aceitar ou recusar pedidos — sem nunca deixar duas aulas na mesma sala. Entre pela sua tela e escolha um personagem.',
    kind: 'info',
    robotThinking: 'Sistema iniciado. Aguardando a equipe entrar.',
    robotCorrect: '',
    robotWrong: '',
  },
  {
    id: 'pesquisa',
    act: 'PESQUISA',
    activity: 2,
    title: 'Pesquisa (3 minutos)',
    prompt: 'Pesquise na internet e traga 1 regra. Depois voltamos para o jogo.',
    kind: 'pesquisa',
    research: {
      intro: 'Transforme uma decisão do seu dia numa decisão "computável" — usando abstração.',
      prompt:
        'Escolha uma decisão simples do seu dia e diga: (1) quais informações importam, (2) quais não importam e (3) em que passos você decide.',
      scaffold: [
        'Escolha uma decisão do dia (ex.: "dá pra encaixar mais uma reunião na minha agenda?").',
        'O que realmente impacta a decisão? (o que você destaca)',
        'O que não importa para realizar a decisão? (o que você ignora)',
        'Em que etapas você decide, na ordem? (mínimo 3 passos)',
      ],
      example: [
        { label: 'Decisão', value: 'qual fila do supermercado escolher' },
        { label: 'Destacar', value: 'nº de pessoas na fila · itens de cada pessoa · caixas abertos' },
        { label: 'Ignorar', value: 'cor da roupa · o que estão comprando' },
        { label: 'Passos', value: 'contar as pessoas → estimar os itens → comparar as filas → escolher' },
      ],
      exampleNote:
        'Exemplo do próprio Wing (2006): “Which line do you stand in at the supermarket? That’s performance modeling”.',
      template: 'Decisão: ____   ·   Destacar: ____   ·   Ignorar: ____   ·   Passos: ____',
      hint: 'Registre no chat do Meet (ou Mentimeter/Padlet).',
      sourceLabel: 'Abrir as fontes (Wing 2006 + Bombasar et al. 2017)',
      sourceUrl: '/fonte',
      minutes: 3,
    },
    robotThinking: 'Enquanto vocês pesquisam, eu espero.',
    robotCorrect: '',
    robotWrong: '',
  },
  {
    id: 'regras',
    act: 'REGRAS',
    activity: 3,
    title: 'As regras do caso',
    prompt: 'Antes de decidir, combine as regras do laboratório:',
    kind: 'regras',
    rules: [
      'Há um único laboratório.',
      'Toda reserva começa e termina no mesmo dia.',
      'O início deve anteceder o fim.',
      'Reservas aceitas não podem se sobrepor.',
      'Uma reserva pode começar exatamente quando outra termina.',
    ],
    robotThinking: 'Regras carregadas. Quando quiserem, decidam.',
    robotCorrect: '',
    robotWrong: '',
  },
  {
    id: 'sensores',
    act: 'SENSORES',
    activity: 3,
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
      'Abstrair é acertar o conjunto: se faltar um dado essencial, você não consegue decidir; se incluir demais, fica lento e se confunde. Data + início + fim + reservas existentes alimentam a decisão. O nome identifica o responsável (mas não decide conflito) e o celular é irrelevante.',
    robotThinking: 'Processando 6 tipos de dados…',
    robotCorrect: 'Sensores calibrados: só o essencial.',
    robotWrong: 'Fiquei com dados inúteis entupindo meu processamento.',
  },
  {
    id: 'cerebro',
    act: 'CÉREBRO',
    activity: 3,
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
    act: 'ALGORITMO',
    activity: 4,
    title: 'Projeto de algoritmo: monte o plano',
    prompt:
      'Coloque as etapas na ordem correta para decidir se uma reserva entra e envie.',
    definition:
      'Algoritmo é uma sequência finita de passos que transforma uma ENTRADA numa SAÍDA esperada (Wing, 2008: “um algoritmo é uma abstração de um procedimento passo a passo”). Aqui: entrada = os dados da reserva; saída = “aceitar” ou “recusar”. Ordenar bem os passos é, literalmente, montar o algoritmo.',
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
      'Esta é uma sequência de referência (uma ordem possível), não a única implementação. Primeiro receber e checar os dados; validar o intervalo; só então buscar reservas do mesmo dia e comparar sobreposição; por fim decidir.',
    robotThinking: 'Montando o fluxo de decisão…',
    robotCorrect: 'Fluxo na ordem certa. Nada de conflito.',
    robotWrong: 'Meu fluxo ficou embaralhado — vou errar feio.',
  },
  {
    id: 'd1',
    act: 'DECISÃO 1/5',
    activity: 4,
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
    activity: 4,
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
    activity: 4,
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
    activity: 5,
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
    activity: 5,
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
    activity: 5,
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
    id: 'debrief',
    act: 'DEBRIEF',
    activity: 5,
    title: 'O que vocês acabaram de fazer',
    prompt:
      'Mais do que “usar um app”: vocês exercitaram os pilares do pensamento computacional.',
    kind: 'debrief',
    pillars: [
      { name: 'Abstração', detail: 'Escolher o que representar (os dados) para um propósito.' },
      { name: 'Decomposição', detail: 'Separar responsabilidades — validar não é comparar.' },
      { name: 'Reconhecimento de padrões', detail: 'Generalizar: a mesma regra serve para sala, fila, agenda.' },
      { name: 'Projeto de algoritmo', detail: 'Ordenar as etapas que resolvem o problema.' },
      { name: 'Avaliação', detail: 'Julgar a decisão — e onde a abstração falha (a borda).' },
    ],
    quote: 'Computação é a automação das nossas abstrações. (Wing, 2006)',
    question:
      'Qual suposição você fez hoje e precisou revisar? Que estratégia de abstração ajudou?',
    sources: ['Wing (2006; 2008) — abstração, camadas e automação'],
    robotThinking: 'Consolidando o que aprendemos…',
    robotCorrect: '',
    robotWrong: '',
  },
  {
    id: 'outro',
    act: 'ENCERRAMENTO',
    activity: 5,
    title: 'Fim da missão',
    prompt:
      'Aguardo vocês para a nossa próxima missão: quando as regras que nos deram não bastarem, vamos descobrir quem realmente decide.',
    kind: 'premiacao',
    sources: ['Wing (2006; 2008)', 'Kramer (2007)', 'Armoni (2013)'],
    robotThinking: 'Missão cumprida.',
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
