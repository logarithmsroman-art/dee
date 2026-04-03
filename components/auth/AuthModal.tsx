'use client'

import { useState, ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AuthForm } from './AuthForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?: ReactNode
}

export function AuthModal({ isOpen, onClose, trigger }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl border-slate-100 shadow-2xl p-8">
        <DialogHeader className="pb-4">
          <DialogTitle className="hidden">Authentication</DialogTitle>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-2xl font-serif">
              D
            </div>
            <div className="w-16 h-0.5 bg-amber-500/20" />
          </div>
        </DialogHeader>
        <AuthForm />
      </DialogContent>
    </Dialog>
  )
}
