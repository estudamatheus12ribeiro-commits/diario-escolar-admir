'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RelatoriosPage() {
  const supabase = createClient()
  const [turmas, setTurmas] = useState<any[]>([])
  const [turmaSel, setTurmaSel] = useState('')
  const [dataInicio, setDataInicio] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0])
  const [relatorio, setRelatorio] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('turmas').select('id, nome').eq('status', 'ativa').order('nome').then(({ data }) => setTurmas(data || []))
  }, [])

  const gerarRelatorio = async () => {
    if (!turmaSel) return
    setLoading(true)
    const [{ data: alunos }, { data: presencas }] = await Promise.all([
      supabase.from('alunos').select('id, nome').eq('turma_id', turmaSel).eq('status', 'ativo').order('nome'),
      supabase.from('presencas').select('*').eq('turma_id', turmaSel).gte('data', dataInicio).lte('data', dataFim)
    ])
    const rel = (alunos || []).map(a => {
      const pAluno = (presencas || []).filter(p => p.aluno_id === a.id)
      const total = pAluno.length
      const presentes = pAluno.filter(p => p.status === 'presente').length
      const faltas = pAluno.filter(p => p.status === 'falta').length
      const faltasJust = pAluno.filter(p => p.status === 'falta_justificada').length
      const freq = total > 0 ? ((presentes / total) * 100).toFixed(1) : '-'
      return { ...a, total, presentes, faltas, faltasJust, freq }
    })
    setRelatorio(rel)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Relatorios de Frequencia</h1>
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
            <select value={turmaSel} onChange={e => setTurmaSel(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicio</label>
            <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
            <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button onClick={gerarRelatorio} disabled={loading || !turmaSel} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50">
          {loading ? 'Gerando...' : 'Gerar Relatorio'}
        </button>
      </div>
      {relatorio.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aluno</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Presentes</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Faltas</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Frequencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {relatorio.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.nome}</td>
                  <td className="px-4 py-3 text-center text-green-700 font-medium">{r.presentes}</td>
                  <td className="px-4 py-3 text-center text-red-700 font-medium">{r.faltas}</td>
                  <td className="px-4 py-3 text-center font-bold">{r.freq}{r.freq !== '-' ? '%' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}