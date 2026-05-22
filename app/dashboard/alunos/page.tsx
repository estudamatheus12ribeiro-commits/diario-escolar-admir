'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Aluno {
  id: string
  nome: string
  data_nascimento?: string
  nome_responsavel?: string
  telefone_responsavel?: string
  turma_id?: string
  status: string
  turma?: { nome: string }
}

interface Turma {
  id: string
  nome: string
}

export default function AlunosPage() {
  const supabase = createClient()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Aluno | null>(null)
  const [form, setForm] = useState({
    nome: '', data_nascimento: '', nome_responsavel: '',
    telefone_responsavel: '', turma_id: '', status: 'ativo'
  })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)
    const [{ data: alunosData }, { data: turmasData }] = await Promise.all([
      supabase.from('alunos').select('*, turma:turmas(nome)').order('nome'),
      supabase.from('turmas').select('id, nome').eq('status', 'ativa').order('nome'),
    ])
    setAlunos(alunosData || [])
    setTurmas(turmasData || [])
    setLoading(false)
  }

  const alunosFiltrados = alunos.filter(a =>
    a.nome.toLowerCase().includes(busca.toLowerCase())
  )

  async function salvar() {
    if (editando) {
      await supabase.from('alunos').update(form).eq('id', editando.id)
    } else {
      await supabase.from('alunos').insert(form)
    }
    setShowForm(false)
    setEditando(null)
    setForm({ nome: '', data_nascimento: '', nome_responsavel: '', telefone_responsavel: '', turma_id: '', status: 'ativo' })
    carregarDados()
  }

  function editar(aluno: Aluno) {
    setEditando(aluno)
    setForm({
      nome: aluno.nome,
      data_nascimento: aluno.data_nascimento || '',
      nome_responsavel: aluno.nome_responsavel || '',
      telefone_responsavel: aluno.telefone_responsavel || '',
      turma_id: aluno.turma_id || '',
      status: aluno.status,
    })
    setShowForm(true)
  }

  const statusColor: Record<string, string> = {
    ativo: 'bg-green-100 text-green-700',
    transferido: 'bg-yellow-100 text-yellow-700',
    inativo: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
        <button
          onClick={() => { setShowForm(true); setEditando(null); setForm({ nome: '', data_nascimento: '', nome_responsavel: '', telefone_responsavel: '', turma_id: '', status: 'ativo' }) }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Novo Aluno
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar aluno por nome..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editando ? 'Editar Aluno' : 'Novo Aluno'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
              <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input type="date" value={form.data_nascimento} onChange={e => setForm({...form, data_nascimento: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsavel</label>
              <input type="text" value={form.nome_responsavel} onChange={e => setForm({...form, nome_responsavel: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone do Responsavel</label>
              <input type="text" value={form.telefone_responsavel} onChange={e => setForm({...form, telefone_responsavel: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
              <select value={form.turma_id} onChange={e => setForm({...form, turma_id: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Selecione a turma</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="ativo">Ativo</option>
                <option value="transferido">Transferido</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={salvar} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
              Salvar
            </button>
            <button onClick={() => { setShowForm(false); setEditando(null) }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Nome</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Turma</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Responsavel</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alunosFiltrados.map(aluno => (
                <tr key={aluno.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{aluno.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{aluno.turma?.nome || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{aluno.nome_responsavel || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[aluno.status] || ''}`}>
                      {aluno.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => editar(aluno)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {alunosFiltrados.length === 0 && (
            <div className="text-center py-10 text-gray-500">Nenhum aluno encontrado.</div>
          )}
        </div>
      )}
    </div>
  )
}
