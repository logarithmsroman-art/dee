'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { UploadCloud } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileUploaderProps {
  bucket: string
  folder?: string
  accept?: string
  onUploadSuccess: (url: string) => void
  currentFile?: string | null
}

export function FileUploader({ bucket, folder = 'uploads', accept = '*', onUploadSuccess, currentFile }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      setUploading(true)

      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { 
          contentType: file.type,
          upsert: true 
        })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
      onUploadSuccess(data.publicUrl)
      
    } catch (err: any) {
      setError(err.message || 'Error uploading file')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {currentFile && (
        <div className="flex items-center p-3 rounded bg-slate-50 border border-slate-200 gap-3">
          <FileText className="text-blue-500 w-5 h-5" />
          <span className="text-sm truncate max-w-xs">{currentFile}</span>
        </div>
      )}
      
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <Button 
          type="button" 
          variant="outline" 
          className="w-full sm:w-auto relative"
          disabled={uploading}
        >
          {uploading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
          ) : (
            <><UploadCloud className="w-4 h-4 mr-2" /> Select File</>
          )}
        </Button>
      </div>
      
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
