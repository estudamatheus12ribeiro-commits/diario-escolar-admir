'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

interface SidebarProps {
  profile: Profile
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const adminMenu = [
    { href: '/dashboard', label: 'Painel', icon: '🏠' },
    { href: '/dashboard/chamada', label: 'Chamada', icon: '📋' },
    { href: '/dashboard/notas', label: 'Notas', icon: '📝' },
    { href: '/dashboard/alunos', label: 'Alunos', icon: '👨‍🎓' },
    { href: '/dashboard/turmas', label: 'Turmas', icon: '🏫' },
    { href: '/dashboard/professores', label: 'Professores', icon: '👩‍🏫' },
    { href: '/dashboard/relatorios', label: 'Relatorios', icon: '📊' },
  ]

  const coordMenu = [
    { href: '/dashboard', label: 'Painel', icon: '🏠' },
    { href: '/dashboard/chamada', label: 'Chamada', icon: '📋' },
    { href: '/dashboard/notas', label: 'Notas', icon: '📝' },
    { href: '/dashboard/alunos', label: 'Alunos', icon: '👨‍🎓' },
    { href: '/dashboard/turmas', label: 'Turmas', icon: '🏫' },
    { href: '/dashboard/professores', label: 'Professores', icon: '👩‍🏫' },
    { href: '/dashboard/relatorios', label: 'Relatorios', icon: '📊' },
  ]

  const secretariaMenu = [
    { href: '/dashboard', label: 'Painel', icon: '🏠' },
    { href: '/dashboard/alunos', label: 'Alunos', icon: '👨‍🎓' },
    { href: '/dashboard/turmas', label: 'Turmas', icon: '🏫' },
    { href: '/dashboard/relatorios', label: 'Relatorios', icon: '📊' },
  ]

  const professorMenu = [
    { href: '/dashboard', label: 'Painel', icon: '🏠' },
    { href: '/dashboard/chamada', label: 'Chamada', icon: '📋' },
    { href: '/dashboard/notas', label: 'Notas', icon: '📝' },
  ]

  const menuMap: Record<string, typeof adminMenu> = {
    administrador: adminMenu,
    coordenacao: coordMenu,
    secretaria: secretariaMenu,
    professor: professorMenu,
  }

  const menuItems = menuMap[profile.perfil] || professorMenu
  const perfilLabel: Record<string, string> = {
    administrador: 'Administrador',
    coordenacao: 'Coordenacao',
    secretaria: 'Secretaria',
    professor: 'Professor',
  }

  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-5 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-lg">
            📚
          </div>
          <div>
            <h2 className="font-bold text-sm">Diario Escolar</h2>
            <p className="text-blue-300 text-xs">Admir</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-800">
        <div className="bg-blue-800 rounded-lg p-3">
          <p className="font-medium text-sm truncate">{profile.nome}</p>
          <p className="text-blue-300 text-xs">{perfilLabel[profile.perfil]}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive(item.href) && item.href !== '/dashboard' || (item.href === '/dashboard' && pathname === '/dashboard')
                ? 'bg-blue-700 text-white'
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-blue-800">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-red-700 hover:text-white transition-colors disabled:opacity-50"
        >
          <span>🚪</span>
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </button>
      </div>
    </aside>
  )
}