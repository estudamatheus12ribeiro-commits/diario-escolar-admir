'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Aluno {
  id: string; nome: string; data_nascimento?: string
  nome_responsavel?: string; telefone_responsavel?: string
  turma_id?: string; status: string; turma?: { nome: string }
}
interface Turma { id: string; nome: string }

export default function AlunosPage() {
  const supabase = createClient()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', data_nascimento: '', nome_responsavel: '', telefone_responsavel: '', turma_id: '', status: 'ativo' })
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const carregar = async () => {
    setLoading(true)
    const { data } = await supabase.from('alunos').select('*, turma:turmas(nome)').order('nome')
    setAlunos(data || [])
    setLoading(false)
  }

  useEffect(() => {
    carregar()
    supabase.from('turmas').select('id, nome').eq('status', 'ativa').order('nome').then(({ data }) => setTurmas(data || []))
  }, [])

  const salvar = async () => {
    if (!form.nome) return
    setSaving(true)
    if (editId) {
      await supabase.from('alunos').update(form).eq('id', editId)
    } else {
      await supabase.from('alunos').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    setEditId(null)
    setForm({ nome: '', data_nascimento: '', nome_responsavel: '', telefone_responsavel: '', turma_id: '', status: 'ativo' })
    carregar()
  }

  const editar = (a: Aluno) => {
    setForm({ nome: a.nome, data_nascimento: a.data_nascimento || '', nome_responsavel: a.nome_responsavel || '', telefone_responsavel: a.telefone_responsavel || '', turma_id: a.turma_id || '', status: a.status })
    setEditId(a.id)
    setShowForm(true)
  }

  const alunosFiltrados = alunos.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()))
  const statusColors: Record<string, string> = { ativo: 'bg-green-100 text-green-700', transferido: 'bg-yellow-100 text-yellow-700', inativo: 'bg-red-100 text-red-700' }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ nome: '', data_nascimento: '', nome_responsavel: '', telefone_responsavel: '', turma_id: '', status: 'ativo' }) }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
          + Novo Aluno
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">{editId ? 'Editar Aluno' : 'Novo Aluno'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
              <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input type="date" value={form.data_nascimento} onChange={e => setForm({...form, data_nascimento: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsavel</label>
              <input value={form.nome_responsavel} onChange={e => setForm({...form, nome_responsavel: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone do Responsavel</label>
              <input value={form.telefone_responsavel} onChange={e => setForm({...form, telefone_responsavel: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
              <select value={form.turma_id} onChange={e => setForm({...form, turma_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sem turma</option>
                {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ativo">Ativo</option>
                <option value="transferido">Transferido</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={salvar} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200">
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome..." className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Carregando...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nome</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Turma</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Responsavel</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alunosFiltrados.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{a.nome}</td>
                  <td className="px-5 py-3 text-gray-600">{a.turma?.nome || '-'}</td>
                  <td className="px-5 py-3 text-gray-600">{a.nome_responsavel || '-'}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[a.status]}`}>{a.status}</span></td>
                  <td className="px-5 py-3">
                    <button onClick={() => editar(a)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-sm text-gray-400">
          {alunosFiltrados.length} alunos encontrados
        </div>
      </div>
    </div>
  )
}