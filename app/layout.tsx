import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Diario Escolar Admir',
  description: 'Sistema de Diario Escolar - Escola Admir',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}