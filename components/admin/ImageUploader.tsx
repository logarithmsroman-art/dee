'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { UploadCloud, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  bucket: string
  folder?: string
  onUploadSuccess: (url: string) => void
  currentImage?: string | null
}

export function ImageUploader({ bucket, folder = 'uploads', onUploadSuccess, currentImage }: ImageUploaderProps) {
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
        .upload(filePath, file)

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
      {currentImage && (
        <div className="w-48 aspect-video rounded overflow-hidden border border-slate-200">
          <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
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
            <><UploadCloud className="w-4 h-4 mr-2" /> Select Image</>
          )}
        </Button>
      </div>
      
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
