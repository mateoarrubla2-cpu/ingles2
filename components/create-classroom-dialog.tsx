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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { createClassroom } from '@/lib/actions/classrooms'
import { Plus, Copy, Check } from 'lucide-react'

interface CreateClassroomDialogProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export function CreateClassroomDialog({ trigger, onSuccess }: CreateClassroomDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    level: 'A1',
    max_students: 30,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    setLoading(true)
    setError(null)

    try {
      const result = await createClassroom(form)

      if (!result.success) {
        setError(result.error || 'Failed to create classroom')
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
    setForm({ name: '', description: '', level: 'A1', max_students: 30 })
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => v ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Classroom
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {createdCode ? (
          <>
            <DialogHeader>
              <DialogTitle>Classroom Created!</DialogTitle>
              <DialogDescription>
                Share this code with your students so they can join your classroom.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center gap-4 rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-6">
                <span className="text-4xl font-mono font-bold tracking-widest text-primary">
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
                Students can enter this code to join your classroom
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Classroom</DialogTitle>
              <DialogDescription>
                Set up a new classroom for your students. You&apos;ll receive a unique code to share with them.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Classroom Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., English B1 - Monday Group"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add details about this classroom..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={form.level}
                    onValueChange={(v) => setForm({ ...form, level: v })}
                  >
                    <SelectTrigger id="level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max">Max Students</Label>
                  <Input
                    id="max"
                    type="number"
                    min={1}
                    max={100}
                    value={form.max_students}
                    onChange={(e) => setForm({ ...form, max_students: parseInt(e.target.value) || 30 })}
                  />
                </div>
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
                Create Classroom
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
