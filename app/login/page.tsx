'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
                setError('E-mail ou senha incorretos.')
                setLoading(false)
        } else {
                router.push('/dashboard')
                router.refresh()
        }
  }

  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                      <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>svg>
                                </div>div>
                                <h1 className="text-2xl font-bold text-gray-900">Diario Escolar</h1>h1>
                                <p className="text-gray-500 text-sm mt-1">Escola Admir - Acesso ao Sistema</p>p>
                      </div>div>
              
                      <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>label>
                                            <input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                                            placeholder="seu@email.com"
                                                          />
                                </div>div>
                      
                                <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>label>
                                            <input
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                                            placeholder="••••••••"
                                                          />
                                </div>div>
                      
                        {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>div>
                                )}
                      
                                <button
                                              type="submit"
                                              disabled={loading}
                                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                  {loading ? 'Entrando...' : 'Entrar'}
                                </button>button>
                      </form>form>
              
                      <p className="text-center text-xs text-gray-400 mt-6">
                                Sistema exclusivo para uso escolar interno
                      </p>p>
              </div>div>
        </div>div>
      )
}</div>
