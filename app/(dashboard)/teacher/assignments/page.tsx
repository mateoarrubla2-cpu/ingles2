"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getTeacherClassrooms,
  getClassroomStudents,
  getClassroomAssignments,
  assignments as allAssignmentsData,
  users,
  type Assignment,
} from "@/lib/data"
import {
  ClipboardList,
  Plus,
  Users,
  User,
  Clock,
  CheckCircle2,
  X,
  Star,
  Send,
  FileText,
  Calendar,
} from "lucide-react"

export default function TeacherAssignmentsPage() {
  const { currentUser } = useApp()
  const classrooms = getTeacherClassrooms(currentUser.id)
  const [showNewAssignment, setShowNewAssignment] = useState(false)
  const [showGrading, setShowGrading] = useState<{
    assignment: Assignment
    submissionIndex: number
  } | null>(null)

  // New assignment form state
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newClassroom, setNewClassroom] = useState("")
  const [newType, setNewType] = useState<"individual" | "group">("individual")
  const [newDueDate, setNewDueDate] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  // Grading state
  const [gradeValue, setGradeValue] = useState([85])
  const [feedbackText, setFeedbackText] = useState("")

  const allAssignments = classrooms.flatMap((c) => 
    getClassroomAssignments(c.id).map((a) => ({
      ...a,
      classroom: c.name,
      classroomColor: c.color,
    }))
  )

  const pendingAssignments = allAssignments.filter((a) =>
    a.submissions.some((s) => !s.grade)
  )

  const handleCreateAssignment = () => {
    console.log("[v0] Creating assignment:", {
      title: newTitle,
      description: newDescription,
      classroomId: newClassroom,
      type: newType,
      dueDate: newDueDate,
      studentIds: selectedStudents,
    })
    setNewTitle("")
    setNewDescription("")
    setNewClassroom("")
    setNewType("individual")
    setNewDueDate("")
    setSelectedStudents([])
    setShowNewAssignment(false)
  }

  const handleGradeSubmission = () => {
    if (!showGrading) return
    console.log("[v0] Grading submission:", {
      assignmentId: showGrading.assignment.id,
      submissionIndex: showGrading.submissionIndex,
      grade: gradeValue[0],
      feedback: feedbackText,
    })
    setShowGrading(null)
    setGradeValue([85])
    setFeedbackText("")
  }

  const getStudentById = (studentId: string) => {
    return users.find((u) => u.id === studentId)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Assignments</h1>
          <p className="mt-1 text-muted-foreground">
            Create, manage, and grade student assignments.
          </p>
        </div>
        <Button
          onClick={() => setShowNewAssignment(true)}
          className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <Plus className="h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            All ({allAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending Grading ({pendingAssignments.length})
          </TabsTrigger>
        </TabsList>

        {/* All Assignments Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {allAssignments.map((assignment) => {
              const submittedCount = assignment.submissions.length
              const gradedCount = assignment.submissions.filter((s) => s.grade).length
              const totalStudents = assignment.studentIds.length

              return (
                <Card key={assignment.id} className="border-2">
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
                          {assignment.type === "group" ? (
                            <>
                              <Users className="mr-1 h-3 w-3" />
                              Group
                            </>
                          ) : (
                            <>
                              <User className="mr-1 h-3 w-3" />
                              Individual
                            </>
                          )}
                        </Badge>
                        <CardTitle className="mt-2 text-lg">{assignment.title}</CardTitle>
                      </div>
                      <Badge className={assignment.classroomColor} variant="secondary">
                        {assignment.classroom}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {assignment.description}
                    </p>

                    <div className="mb-4 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Due: {assignment.dueDate}
                      </span>
                    </div>

                    <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg bg-muted p-3 text-center text-sm">
                      <div>
                        <p className="font-semibold text-foreground">{totalStudents}</p>
                        <p className="text-xs text-muted-foreground">Assigned</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{submittedCount}</p>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                      </div>
                      <div>
                        <p className="font-semibold text-secondary">{gradedCount}</p>
                        <p className="text-xs text-muted-foreground">Graded</p>
                      </div>
                    </div>

                    {/* Submissions to grade */}
                    {assignment.submissions.filter((s) => !s.grade).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-accent">Pending grades:</p>
                        {assignment.submissions
                          .filter((s) => !s.grade)
                          .map((submission, index) => {
                            const student = getStudentById(submission.studentId)
                            return (
                              <div
                                key={submission.id}
                                className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/5 p-3"
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={student?.avatar}
                                    alt={student?.name}
                                    className="h-8 w-8 rounded-full"
                                  />
                                  <span className="text-sm font-medium text-foreground">
                                    {student?.name}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    setShowGrading({
                                      assignment,
                                      submissionIndex: assignment.submissions.indexOf(submission),
                                    })
                                  }
                                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                                >
                                  <Star className="mr-1 h-4 w-4" />
                                  Grade
                                </Button>
                              </div>
                            )
                          })}
                      </div>
                    )}

                    {/* All graded */}
                    {assignment.submissions.length > 0 &&
                      assignment.submissions.every((s) => s.grade) && (
                        <div className="flex items-center gap-2 rounded-lg bg-secondary/10 p-3 text-secondary">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="text-sm font-medium">All submissions graded</span>
                        </div>
                      )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Pending Grading Tab */}
        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.length > 0 ? (
            <div className="space-y-4">
              {pendingAssignments.map((assignment) =>
                assignment.submissions
                  .filter((s) => !s.grade)
                  .map((submission, index) => {
                    const student = getStudentById(submission.studentId)
                    return (
                      <Card key={submission.id} className="border-2 border-accent/30">
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex items-start gap-4">
                              <img
                                src={student?.avatar}
                                alt={student?.name}
                                className="h-12 w-12 rounded-full"
                              />
                              <div>
                                <h3 className="font-semibold text-foreground">{student?.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {assignment.title}
                                </p>
                                <Badge variant="outline" className="mt-1">
                                  {assignment.classroom}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right text-sm text-muted-foreground">
                                <p>Submitted</p>
                                <p className="font-medium text-foreground">
                                  {submission.submittedAt}
                                </p>
                              </div>
                              <Button
                                onClick={() =>
                                  setShowGrading({
                                    assignment,
                                    submissionIndex: assignment.submissions.indexOf(submission),
                                  })
                                }
                                className="bg-accent text-accent-foreground hover:bg-accent/90"
                              >
                                <Star className="mr-2 h-4 w-4" />
                                Grade Now
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 rounded-lg bg-muted p-4">
                            <p className="text-sm font-medium text-foreground">Submission:</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {submission.content}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
              )}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-secondary" />
                <p className="mt-4 text-lg font-medium text-foreground">All caught up!</p>
                <p className="text-muted-foreground">No submissions pending grading.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* New Assignment Modal */}
      {showNewAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/50 p-4">
          <Card className="w-full max-w-lg border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Create New Assignment
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewAssignment(false)}
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
                  placeholder="Assignment title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Description
                </label>
                <Textarea
                  placeholder="Describe the assignment..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Classroom
                  </label>
                  <Select value={newClassroom} onValueChange={setNewClassroom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select classroom" />
                    </SelectTrigger>
                    <SelectContent>
                      {classrooms.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Type
                  </label>
                  <Select
                    value={newType}
                    onValueChange={(v) => setNewType(v as "individual" | "group")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="group">Group Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>

              {newClassroom && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Assign to Students
                  </label>
                  <div className="max-h-32 space-y-2 overflow-y-auto rounded-lg border border-border p-2">
                    {getClassroomStudents(newClassroom).map((student) => (
                      <label
                        key={student.id}
                        className="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents((prev) => [...prev, student.id])
                            } else {
                              setSelectedStudents((prev) =>
                                prev.filter((id) => id !== student.id)
                              )
                            }
                          }}
                          className="rounded"
                        />
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-sm">{student.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowNewAssignment(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAssignment}
                  disabled={!newTitle.trim() || !newClassroom || !newDueDate}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grading Modal */}
      {showGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <Card className="w-full max-w-lg border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Grade Submission
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowGrading(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const submission =
                  showGrading.assignment.submissions[showGrading.submissionIndex]
                const student = getStudentById(submission.studentId)

                return (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                      <img
                        src={student?.avatar}
                        alt={student?.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-foreground">{student?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {showGrading.assignment.title}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <p className="text-sm font-medium text-foreground">Submission</p>
                      <p className="mt-2 text-sm text-muted-foreground">{submission.content}</p>
                    </div>

                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Grade</label>
                        <span className="text-2xl font-bold text-primary">{gradeValue[0]}%</span>
                      </div>
                      <Slider
                        value={gradeValue}
                        onValueChange={setGradeValue}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Feedback
                      </label>
                      <Textarea
                        placeholder="Provide feedback to the student..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" onClick={() => setShowGrading(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleGradeSubmission}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Submit Grade
                      </Button>
                    </div>
                  </>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
