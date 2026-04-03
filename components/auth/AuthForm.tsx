'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Lock, User } from 'lucide-react'

export function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage('Check your email to confirm your membership!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        window.location.reload()
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 pb-4">
        <h2 className="text-2xl font-serif text-slate-900">
          {mode === 'signin' ? 'Welcome Back' : 'Join the Library'}
        </h2>
        <p className="text-sm text-slate-500 font-light">
          {mode === 'signin' 
            ? 'Sign in to access premium manuscripts.' 
            : 'Subscribe for exclusive access to the full collection.'}
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-red-50 border border-red-100 text-red-600 rounded-lg animate-in fade-in animate-out fade-out slide-in-from-top-1">
          {error}
        </div>
      )}

      {message && (
        <div className="p-3 text-xs bg-amber-50 border border-amber-100 text-amber-900 rounded-lg font-medium italic">
          {message}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-slate-400 font-bold pl-1">Full Identity</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <Input 
                id="name" 
                required 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                placeholder="Name" 
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-slate-400 font-bold pl-1">Electronic Mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <Input 
              id="email" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
              placeholder="hello@writer.com" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pass" className="text-[10px] uppercase tracking-widest text-slate-400 font-bold pl-1">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <Input 
              id="pass" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
              placeholder="••••••••" 
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 mt-4 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold tracking-widest uppercase text-xs"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'signin' ? 'Authenticate' : 'Subscribe')}
        </Button>
      </form>

      <div className="pt-4 text-center border-t border-slate-100">
        <button 
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-[10px] font-bold text-slate-400 hover:text-amber-600 transition-colors uppercase tracking-[0.2em]"
        >
          {mode === 'signin' ? "Don't have an account? Join us" : "Already a member? Sign In"}
        </button>
      </div>
    </div>
  )
}
