import { createClient } from '@/lib/supabase/server'

export default async function ProfessoresPage() {
  const supabase = createClient()
  const { data: professores } = await supabase.from('professores').select('*').order('nome')
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Professores</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nome</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {professores?.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{p.nome}</td>
                <td className="px-5 py-3 text-gray-600">{p.email || '-'}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t text-sm text-gray-400">{professores?.length || 0} professores</div>
      </div>
    </div>
  )
}