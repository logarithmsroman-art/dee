'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, UserMinus, UserCheck, Search, ShieldAlert } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function MembersView() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  async function loadMembers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setMembers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const toggleBan = async (id: string, currentlyBanned: boolean) => {
    const member = members.find(m => m.id === id)
    if (member?.is_admin) return // Safety: can't ban admins
    
    if (!window.confirm(`Are you sure you want to ${currentlyBanned ? 'unban' : 'ban'} this member?`)) return
    
    setActionLoading(id)
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: !currentlyBanned })
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      setMembers(members.map(m => m.id === id ? { ...m, is_banned: !currentlyBanned } : m))
    }
    setActionLoading(null)
  }

  const filteredMembers = members.filter(m => 
    (m.display_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (m.id.toLowerCase()).includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 italic font-serif text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      Gathering the community...
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-slate-900 tracking-tight">The Library Circle</h1>
          <p className="text-slate-500 mt-2 font-light">Manage access and insights for your community of readers.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Find a member..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-amber-500/20 transition-all font-light"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-bold text-[10px] uppercase tracking-widest py-6 px-8">Identity</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest py-6">Status</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest py-6">Join Date</TableHead>
              <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest py-6 px-8">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-20 font-serif italic text-slate-400 border-none">
                  The circle is quiet. No members match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id} className="group border-slate-50">
                  <TableCell className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-serif border border-slate-200">
                        {member.display_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 leading-none mb-1">{member.display_name || 'Anonymous Reader'}</p>
                        <p className="text-xs text-slate-400 font-light tracking-wide italic">{member.id.substring(0, 8)}... (Member ID)</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    {member.is_admin ? (
                      <Badge className="bg-slate-900 text-white border-0 px-3 py-1 rounded-full font-bold uppercase text-[8px] tracking-widest">
                        Library Curator
                      </Badge>
                    ) : member.is_banned ? (
                      <Badge className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full font-bold uppercase text-[8px] animate-pulse">
                        Access Revoked
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full font-bold uppercase text-[8px]">
                        Active Member
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-6 text-slate-500 font-light italic">
                    {new Date(member.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="py-6 px-8 text-right">
                    {!member.is_admin ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={actionLoading === member.id}
                        onClick={() => toggleBan(member.id, member.is_banned)}
                        className={`rounded-full h-10 w-10 p-0 transition-all ${member.is_banned ? 'text-green-500 hover:bg-green-50' : 'text-red-400 hover:bg-red-50'}`}
                        title={member.is_banned ? "Restore Access" : "Revoke Access"}
                      >
                        {actionLoading === member.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : member.is_banned ? (
                          <UserCheck size={18} />
                        ) : (
                          <UserMinus size={18} />
                        )}
                      </Button>
                    ) : (
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest px-4 py-2 border border-slate-100 rounded-full italic">
                        Secured
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900 uppercase tracking-widest mb-2">Administrative Note</h4>
          <p className="text-xs text-amber-700 leading-relaxed font-light italic">
            Revoking access will prevent the member from reading gated manuscripts and narratives. Use this discreetly for maintaining the integrity of your private library.
          </p>
        </div>
      </div>
    </div>
  )
}
