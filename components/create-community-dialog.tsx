'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { createCommunity } from '@/lib/actions/communities'
import { Plus, Copy, Check, Globe, Lock } from 'lucide-react'

interface CreateCommunityDialogProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function CreateCommunityDialog({ trigger, onSuccess }: CreateCommunityDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    is_public: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    setLoading(true)
    setError(null)

    try {
      const result = await createCommunity(form)

      if (!result.success) {
        setError(result.error || 'Failed to create community')
        return
      }

      setCreatedCode(result.data?.code || null)
      onSuccess?.()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    if (createdCode) {
      navigator.clipboard.writeText(createdCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setCreatedCode(null)
    setForm({ name: '', description: '', is_public: true })
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => v ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Community
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {createdCode ? (
          <>
            <DialogHeader>
              <DialogTitle>Community Created!</DialogTitle>
              <DialogDescription>
                Share this code with others so they can join your community.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center gap-4 rounded-lg border-2 border-dashed border-secondary/50 bg-secondary/5 p-6">
                <span className="text-4xl font-mono font-bold tracking-widest text-secondary">
                  {createdCode}
                </span>
                <Button size="icon" variant="outline" onClick={copyCode}>
                  {copied ? (
                    <Check className="h-4 w-4 text-secondary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Anyone with this code can join your community
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Community</DialogTitle>
              <DialogDescription>
                Start a community where learners can collaborate and discuss English topics.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Community Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., English Grammar Help"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What is this community about?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  {form.is_public ? (
                    <Globe className="h-5 w-5 text-secondary" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <Label htmlFor="public" className="cursor-pointer">
                      {form.is_public ? 'Public Community' : 'Private Community'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {form.is_public
                        ? 'Anyone can discover and join'
                        : 'Only people with the code can join'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="public"
                  checked={form.is_public}
                  onCheckedChange={(v) => setForm({ ...form, is_public: v })}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !form.name.trim()}>
                {loading && <Spinner className="mr-2 h-4 w-4" />}
                Create Community
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
