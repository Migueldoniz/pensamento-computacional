export interface Option {
  id: string
  label: string
}

export interface Phase {
  id: string
  act: string
  title: string
  prompt: string
  options?: Option[]
  correctId?: string
  explain?: string
  robotThinking: string
  robotCorrect: string
  robotWrong: string
}

/**
 * "Você é o Robô" — roteiro da Aula 1 (pensamento computacional aplicado ao
 * agendamento do laboratório). O robô só decide com o que a plateia entrega.
 */
export const PHASES: Phase[] = [
  {
    id: 'boot',
    act: 'BOOT',
    title: 'Você é o robô',
    prompt:
      'Você é o robô de agendamento do laboratório da escola. Sua missão: aceitar ou recusar pedidos — sem nunca deixar duas aulas na mesma sala. A plateia vai te programar. Entre pelo QR ao lado.',
    robotThinking:
      'Sistema iniciado. Aguardando instruções da equipe.',
    robotCorrect: '',
    robotWrong: '',
  },
  {
    id: 'sensores',
    act: 'SENSORES',
    title: 'Quais dados você enxerga?',
    prompt:
      'Chegou uma pilha de dados. Você, robô, só deve usar o que ajuda a decidir conflito de horário. Qual destes você deve IGNORAR?',
    options: [
      { id: 'data', label: 'Data da reserva' },
      { id: 'inicio', label: 'Horário inicial' },
      { id: 'celular', label: 'Modelo do celular do solicitante' },
      { id: 'existentes', label: 'Reservas já existentes' },
    ],
    correctId: 'celular',
    explain:
      'Abstrair é escolher o que importa para uma finalidade. O modelo do celular não participa de nenhuma comparação de intervalos.',
    robotThinking: 'Processando 7 tipos de dados…',
    robotCorrect: 'Sensor desligado. Fiquei mais rápido.',
    robotWrong: 'Aviso: estou usando dados inúteis e ficando lento.',
  },
  {
    id: 'cerebro',
    act: 'CÉREBRO',
    title: 'O que é (e o que não é) sua responsabilidade?',
    prompt:
      'Para decidir conflito, você segue alguns passos. Um destes NÃO é sua responsabilidade AGORA. Qual?',
    options: [
      { id: 'validar', label: 'Validar o intervalo (início antes do fim)' },
      { id: 'selecionar', label: 'Selecionar reservas da mesma data' },
      { id: 'autenticar', label: 'Autenticar quem está pedindo a reserva' },
      { id: 'comparar', label: 'Comparar sobreposição entre intervalos' },
    ],
    correctId: 'autenticar',
    explain:
      'Decompor é separar responsabilidades. Verificar validade e detectar conflito são etapas distintas. Autenticar existe — mas não neste nível. Guarde esta carta: ela volta na Temporada 2.',
    robotThinking: 'Dividindo a decisão em responsabilidades…',
    robotCorrect: 'Etapa removida. Fluxo enxuto.',
    robotWrong: 'Erro: assumi uma tarefa que não era minha agora.',
  },
  {
    id: 'd1',
    act: 'DECISÃO 1/3',
    title: 'Pedido: 14h30 – 15h30',
    prompt:
      'Já existe aula aprovada das 14h às 15h, nesta sala. Chegou um pedido das 14h30 às 15h30. Aceitar ou recusar?',
    options: [
      { id: 'aceitar', label: 'Aceitar' },
      { id: 'recusar', label: 'Recusar' },
    ],
    correctId: 'recusar',
    explain: 'Há sobreposição: 14h30–15h invade o intervalo 14h–15h. Recusar.',
    robotThinking: 'Comparando intervalos…',
    robotCorrect: 'Recusei. Duas aulas não cabem na mesma sala.',
    robotWrong: 'PERIGO: deixei duas turmas entrarem na mesma sala!',
  },
  {
    id: 'd2',
    act: 'DECISÃO 2/3',
    title: 'Pedido: 15h – 16h  (pegadinha)',
    prompt:
      'A aula existente termina às 15h. Chegou um pedido começando exatamente às 15h. Aceitar ou recusar?',
    options: [
      { id: 'aceitar', label: 'Aceitar' },
      { id: 'recusar', label: 'Recusar' },
    ],
    correctId: 'aceitar',
    explain:
      'Pela convenção, o instante final não pertence ao período ocupado. 15h começa quando a outra termina: NÃO há conflito. A fronteira engana a intuição.',
    robotThinking: 'Verificando a fronteira…',
    robotCorrect: 'Aceitei. Encaixou certinho, sem sobreposição.',
    robotWrong: 'Recusei uma aula válida! O corredor ficou vazio à toa.',
  },
  {
    id: 'd3',
    act: 'DECISÃO 3/3',
    title: 'Pedido: 16h – 15h',
    prompt:
      'Chegou um pedido das 16h às 15h. Aceitar ou recusar?',
    options: [
      { id: 'aceitar', label: 'Aceitar' },
      { id: 'recusar', label: 'Recusar' },
    ],
    correctId: 'recusar',
    explain:
      'Intervalo inválido: o início precisa ser anterior ao fim. Antes de comparar conflito, valide o intervalo.',
    robotThinking: 'Validando o intervalo…',
    robotCorrect: 'Recusei. Um horário que termina antes de começar não existe.',
    robotWrong: 'Erro fatal: aceitei uma reserva impossível.',
  },
  {
    id: 'boss',
    act: 'CHEFÃO',
    title: 'Agora há DOIS laboratórios',
    prompt:
      'A escola abriu o laboratório B. Reservas no mesmo horário podem existir se forem em salas diferentes. O que muda em você, robô?',
    options: [
      { id: 'nada', label: 'Nada — continuo com a regra antiga' },
      { id: 'labdata', label: 'Adicionar o laboratório e comparar por data + laboratório' },
      { id: 'recusar', label: 'Recusar tudo que tiver o mesmo horário' },
      { id: 'duplicar', label: 'Virar dois robôs, um para cada sala' },
    ],
    correctId: 'labdata',
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
      'Você representou os dados, dividiu a decisão e escalou para dois laboratórios. Mas quem confirmou essas regras? Na Temporada 2, a carta “autenticar” volta: descobrimos que só a Coordenação aprova — e que uma solicitação nasce pendente. A pergunta deixa de ser “como funciona?” e passa a ser “resolve o problema certo?”.',
    robotThinking: 'Aguardando novos requisitos…',
    robotCorrect: '',
    robotWrong: '',
  },
]

export function tally(votes: Record<string, string> | undefined, options?: Option[]) {
  const out: Record<string, number> = {}
  options?.forEach((o) => (out[o.id] = 0))
  if (votes) for (const choice of Object.values(votes)) out[choice] = (out[choice] || 0) + 1
  return out
}
