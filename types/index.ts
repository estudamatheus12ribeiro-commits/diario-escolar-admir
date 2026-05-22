export type Perfil = 'administrador' | 'coordenacao' | 'secretaria' | 'professor'

export interface Profile {
  id: string
  nome: string
  email: string
  perfil: Perfil
  ativo: boolean
  criado_em: string
}

export interface Turma {
  id: string
  nome: string
  ano_escolar: number
  serie: string
  turno: string
  ano_letivo: number
  status: string
}

export interface Aluno {
  id: string
  nome: string
  data_nascimento?: string
  nome_responsavel?: string
  telefone_responsavel?: string
  turma_id?: string
  status: string
  turma?: Turma
}

export interface Professor {
  id: string
  user_id?: string
  nome: string
  email?: string
  telefone?: string
  status: string
}