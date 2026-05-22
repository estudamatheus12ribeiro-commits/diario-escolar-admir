# Diário Escolar - Admir 📚

Sistema completo de gerenciamento escolar construído com **Next.js 14**, **TypeScript**, **Tailwind CSS** e **Supabase**.

## 🎯 Funcionalidades

- ✅ **Gerenciamento de Alunos** - Criar, editar e gerenciar alunos
- ✅ **Gerenciamento de Turmas** - Organizar turmas por nível (Pré 1-2, 1º-5º ano) e turno (A/B)
- ✅ **Gerenciamento de Professores** - Cadastro de professores e suas disciplinas
- ✅ **Sistema de Notas** - Registrar notas por bimestre e disciplina
- ✅ **Controle de Frequência** - Registrar presença/ausência de alunos
- ✅ **Autenticação** - Sistema seguro com Supabase Auth
- ✅ **Dashboard** - Visualização de estatísticas gerais
- ✅ **Interface Responsiva** - Totalmente adaptado para mobile e desktop

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no [Supabase](https://supabase.com)

### 1. Clonar o Repositório

```bash
git clone https://github.com/estudamatheus12ribeiro-commits/diario-escolar-admir.git
cd diario-escolar-admir
```

### 2. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

**Como obter essas chaves:**
1. Acesse [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá para **Settings → API**
4. Copie `Project URL` e `anon public key`

### 4. Configurar Banco de Dados

Execute o SQL abaixo no editor do Supabase:

```sql
-- Criar tabelas

-- Tabela de Turmas
CREATE TABLE turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  ano_letivo INTEGER NOT NULL,
  nivel VARCHAR(20) NOT NULL,
  turno VARCHAR(1) NOT NULL,
  status VARCHAR(20) DEFAULT 'ativa',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tabela de Alunos
CREATE TABLE alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  data_nascimento DATE,
  nome_responsavel VARCHAR(255),
  telefone_responsavel VARCHAR(20),
  turma_id UUID REFERENCES turmas(id),
  status VARCHAR(20) DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tabela de Professores
CREATE TABLE professores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  disciplinas TEXT[] DEFAULT ARRAY[]::TEXT[],
  status VARCHAR(20) DEFAULT 'ativo',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tabela de Notas
CREATE TABLE notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  disciplina VARCHAR(255) NOT NULL,
  bimestre INTEGER NOT NULL,
  nota DECIMAL(3,1) NOT NULL,
  professor_id UUID NOT NULL REFERENCES professores(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tabela de Frequência
CREATE TABLE frequencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES turmas(id),
  data DATE NOT NULL,
  presente BOOLEAN DEFAULT true,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_alunos_turma_id ON alunos(turma_id);
CREATE INDEX idx_notas_aluno_id ON notas(aluno_id);
CREATE INDEX idx_notas_professor_id ON notas(professor_id);
CREATE INDEX idx_frequencia_aluno_id ON frequencia(aluno_id);
CREATE INDEX idx_frequencia_data ON frequencia(data);
```

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

**Credenciais de teste:**
- Email: `admin@diario.com`
- Senha: `123456`

## 📁 Estrutura do Projeto

```
diario-escolar-admir/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── alunos/
│   │   ├── turmas/
│   │   ├── professores/
│   │   ├── notas/
│   │   └── frequencia/
│   ├── login/
│   │   └── page.tsx           # Página de login
│   ├── layout.tsx             # Layout raiz
│   ├── globals.css            # Estilos globais
│   └── middleware.ts          # Proteção de rotas
├── components/
│   └── DashboardLayout.tsx     # Layout do dashboard
├── lib/
│   └── supabase/
│       └── client.ts          # Cliente Supabase
├── types/
│   └── index.ts               # Tipos TypeScript globais
├── public/
├── .env.example               # Exemplo de variáveis
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔐 Autenticação

O projeto usa **Supabase Auth** com proteção via middleware:

- Usuários não autenticados são redirecionados para `/login`
- Usuários autenticados têm acesso ao `/dashboard`
- Sessions são gerenciadas automaticamente via cookies

## 🎨 Design

- **Framework UI**: Tailwind CSS
- **Ícones**: Emojis integrados
- **Cores**: Paleta profissional azul/verde/vermelho
- **Responsividade**: Mobile-first com grid responsivo

## 🚀 Deploy na Vercel

### 1. Push para GitHub

```bash
git add .
git commit -m "feat: sistema completo de diário escolar"
git push origin main
```

### 2. Conectar à Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique em **Deploy**

### 3. Seu app estará em produção! 🎉

A URL será algo como: `https://seu-app.vercel.app`

## 📝 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Lint do código
npm run lint
```

## 🔧 Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido por **Matheus Ribeiro** - [@estudamatheus12ribeiro-commits](https://github.com/estudamatheus12ribeiro-commits)

## 💬 Suporte

Se tiver dúvidas ou problemas, abra uma [issue](https://github.com/estudamatheus12ribeiro-commits/diario-escolar-admir/issues).

---

**Desenvolvido com ❤️ usando Next.js + Supabase**
