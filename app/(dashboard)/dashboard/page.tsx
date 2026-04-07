"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { JoinCodeDialog } from "@/components/join-code-dialog"
import {
  getStudentClassroom,
  getStudentAssignments,
  getStudentProgress,
  lessons,
  achievements,
} from "@/lib/data"
import { getStudentClassrooms } from "@/lib/actions/classrooms"
import type { Classroom } from "@/lib/types"
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Clock,
  ArrowRight,
  Mic,
  BookText,
  Headphones,
  CheckCircle2,
  Calendar,
  Star,
  KeyRound,
  Plus,
} from "lucide-react"

export default function StudentDashboard() {
  const { currentUser } = useApp()
  const [myClassrooms, setMyClassrooms] = useState<Classroom[]>([])
  const [loadingClassrooms, setLoadingClassrooms] = useState(true)
  
  // Legacy mock data for demo purposes
  const classroom = getStudentClassroom(currentUser.id)
  const studentAssignments = getStudentAssignments(currentUser.id)
  const progress = getStudentProgress(currentUser.id)
  
  const fetchMyClassrooms = async () => {
    const result = await getStudentClassrooms()
    if (result.success && result.data) {
      setMyClassrooms(result.data)
    }
    setLoadingClassrooms(false)
  }
  
  useEffect(() => {
    fetchMyClassrooms()
  }, [])
  
  const pendingAssignments = studentAssignments.filter(
    (a) => !a.submissions.some((s) => s.studentId === currentUser.id)
  )

  const recentLessons = lessons.slice(0, 3)
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "speaking":
        return Mic
      case "reading":
        return BookText
      case "listening":
        return Headphones
      default:
        return BookOpen
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "speaking":
        return "bg-chart-1"
      case "reading":
        return "bg-chart-2"
      case "listening":
        return "bg-chart-3"
      default:
        return "bg-primary"
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Welcome back, {currentUser.name.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          {`You're making great progress! Keep up the excellent work.`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="text-2xl font-bold text-foreground">{currentUser.level}</p>
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
                <p className="text-sm text-muted-foreground">Lessons Done</p>
                <p className="text-2xl font-bold text-foreground">
                  {progress.completedLessons}/{progress.totalLessons}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <BookOpen className="h-6 w-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold text-foreground">{progress.averageScore}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <Star className="h-6 w-6 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-chart-4/20 bg-chart-4/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold text-foreground">
                  {progress.unlockedAchievements}/{progress.totalAchievements}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4">
                <Trophy className="h-6 w-6 text-secondary-foreground" />
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
              <div className="flex items-center gap-2">
                <JoinCodeDialog type="classroom" onSuccess={fetchMyClassrooms} />
                <Link href="/classroom">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loadingClassrooms ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="h-6 w-6" />
                </div>
              ) : myClassrooms.length > 0 ? (
                <div className="space-y-3">
                  {myClassrooms.map((cls) => (
                    <Link
                      key={cls.id}
                      href="/classroom"
                      className="block rounded-xl bg-primary p-4 transition-colors hover:bg-primary/90"
                    >
                      <h3 className="text-lg font-semibold text-primary-foreground">
                        {cls.name}
                      </h3>
                      <p className="mt-1 text-sm text-primary-foreground/80">
                        Level: {cls.level || "All Levels"}
                      </p>
                      <p className="mt-2 text-sm text-primary-foreground/70">
                        {cls.description || "No description"}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : classroom ? (
                <div className={`rounded-xl ${classroom.color} p-4`}>
                  <h3 className="text-lg font-semibold text-primary-foreground">
                    {classroom.name}
                  </h3>
                  <p className="mt-1 text-sm text-primary-foreground/80">
                    Teacher: {classroom.teacherName}
                  </p>
                  <p className="mt-2 text-sm text-primary-foreground/70">
                    {classroom.description}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-border p-6 text-center">
                  <KeyRound className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-3 font-medium text-foreground">No classrooms yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Join a classroom with an access code from your teacher
                  </p>
                  <JoinCodeDialog
                    type="classroom"
                    trigger={
                      <Button className="mt-4 gap-2">
                        <Plus className="h-4 w-4" />
                        Join Classroom
                      </Button>
                    }
                    onSuccess={fetchMyClassrooms}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Continue Learning */}
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Continue Learning</CardTitle>
              <Link href="/lessons">
                <Button variant="ghost" size="sm" className="gap-1">
                  All Lessons <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLessons.map((lesson) => {
                  const TypeIcon = getTypeIcon(lesson.type)
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.id}`}
                      className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getTypeColor(lesson.type)}`}
                      >
                        <TypeIcon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground truncate">{lesson.title}</h4>
                          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {lesson.level}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground truncate">
                          {lesson.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {lesson.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-secondary" />
                        ) : (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {lesson.duration}m
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Completion</span>
                    <span className="font-medium text-foreground">{progress.progressPercent}%</span>
                  </div>
                  <Progress value={progress.progressPercent} className="h-3" />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center">
                    <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-chart-1/20">
                      <Mic className="h-5 w-5 text-chart-1" />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Speaking</p>
                    <p className="font-semibold text-foreground">2/6</p>
                  </div>
                  <div className="text-center">
                    <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-chart-2/20">
                      <BookText className="h-5 w-5 text-chart-2" />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Reading</p>
                    <p className="font-semibold text-foreground">1/6</p>
                  </div>
                  <div className="text-center">
                    <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-lg bg-chart-3/20">
                      <Headphones className="h-5 w-5 text-chart-3" />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Listening</p>
                    <p className="font-semibold text-foreground">0/6</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Assignments */}
          <Card className="border-2 border-accent/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5 text-accent" />
                Pending Tasks
              </CardTitle>
              {pendingAssignments.length > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {pendingAssignments.length}
                </span>
              )}
            </CardHeader>
            <CardContent>
              {pendingAssignments.length > 0 ? (
                <div className="space-y-3">
                  {pendingAssignments.map((assignment) => (
                    <Link
                      key={assignment.id}
                      href="/classroom"
                      className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                    >
                      <h4 className="font-medium text-foreground">{assignment.title}</h4>
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Due: {assignment.dueDate}
                      </div>
                      <span
                        className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          assignment.type === "group"
                            ? "bg-chart-4/20 text-chart-4"
                            : "bg-secondary/20 text-secondary"
                        }`}
                      >
                        {assignment.type === "group" ? "Group Work" : "Individual"}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  All caught up! No pending assignments.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unlockedAchievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 rounded-lg bg-primary/5 p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                      <Trophy className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <JoinCodeDialog
                type="classroom"
                trigger={
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <KeyRound className="h-4 w-4" />
                    Join Classroom
                  </Button>
                }
                onSuccess={fetchMyClassrooms}
              />
              <JoinCodeDialog
                type="community"
                trigger={
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Join Community
                  </Button>
                }
              />
              <Link href="/community">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Community Forum
                </Button>
              </Link>
              <Link href="/lessons">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen className="h-4 w-4" />
                  Browse All Lessons
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
