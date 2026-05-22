import { createClient } from '@/lib/supabase/server'

export default async function TurmasPage() {
  const supabase = createClient()
  const { data: turmas } = await supabase.from('turmas').select('*').order('ano_escolar').order('serie')

  const turnoColors: Record<string, string> = { matutino: 'bg-blue-100 text-blue-700', integral: 'bg-green-100 text-green-700' }
  const statusColors: Record<string, string> = { ativa: 'bg-green-100 text-green-700', inativa: 'bg-red-100 text-red-700' }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Turmas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {turmas?.map(t => (
          <div key={t.id} className="bg-white rounded-xl shadow p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-lg">{t.nome}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Ano:</span>
                <span className="text-gray-700 font-medium">{t.ano_escolar}o ano - Turma {t.serie}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Turno:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${turnoColors[t.turno]}`}>{t.turno}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Ano letivo:</span>
                <span className="text-gray-700">{t.ano_letivo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}