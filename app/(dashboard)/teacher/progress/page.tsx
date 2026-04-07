"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getTeacherClassrooms,
  getClassroomStudents,
  lessons,
  type User,
} from "@/lib/data"
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Mic,
  BookText,
  Headphones,
  Star,
  Award,
  Target,
} from "lucide-react"

// Mock student progress data
const studentProgressData: Record<string, {
  lessonsCompleted: number
  averageScore: number
  speakingScore: number
  readingScore: number
  listeningScore: number
  trend: "up" | "down" | "stable"
  lastActive: string
  achievements: number
}> = {
  s1: {
    lessonsCompleted: 8,
    averageScore: 85,
    speakingScore: 82,
    readingScore: 90,
    listeningScore: 78,
    trend: "up",
    lastActive: "Today",
    achievements: 5,
  },
  s2: {
    lessonsCompleted: 5,
    averageScore: 72,
    speakingScore: 68,
    readingScore: 75,
    listeningScore: 70,
    trend: "stable",
    lastActive: "Yesterday",
    achievements: 3,
  },
  s3: {
    lessonsCompleted: 12,
    averageScore: 91,
    speakingScore: 88,
    readingScore: 95,
    listeningScore: 89,
    trend: "up",
    lastActive: "Today",
    achievements: 8,
  },
}

export default function StudentProgressPage() {
  const { currentUser } = useApp()
  const classrooms = getTeacherClassrooms(currentUser.id)
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null)

  const allStudents = classrooms.flatMap((c) => 
    getClassroomStudents(c.id).map((s) => ({
      ...s,
      classroom: c.name,
      classroomColor: c.color,
    }))
  )

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-secondary" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-secondary"
    if (score >= 60) return "text-primary"
    return "text-accent"
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Student Progress</h1>
        <p className="mt-1 text-muted-foreground">
          Track and analyze the performance of your students across all classrooms.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{allStudents.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold text-foreground">82%</p>
              </div>
              <Target className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lessons Done</p>
                <p className="text-2xl font-bold text-foreground">25</p>
              </div>
              <BookOpen className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold text-foreground">16</p>
              </div>
              <Award className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Students List */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">All Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allStudents.map((student) => {
                  const progress = studentProgressData[student.id] || {
                    lessonsCompleted: 0,
                    averageScore: 0,
                    trend: "stable",
                    lastActive: "Unknown",
                  }

                  return (
                    <div
                      key={student.id}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                        selectedStudent?.id === student.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="h-12 w-12 rounded-full"
                          />
                          <div>
                            <h3 className="font-medium text-foreground">{student.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {student.level}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {student.classroom}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${getScoreColor(progress.averageScore)}`}>
                                {progress.averageScore}%
                              </span>
                              {getTrendIcon(progress.trend)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {progress.lessonsCompleted} lessons
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Last active</p>
                            <p className="text-sm font-medium text-foreground">
                              {progress.lastActive}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Detail */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          {selectedStudent ? (
            <Card className="border-2">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="h-16 w-16 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">{selectedStudent.name}</CardTitle>
                    <Badge>{selectedStudent.level}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const progress = studentProgressData[selectedStudent.id] || {
                    lessonsCompleted: 0,
                    averageScore: 0,
                    speakingScore: 0,
                    readingScore: 0,
                    listeningScore: 0,
                    trend: "stable",
                    lastActive: "Unknown",
                    achievements: 0,
                  }

                  return (
                    <Tabs defaultValue="overview" className="mt-4">
                      <TabsList className="w-full">
                        <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                        <TabsTrigger value="skills" className="flex-1">Skills</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-muted p-3 text-center">
                            <p className="text-2xl font-bold text-foreground">
                              {progress.averageScore}%
                            </p>
                            <p className="text-xs text-muted-foreground">Avg. Score</p>
                          </div>
                          <div className="rounded-lg bg-muted p-3 text-center">
                            <p className="text-2xl font-bold text-foreground">
                              {progress.lessonsCompleted}
                            </p>
                            <p className="text-xs text-muted-foreground">Lessons</p>
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Overall Progress</span>
                            <span className="font-medium">
                              {Math.round((progress.lessonsCompleted / 18) * 100)}%
                            </span>
                          </div>
                          <Progress
                            value={(progress.lessonsCompleted / 18) * 100}
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                              Achievements
                            </span>
                          </div>
                          <span className="font-bold text-foreground">
                            {progress.achievements}/6
                          </span>
                        </div>
                      </TabsContent>

                      <TabsContent value="skills" className="space-y-4 pt-4">
                        <div className="space-y-3">
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Mic className="h-4 w-4 text-chart-1" />
                                <span className="text-sm text-foreground">Speaking</span>
                              </div>
                              <span className={`font-bold ${getScoreColor(progress.speakingScore)}`}>
                                {progress.speakingScore}%
                              </span>
                            </div>
                            <Progress value={progress.speakingScore} className="h-2" />
                          </div>

                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BookText className="h-4 w-4 text-chart-2" />
                                <span className="text-sm text-foreground">Reading</span>
                              </div>
                              <span className={`font-bold ${getScoreColor(progress.readingScore)}`}>
                                {progress.readingScore}%
                              </span>
                            </div>
                            <Progress value={progress.readingScore} className="h-2" />
                          </div>

                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Headphones className="h-4 w-4 text-chart-3" />
                                <span className="text-sm text-foreground">Listening</span>
                              </div>
                              <span className={`font-bold ${getScoreColor(progress.listeningScore)}`}>
                                {progress.listeningScore}%
                              </span>
                            </div>
                            <Progress value={progress.listeningScore} className="h-2" />
                          </div>
                        </div>

                        <div className="rounded-lg border border-border p-3">
                          <p className="text-sm font-medium text-foreground">Recommendation</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {progress.listeningScore < progress.speakingScore &&
                            progress.listeningScore < progress.readingScore
                              ? "Focus on listening exercises to improve comprehension."
                              : progress.speakingScore < progress.readingScore
                                ? "Practice more speaking exercises to build confidence."
                                : "Continue with balanced practice across all skills."}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )
                })()}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-center text-muted-foreground">
                  Select a student to view their detailed progress
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
