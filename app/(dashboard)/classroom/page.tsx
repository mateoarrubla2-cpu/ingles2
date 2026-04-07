"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  getStudentClassroom,
  getStudentAssignments,
  getClassroomStudents,
} from "@/lib/data"
import {
  GraduationCap,
  Users,
  ClipboardList,
  Megaphone,
  Clock,
  CheckCircle2,
  Upload,
  Star,
  FileText,
} from "lucide-react"

export default function ClassroomPage() {
  const { currentUser } = useApp()
  const classroom = getStudentClassroom(currentUser.id)
  const assignments = classroom ? getStudentAssignments(currentUser.id) : []
  const classmates = classroom ? getClassroomStudents(classroom.id) : []

  const [submissionText, setSubmissionText] = useState("")
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)

  if (!classroom) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No Classroom Assigned</h2>
            <p className="mt-2 text-muted-foreground">
              You haven&apos;t been assigned to a classroom yet. Please contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const announcements = [
    {
      id: "1",
      title: "Welcome to the new semester!",
      content: "I&apos;m excited to start this learning journey with all of you. Let&apos;s work hard and achieve our goals!",
      date: "2026-04-01",
    },
    {
      id: "2",
      title: "New materials available",
      content: "I&apos;ve uploaded new practice exercises for this week&apos;s grammar lesson. Check them out!",
      date: "2026-04-05",
    },
  ]

  const handleSubmit = (assignmentId: string) => {
    console.log("[v0] Submitting assignment:", assignmentId, submissionText)
    setSubmissionText("")
    setSelectedAssignment(null)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Classroom Header */}
      <div className={`mb-8 rounded-2xl ${classroom.color} p-6 md:p-8`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge className="mb-2 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
              My Classroom
            </Badge>
            <h1 className="text-2xl font-bold text-primary-foreground md:text-3xl">
              {classroom.name}
            </h1>
            <p className="mt-2 text-primary-foreground/80">{classroom.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/20 px-4 py-2">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah`}
                alt={classroom.teacherName}
                className="h-10 w-10 rounded-full bg-primary-foreground"
              />
              <div>
                <p className="text-sm text-primary-foreground/70">Teacher</p>
                <p className="font-medium text-primary-foreground">{classroom.teacherName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="assignments" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Megaphone className="h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="classmates" className="gap-2">
            <Users className="h-4 w-4" />
            Classmates
          </TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {assignments.map((assignment) => {
              const mySubmission = assignment.submissions.find(
                (s) => s.studentId === currentUser.id
              )
              const isSubmitted = !!mySubmission

              return (
                <Card
                  key={assignment.id}
                  className={`border-2 ${isSubmitted ? "border-secondary/30" : "border-accent/30"}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            assignment.type === "group"
                              ? "border-chart-4 text-chart-4"
                              : "border-secondary text-secondary"
                          }
                        >
                          {assignment.type === "group" ? "Group Work" : "Individual"}
                        </Badge>
                        <CardTitle className="mt-2 text-lg">{assignment.title}</CardTitle>
                      </div>
                      {isSubmitted ? (
                        <CheckCircle2 className="h-6 w-6 text-secondary" />
                      ) : (
                        <Clock className="h-6 w-6 text-accent" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">{assignment.description}</p>

                    <div className="mb-4 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Due: {assignment.dueDate}
                      </span>
                    </div>

                    {isSubmitted ? (
                      <div className="rounded-lg bg-secondary/10 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-secondary">Submitted</span>
                          {mySubmission.grade && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="font-bold text-foreground">
                                {mySubmission.grade}%
                              </span>
                            </div>
                          )}
                        </div>
                        {mySubmission.feedback && (
                          <div className="mt-3 rounded-lg bg-card p-3">
                            <p className="text-xs font-medium text-muted-foreground">
                              Teacher Feedback:
                            </p>
                            <p className="mt-1 text-sm text-foreground">{mySubmission.feedback}</p>
                          </div>
                        )}
                      </div>
                    ) : selectedAssignment === assignment.id ? (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Write your submission here..."
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSubmit(assignment.id)}
                            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Submit
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedAssignment(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSelectedAssignment(assignment.id)}
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Start Assignment
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
                    <Megaphone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                      <span className="text-sm text-muted-foreground">{announcement.date}</span>
                    </div>
                    <p className="mt-2 text-muted-foreground">{announcement.content}</p>
                    <p className="mt-3 text-sm text-secondary">— {classroom.teacherName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Classmates Tab */}
        <TabsContent value="classmates">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Students in This Classroom ({classmates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {classmates.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 rounded-lg border p-4 ${
                      student.id === currentUser.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {student.name}
                        {student.id === currentUser.id && (
                          <span className="ml-2 text-xs text-primary">(You)</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">Level: {student.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
