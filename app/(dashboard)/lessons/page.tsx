"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { lessons, type Lesson } from "@/lib/data"
import {
  BookOpen,
  Mic,
  BookText,
  Headphones,
  Clock,
  CheckCircle2,
  Lock,
  Play,
  Star,
  Filter,
} from "lucide-react"

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const
const types = ["all", "speaking", "reading", "listening"] as const

export default function LessonsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  const filteredLessons = lessons.filter((lesson) => {
    const levelMatch = selectedLevel === "all" || lesson.level === selectedLevel
    const typeMatch = selectedType === "all" || lesson.type === selectedType
    return levelMatch && typeMatch
  })

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

  const getLevelColor = (level: string) => {
    const index = levels.indexOf(level as typeof levels[number])
    return `oklch(${0.85 - index * 0.08} 0.18 ${85 + index * 40})`
  }

  const completedByLevel = levels.map((level) => {
    const levelLessons = lessons.filter((l) => l.level === level)
    const completed = levelLessons.filter((l) => l.completed).length
    return {
      level,
      completed,
      total: levelLessons.length,
      percent: Math.round((completed / levelLessons.length) * 100),
    }
  })

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Lessons</h1>
        <p className="mt-1 text-muted-foreground">
          Master English through structured lessons in speaking, reading, and listening.
        </p>
      </div>

      {/* Level Progress Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {completedByLevel.map((data) => (
          <Card
            key={data.level}
            className="cursor-pointer border-2 transition-all hover:shadow-md"
            onClick={() => setSelectedLevel(selectedLevel === data.level ? "all" : data.level)}
            style={{
              borderColor: selectedLevel === data.level ? getLevelColor(data.level) : undefined,
            }}
          >
            <CardContent className="p-4 text-center">
              <div
                className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold"
                style={{ backgroundColor: getLevelColor(data.level), color: data.level > "B1" ? "#fff" : "#1a1a2e" }}
              >
                {data.level}
              </div>
              <Progress value={data.percent} className="mb-2 h-2" />
              <p className="text-sm text-muted-foreground">
                {data.completed}/{data.total} done
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by type:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
              className="capitalize"
            >
              {type === "all" ? "All Types" : type}
            </Button>
          ))}
        </div>
        {(selectedLevel !== "all" || selectedType !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedLevel("all")
              setSelectedType("all")
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Lessons Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => {
          const TypeIcon = getTypeIcon(lesson.type)
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              TypeIcon={TypeIcon}
              typeColor={getTypeColor(lesson.type)}
              levelColor={getLevelColor(lesson.level)}
            />
          )
        })}
      </div>

      {filteredLessons.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No lessons match your filters.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedLevel("all")
                setSelectedType("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function LessonCard({
  lesson,
  TypeIcon,
  typeColor,
  levelColor,
}: {
  lesson: Lesson
  TypeIcon: React.ElementType
  typeColor: string
  levelColor: string
}) {
  return (
    <Link href={`/lessons/${lesson.id}`}>
      <Card className="group h-full border-2 transition-all hover:border-primary hover:shadow-lg">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${typeColor}`}>
              <TypeIcon className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className="text-xs font-bold"
                style={{
                  backgroundColor: levelColor,
                  color: lesson.level > "B1" ? "#fff" : "#1a1a2e",
                }}
              >
                {lesson.level}
              </Badge>
              {lesson.completed && <CheckCircle2 className="h-5 w-5 text-secondary" />}
            </div>
          </div>

          <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
            {lesson.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{lesson.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {lesson.duration} min
              </span>
              <Badge variant="outline" className="capitalize">
                {lesson.type}
              </Badge>
            </div>
            {lesson.score !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-semibold text-foreground">{lesson.score}%</span>
              </div>
            )}
          </div>

          <Button
            className="mt-4 w-full gap-2"
            variant={lesson.completed ? "outline" : "default"}
          >
            {lesson.completed ? (
              <>
                <Play className="h-4 w-4" />
                Review Lesson
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Lesson
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
