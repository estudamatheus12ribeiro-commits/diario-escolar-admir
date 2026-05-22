'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Turma { id: string; nome: string; turno: string }
interface Aluno { id: string; nome: string }
interface StatusPresenca { [alunoId: string]: 'presente' | 'falta' | 'falta_justificada' }

export default function ChamadaPage() {
  const supabase = createClient()
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [turmaSelecionada, setTurmaSelecionada] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [turno, setTurno] = useState<'matutino' | 'integral'>('matutino')
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [statusMap, setStatusMap] = useState<StatusPresenca>({})
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loadingAlunos, setLoadingAlunos] = useState(false)

  useEffect(() => {
    supabase.from('turmas').select('id, nome, turno').eq('status', 'ativa').order('nome')
      .then(({ data }) => setTurmas(data || []))
  }, [])

  useEffect(() => {
    if (!turmaSelecionada) { setAlunos([]); return }
    setLoadingAlunos(true)
    
    Promise.all([
      supabase.from('alunos').select('id, nome').eq('turma_id', turmaSelecionada).eq('status', 'ativo').order('nome'),
      supabase.from('presencas').select('*').eq('turma_id', turmaSelecionada).eq('data', data).eq('turno', turno)
    ]).then(([{ data: alunosData }, { data: presencasData }]) => {
      setAlunos(alunosData || [])
      const map: StatusPresenca = {}
      alunosData?.forEach(a => { map[a.id] = 'presente' })
      presencasData?.forEach(p => { map[p.aluno_id] = p.status })
      setStatusMap(map)
      setLoadingAlunos(false)
    })
  }, [turmaSelecionada, data, turno])

  const toggleStatus = (alunoId: string) => {
    setStatusMap(prev => {
      const current = prev[alunoId] || 'presente'
      const next = current === 'presente' ? 'falta' : current === 'falta' ? 'falta_justificada' : 'presente'
      return { ...prev, [alunoId]: next }
    })
  }

  const salvarChamada = async () => {
    if (!turmaSelecionada || alunos.length === 0) return
    setLoading(true)
    setSaved(false)

    const registros = alunos.map(a => ({
      aluno_id: a.id,
      turma_id: turmaSelecionada,
      data,
      turno,
      status: statusMap[a.id] || 'presente',
    }))

    const { error } = await supabase.from('presencas').upsert(registros, {
      onConflict: 'aluno_id,turma_id,data,turno'
    })

    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    setLoading(false)
  }

  const statusColors = {
    presente: 'bg-green-100 text-green-700 border-green-300',
    falta: 'bg-red-100 text-red-700 border-red-300',
    falta_justificada: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  }

  const statusLabels = {
    presente: 'P',
    falta: 'F',
    falta_justificada: 'FJ',
  }

  const presentes = Object.values(statusMap).filter(s => s === 'presente').length
  const faltas = Object.values(statusMap).filter(s => s === 'falta').length
  const faltasJust = Object.values(statusMap).filter(s => s === 'falta_justificada').length

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Chamada Diaria</h1>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
            <select
              value={turmaSelecionada}
              onChange={e => setTurmaSelecionada(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Selecione a turma</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
            <select
              value={turno}
              onChange={e => setTurno(e.target.value as 'matutino' | 'integral')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="matutino">Matutino</option>
              <option value="integral">Integral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de alunos */}
      {loadingAlunos ? (
        <div className="text-center py-8 text-gray-500">Carregando alunos...</div>
      ) : alunos.length > 0 ? (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-700">{presentes}</div>
              <div className="text-xs text-green-600">Presentes</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-700">{faltas}</div>
              <div className="text-xs text-red-600">Faltas</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-700">{faltasJust}</div>
              <div className="text-xs text-yellow-600">Justificadas</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden mb-4">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="font-medium text-gray-700">Alunos ({alunos.length})</span>
              <span className="text-xs text-gray-400">Clique para alternar: P → F → FJ</span>
            </div>
            <div className="divide-y divide-gray-100">
              {alunos.map((aluno, idx) => {
                const status = statusMap[aluno.id] || 'presente'
                return (
                  <div key={aluno.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-6">{idx + 1}</span>
                      <span className="font-medium text-gray-900">{aluno.nome}</span>
                    </div>
                    <button
                      onClick={() => toggleStatus(aluno.id)}
                      className={`px-3 py-1 rounded-full border text-sm font-bold transition ${statusColors[status]}`}
                    >
                      {statusLabels[status]}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={salvarChamada}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Salvando...' : saved ? '✓ Chamada Salva!' : 'Salvar Chamada'}
          </button>
        </>
      ) : turmaSelecionada ? (
        <div className="text-center py-8 text-gray-400 bg-white rounded-xl shadow">
          Nenhum aluno encontrado nesta turma
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 bg-white rounded-xl shadow">
          Selecione uma turma para iniciar a chamada
        </div>
      )}
    </div>
  )
}