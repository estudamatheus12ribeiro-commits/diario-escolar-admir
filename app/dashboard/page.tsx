import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  // Stats
  const [{ count: totalAlunos }, { count: totalTurmas }, { count: totalProfessores }] = await Promise.all([
    supabase.from('alunos').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
    supabase.from('turmas').select('*', { count: 'exact', head: true }).eq('status', 'ativa'),
    supabase.from('professores').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
  ])

  const hoje = new Date().toISOString().split('T')[0]
  const { count: presencasHoje } = await supabase
    .from('presencas')
    .select('*', { count: 'exact', head: true })
    .eq('data', hoje)

  const perfis: Record<string, string> = {
    administrador: 'Administrador',
    coordenacao: 'Coordenacao',
    secretaria: 'Secretaria',
    professor: 'Professor',
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {profile.nome}!
        </h1>
        <p className="text-gray-500">{perfis[profile.perfil]} - Diario Escolar Admir</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Alunos Ativos" value={totalAlunos || 0} color="blue" icon="students" />
        <StatCard title="Turmas Ativas" value={totalTurmas || 0} color="green" icon="classes" />
        {profile.perfil !== 'professor' && (
          <StatCard title="Professores" value={totalProfessores || 0} color="purple" icon="teachers" />
        )}
        <StatCard title="Presencas Hoje" value={presencasHoje || 0} color="orange" icon="attendance" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acoes Rapidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/dashboard/chamada" className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-center">
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium text-blue-700">Fazer Chamada</span>
          </a>
          {profile.perfil !== 'professor' && (
            <>
              <a href="/dashboard/alunos" className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-center">
                <span className="text-2xl mb-2">👨‍🎓</span>
                <span className="text-sm font-medium text-green-700">Alunos</span>
              </a>
              <a href="/dashboard/turmas" className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-center">
                <span className="text-2xl mb-2">🏫</span>
                <span className="text-sm font-medium text-purple-700">Turmas</span>
              </a>
              <a href="/dashboard/relatorios" className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition text-center">
                <span className="text-2xl mb-2">📊</span>
                <span className="text-sm font-medium text-orange-700">Relatorios</span>
              </a>
            </>
          )}
          <a href="/dashboard/notas" className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition text-center">
            <span className="text-2xl mb-2">📝</span>
            <span className="text-sm font-medium text-yellow-700">Notas</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  }

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 ${colors[color]} rounded-full flex items-center justify-center text-white text-xl`}>
          {icon === 'students' ? '👨‍🎓' : icon === 'classes' ? '🏫' : icon === 'teachers' ? '👩‍🏫' : '📋'}
        </div>
      </div>
    </div>
  )
}