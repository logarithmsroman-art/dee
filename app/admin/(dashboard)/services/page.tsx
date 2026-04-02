'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash, Loader2 } from 'lucide-react'

export default function ServicesManagerPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setServices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadServices()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to stop offering this service? This will delete it permanently.')) return

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      loadServices()
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-slate-900">Services Manager</h1>
          <p className="text-slate-500 mt-2">Manage what you offer to clients and readers.</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new" className="flex items-center gap-2">
            <Plus size={16} /> Add Service
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Title</TableHead>
              <TableHead>Short Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                  No services listed yet.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service: any) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium text-slate-900">{service.title}</TableCell>
                  <TableCell className="text-slate-500 truncate max-w-xs">{service.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900">
                        <Link href={`/admin/services/edit/${service.id}`}>
                          <Edit size={16} />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(service.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
