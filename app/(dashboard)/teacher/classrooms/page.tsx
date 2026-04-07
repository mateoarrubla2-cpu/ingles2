"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { CreateClassroomDialog } from "@/components/create-classroom-dialog"
import { AddStudentDialog } from "@/components/add-student-dialog"
import { getTeacherClassrooms, getClassroomMembers, removeStudentFromClassroom } from "@/lib/actions/classrooms"
import type { Classroom, ClassroomMember } from "@/lib/types"
import {
  GraduationCap,
  Users,
  ClipboardList,
  Settings,
  Megaphone,
  X,
  ArrowRight,
  Copy,
  Check,
  Trash2,
  KeyRound,
} from "lucide-react"

export default function TeacherClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [showAnnouncement, setShowAnnouncement] = useState<string | null>(null)
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [announcementContent, setAnnouncementContent] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)
  const [classroomMembers, setClassroomMembers] = useState<ClassroomMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)

  const fetchClassrooms = async () => {
    const result = await getTeacherClassrooms()
    if (result.success && result.data) {
      setClassrooms(result.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchClassrooms()
  }, [])

  const fetchMembers = async (classroomId: string) => {
    setLoadingMembers(true)
    const result = await getClassroomMembers(classroomId)
    if (result.success && result.data) {
      setClassroomMembers(result.data)
    }
    setLoadingMembers(false)
  }

  const handleViewMembers = (classroom: Classroom) => {
    setSelectedClassroom(classroom)
    fetchMembers(classroom.id)
  }

  const handleRemoveStudent = async (studentId: string) => {
    if (!selectedClassroom) return
    const result = await removeStudentFromClassroom(selectedClassroom.id, studentId)
    if (result.success) {
      setClassroomMembers((prev) => prev.filter((m) => m.user_id !== studentId))
      fetchClassrooms()
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handlePostAnnouncement = () => {
    console.log("[v0] Posting announcement:", {
      classroomId: showAnnouncement,
      title: announcementTitle,
      content: announcementContent,
    })
    setAnnouncementTitle("")
    setAnnouncementContent("")
    setShowAnnouncement(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">My Classrooms</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your classrooms, students, and materials.
          </p>
        </div>
        <CreateClassroomDialog onSuccess={fetchClassrooms} />
      </div>

      {/* Empty State */}
      {classrooms.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <GraduationCap className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No classrooms yet</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Create your first classroom to start teaching and managing students.
            </p>
            <CreateClassroomDialog
              trigger={
                <Button className="mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Create Your First Classroom
                </Button>
              }
              onSuccess={fetchClassrooms}
            />
          </CardContent>
        </Card>
      )}

      {/* Classrooms Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {classrooms.map((classroom) => (
          <Card key={classroom.id} className="border-2">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
                    <GraduationCap className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{classroom.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {classroom.student_count || 0} students
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {classroom.description || "No description"}
              </p>

              {/* Classroom Code */}
              <div className="mb-4 flex items-center justify-between rounded-lg bg-muted p-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Join Code:</span>
                  <span className="font-mono text-lg font-bold tracking-widest text-primary">
                    {classroom.code}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyCode(classroom.code)}
                >
                  {copiedCode === classroom.code ? (
                    <Check className="h-4 w-4 text-secondary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Stats */}
              <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg bg-muted p-4">
                <div className="text-center">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-card">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {classroom.student_count || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-card">
                    <ClipboardList className="h-4 w-4 text-secondary" />
                  </div>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {classroom.level || "All"}
                  </p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-card">
                    <Megaphone className="h-4 w-4 text-accent" />
                  </div>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {classroom.max_students || "No limit"}
                  </p>
                  <p className="text-xs text-muted-foreground">Max</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <AddStudentDialog
                  classroomId={classroom.id}
                  classroomName={classroom.name}
                  onSuccess={fetchClassrooms}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setShowAnnouncement(classroom.id)}
                >
                  <Megaphone className="h-4 w-4" />
                  Announce
                </Button>
                <Button
                  size="sm"
                  className="ml-auto gap-1"
                  onClick={() => handleViewMembers(classroom)}
                >
                  View Students
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Students Modal */}
      {selectedClassroom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <Card className="w-full max-w-lg border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {selectedClassroom.name} - Students
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedClassroom(null)
                    setClassroomMembers([])
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingMembers ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="h-6 w-6" />
                </div>
              ) : classroomMembers.length === 0 ? (
                <div className="py-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No students in this classroom yet.</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Share the code <span className="font-mono font-bold">{selectedClassroom.code}</span> with your students.
                  </p>
                </div>
              ) : (
                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {classroomMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg bg-muted p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {member.user?.full_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {member.user?.full_name || "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.user?.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveStudent(member.user_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <AddStudentDialog
                  classroomId={selectedClassroom.id}
                  classroomName={selectedClassroom.name}
                  onSuccess={() => fetchMembers(selectedClassroom.id)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <Card className="w-full max-w-lg border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  Post Announcement
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAnnouncement(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Title
                </label>
                <Input
                  placeholder="Announcement title"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea
                  placeholder="Write your announcement..."
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAnnouncement(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={handlePostAnnouncement}
                  disabled={!announcementTitle.trim() || !announcementContent.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Post Announcement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
