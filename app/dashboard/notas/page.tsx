'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Turma { id: string; nome: string }
interface Aluno { id: string; nome: string }
interface Componente { id: string; nome: string }

export default function NotasPage() {
  const supabase = createClient()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [componentes, setComponentes] = useState<Componente[]>([])
  const [turmaSel, setTurmaSel] = useState('')
  const [alunoSel, setAlunoSel] = useState('')
  const [form, setForm] = useState({ componente_id: '', bimestre: '1', tipo_avaliacao: 'prova', nota: '', data_avaliacao: '', observacao: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notasLancadas, setNotasLancadas] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('turmas').select('id, nome').eq('status', 'ativa').order('nome'),
      supabase.from('componentes_curriculares').select('id, nome').eq('ativo', true).order('nome'),
    ]).then(([{ data: t }, { data: c }]) => {
      setTurmas(t || [])
      setComponentes(c || [])
    })
  }, [])

  useEffect(() => {
    if (!turmaSel) { setAlunos([]); return }
    supabase.from('alunos').select('id, nome').eq('turma_id', turmaSel).eq('status', 'ativo').order('nome')
      .then(({ data }) => setAlunos(data || []))
  }, [turmaSel])

  useEffect(() => {
    if (!alunoSel || !turmaSel) { setNotasLancadas([]); return }
    supabase.from('notas').select('*, componente:componentes_curriculares(nome)').eq('aluno_id', alunoSel).eq('turma_id', turmaSel).order('bimestre')
      .then(({ data }) => setNotasLancadas(data || []))
  }, [alunoSel, turmaSel])

  const salvar = async () => {
    if (!alunoSel || !turmaSel || !form.componente_id || !form.nota) return
    setSaving(true)
    await supabase.from('notas').insert({
      aluno_id: alunoSel,
      turma_id: turmaSel,
      componente_id: form.componente_id,
      bimestre: parseInt(form.bimestre),
      tipo_avaliacao: form.tipo_avaliacao,
      nota: parseFloat(form.nota),
      data_avaliacao: form.data_avaliacao || null,
      observacao: form.observacao || null,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setForm({ componente_id: '', bimestre: '1', tipo_avaliacao: 'prova', nota: '', data_avaliacao: '', observacao: '' })
    // Reload notas
    const { data } = await supabase.from('notas').select('*, componente:componentes_curriculares(nome)').eq('aluno_id', alunoSel).eq('turma_id', turmaSel).order('bimestre')
    setNotasLancadas(data || [])
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lancamento de Notas</h1>

      {/* Selecao de turma e aluno */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
            <select value={turmaSel} onChange={e => { setTurmaSel(e.target.value); setAlunoSel('') }} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione a turma</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aluno</label>
            <select value={alunoSel} onChange={e => setAlunoSel(e.target.value)} disabled={!turmaSel} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
              <option value="">Selecione o aluno</option>
              {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </div>
        </div>

        {alunoSel && (
          <>
            <hr className="my-4" />
            <h3 className="font-medium text-gray-900 mb-3">Lancar Nova Nota</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Componente</label>
                <select value={form.componente_id} onChange={e => setForm({...form, componente_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione</option>
                  {componentes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bimestre</label>
                <select value={form.bimestre} onChange={e => setForm({...form, bimestre: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="1">1 Bimestre</option>
                  <option value="2">2 Bimestre</option>
                  <option value="3">3 Bimestre</option>
                  <option value="4">4 Bimestre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select value={form.tipo_avaliacao} onChange={e => setForm({...form, tipo_avaliacao: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="prova">Prova</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="atividade">Atividade</option>
                  <option value="participacao">Participacao</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota (0-10)</label>
                <input type="number" min="0" max="10" step="0.1" value={form.nota} onChange={e => setForm({...form, nota: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input type="date" value={form.data_avaliacao} onChange={e => setForm({...form, data_avaliacao: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button onClick={salvar} disabled={saving} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50">
              {saving ? 'Salvando...' : saved ? '✓ Salvo!' : 'Lancar Nota'}
            </button>
          </>
        )}
      </div>

      {/* Historico de notas */}
      {notasLancadas.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b"><h3 className="font-semibold text-gray-900">Historico de Notas</h3></div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Componente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Bimestre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {notasLancadas.map(n => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{n.componente?.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{n.bimestre}o Bimestre</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{n.tipo_avaliacao}</td>
                  <td className="px-4 py-3 font-bold ${n.nota >= 5 ? 'text-green-700' : 'text-red-700'}">{n.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}