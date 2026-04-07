"use client"

import Link from "next/link"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  getTeacherClassrooms,
  getClassroomStudents,
  getClassroomAssignments,
  users,
} from "@/lib/data"
import {
  GraduationCap,
  Users,
  ClipboardList,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  BookOpen,
} from "lucide-react"

export default function TeacherDashboard() {
  const { currentUser } = useApp()
  const classrooms = getTeacherClassrooms(currentUser.id)

  const totalStudents = classrooms.reduce(
    (acc, c) => acc + getClassroomStudents(c.id).length,
    0
  )

  const allAssignments = classrooms.flatMap((c) => getClassroomAssignments(c.id))
  const pendingGrading = allAssignments.reduce(
    (acc, a) => acc + a.submissions.filter((s) => !s.grade).length,
    0
  )

  const recentActivity = [
    {
      id: "1",
      type: "submission",
      student: "Maria Garcia",
      action: "submitted",
      assignment: "Write About Your Family",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "question",
      student: "Carlos Rodriguez",
      action: "asked a question in",
      assignment: "Community Forum",
      time: "5 hours ago",
    },
    {
      id: "3",
      type: "completion",
      student: "Ana Martinez",
      action: "completed lesson",
      assignment: "News Article Analysis",
      time: "1 day ago",
    },
  ]

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Welcome, {currentUser.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your classrooms, assignments, and track student progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">My Classrooms</p>
                <p className="text-2xl font-bold text-foreground">{classrooms.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/20 bg-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <Users className="h-6 w-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Grading</p>
                <p className="text-2xl font-bold text-foreground">{pendingGrading}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <ClipboardList className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-4/20 bg-chart-4/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assignments</p>
                <p className="text-2xl font-bold text-foreground">{allAssignments.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4">
                <BookOpen className="h-6 w-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* My Classrooms */}
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">My Classrooms</CardTitle>
              <Link href="/teacher/classrooms">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classrooms.map((classroom) => {
                  const students = getClassroomStudents(classroom.id)
                  const assignments = getClassroomAssignments(classroom.id)
                  const pendingSubmissions = assignments.reduce(
                    (acc, a) => acc + (a.studentIds.length - a.submissions.length),
                    0
                  )

                  return (
                    <Link
                      key={classroom.id}
                      href={`/teacher/classrooms/${classroom.id}`}
                      className="block rounded-xl border-2 border-border p-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${classroom.color}`}
                          >
                            <GraduationCap className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{classroom.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {students.length} students
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {pendingSubmissions > 0 ? (
                            <span className="flex items-center gap-1 text-sm text-accent">
                              <AlertCircle className="h-4 w-4" />
                              {pendingSubmissions} pending
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-sm text-secondary">
                              <CheckCircle2 className="h-4 w-4" />
                              All caught up
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pending Submissions */}
          <Card className="border-2 border-accent/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <ClipboardList className="h-5 w-5 text-accent" />
                Pending Submissions
              </CardTitle>
              <Link href="/teacher/assignments">
                <Button variant="ghost" size="sm" className="gap-1">
                  Grade All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {pendingGrading > 0 ? (
                <div className="space-y-3">
                  {allAssignments
                    .filter((a) => a.submissions.some((s) => !s.grade))
                    .slice(0, 3)
                    .map((assignment) => {
                      const ungradedSubmissions = assignment.submissions.filter(
                        (s) => !s.grade
                      )
                      return (
                        <Link
                          key={assignment.id}
                          href="/teacher/assignments"
                          className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                        >
                          <h4 className="font-medium text-foreground">{assignment.title}</h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {ungradedSubmissions.length} submission
                            {ungradedSubmissions.length > 1 ? "s" : ""} to grade
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-accent">
                            <Clock className="h-3 w-3" />
                            Due: {assignment.dueDate}
                          </div>
                        </Link>
                      )
                    })}
                </div>
              ) : (
                <p className="py-4 text-center text-muted-foreground">
                  No pending submissions to grade!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/teacher/assignments">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Create New Assignment
                </Button>
              </Link>
              <Link href="/teacher/progress">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Student Progress
                </Button>
              </Link>
              <Link href="/teacher/classrooms">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Manage Classrooms
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        activity.type === "submission"
                          ? "bg-secondary/20"
                          : activity.type === "question"
                            ? "bg-accent/20"
                            : "bg-primary/20"
                      }`}
                    >
                      {activity.type === "submission" ? (
                        <ClipboardList className="h-4 w-4 text-secondary" />
                      ) : activity.type === "question" ? (
                        <AlertCircle className="h-4 w-4 text-accent" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.student}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <span className="font-medium">{activity.assignment}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Class Performance */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Class Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classrooms.map((classroom) => (
                  <div key={classroom.id}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{classroom.name}</span>
                      <span className="font-medium text-foreground">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
