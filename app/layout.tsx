import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Você é o Robô — Operação Agenda',
  description: 'Jogo de agendamento de laboratório: pensamento computacional na prática.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
