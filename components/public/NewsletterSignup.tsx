"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, CheckCircle2 } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage("Welcome to our legacy. Check your inbox.")
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe. Please try again.")
      }
    } catch {
      setStatus("error")
      setMessage("An unexpected error occurred.")
    }
  }

  return (
    <div className="w-full max-w-md">
      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-4">
        Join the distribution list
      </h4>
      <p className="text-slate-500 font-light italic text-sm mb-6">
        Receive curated architectural narratives and insights whenever we publish a new journal entry.
      </p>

      {status === "success" ? (
        <div className="flex items-center gap-3 p-4 bg-amber-50/50 border border-amber-200/50 rounded-sm">
          <CheckCircle2 className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-900 font-medium">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <Input
            type="email"
            placeholder="Your email address"
            className="rounded-none border-slate-200 focus-visible:ring-amber-500 bg-white/50 pr-12"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            required
          />
          <Button 
            type="submit" 
            disabled={status === "loading"}
            className="rounded-none bg-slate-900 text-white hover:bg-amber-600 hover:text-slate-900 transition-colors px-6"
          >
            {status === "loading" ? "..." : "Join"}
          </Button>
        </form>
      )}
      
      {status === "error" && (
        <p className="text-red-500 text-xs mt-3 font-medium">{message}</p>
      )}
    </div>
  )
}
