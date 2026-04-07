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
import { Spinner } from '@/components/ui/spinner'
import { joinClassroomByCode } from '@/lib/actions/classrooms'
import { joinCommunityByCode } from '@/lib/actions/communities'
import { KeyRound } from 'lucide-react'

interface JoinCodeDialogProps {
  type: 'classroom' | 'community'
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function JoinCodeDialog({ type, trigger, onSuccess }: JoinCodeDialogProps) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setLoading(true)
    setError(null)

    try {
      const result = type === 'classroom'
        ? await joinClassroomByCode(code.trim())
        : await joinCommunityByCode(code.trim())

      if (!result.success) {
        setError(result.error || 'Failed to join')
        return
      }

      setOpen(false)
      setCode('')
      onSuccess?.()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const title = type === 'classroom' ? 'Join a Classroom' : 'Join a Community'
  const description = type === 'classroom'
    ? 'Enter the 6-character code provided by your teacher to join their classroom.'
    : 'Enter the 8-character code to join a community.'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <KeyRound className="mr-2 h-4 w-4" />
            Join with Code
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label htmlFor="code" className="sr-only">
              Access Code
            </Label>
            <Input
              id="code"
              placeholder={type === 'classroom' ? 'ABC123' : 'ABCD1234'}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={type === 'classroom' ? 6 : 8}
              autoComplete="off"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || code.length < (type === 'classroom' ? 6 : 8)}>
              {loading && <Spinner className="mr-2 h-4 w-4" />}
              Join
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
