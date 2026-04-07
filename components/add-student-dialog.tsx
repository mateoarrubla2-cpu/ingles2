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
import { addStudentToClassroom } from '@/lib/actions/classrooms'
import { UserPlus } from 'lucide-react'

interface AddStudentDialogProps {
  classroomId: string
  classroomName: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function AddStudentDialog({ classroomId, classroomName, trigger, onSuccess }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await addStudentToClassroom(classroomId, email.trim())

      if (!result.success) {
        setError(result.error || 'Failed to add student')
        return
      }

      setSuccess(true)
      setEmail('')
      onSuccess?.()
      
      // Auto close after success
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
      }, 1500)
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setEmail('')
    setError(null)
    setSuccess(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => v ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Student to Classroom</DialogTitle>
            <DialogDescription>
              Add a student to <span className="font-medium">{classroomName}</span> by entering their email address.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label htmlFor="email">Student Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
            {success && (
              <p className="mt-2 text-sm text-secondary">Student added successfully!</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading && <Spinner className="mr-2 h-4 w-4" />}
              Add Student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
