"use client"

import { useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { lessons } from "@/lib/data"
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  BookText,
  Headphones,
  Clock,
  CheckCircle2,
  Volume2,
  RotateCcw,
  Trophy,
  Star,
  Play,
  Pause,
} from "lucide-react"

// Mock exercise data
const speakingExercises = [
  {
    id: 1,
    type: "pronunciation",
    instruction: "Listen and repeat the following sentence:",
    text: "Hello, my name is Maria. Nice to meet you!",
    audioUrl: "#",
  },
  {
    id: 2,
    type: "pronunciation",
    instruction: "Practice saying this phrase naturally:",
    text: "Could you please tell me where the train station is?",
    audioUrl: "#",
  },
  {
    id: 3,
    type: "conversation",
    instruction: "Respond to the following question:",
    text: "What do you like to do in your free time?",
    hint: "Talk about your hobbies and interests",
  },
]

const readingExercises = [
  {
    id: 1,
    type: "comprehension",
    passage: `The English language has become the most widely spoken language in the world. 
    It is used in business, science, and entertainment across all continents. 
    Many people learn English as a second language to improve their career opportunities 
    and to communicate with people from different cultures.`,
    question: "According to the passage, why do many people learn English?",
    options: [
      "To watch movies",
      "To improve career opportunities and communicate globally",
      "Because it is easy to learn",
      "To travel to England",
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    type: "vocabulary",
    word: "Opportunities",
    definition: "A set of circumstances that makes it possible to do something",
    sentence: "Learning English opens up many _____ for international work.",
    options: ["problems", "opportunities", "difficulties", "questions"],
    correctAnswer: 1,
  },
]

const listeningExercises = [
  {
    id: 1,
    type: "comprehension",
    instruction: "Listen to the conversation and answer the question:",
    transcript: "[Audio: Two people discussing their weekend plans]",
    question: "What does the woman plan to do on Saturday?",
    options: [
      "Go to the movies",
      "Visit her parents",
      "Go shopping",
      "Stay home and read",
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    type: "fill-blank",
    instruction: "Listen and fill in the missing word:",
    transcript: "[Audio: The weather forecast for tomorrow]",
    sentence: "Tomorrow will be _____ with a high of 25 degrees.",
    options: ["rainy", "sunny", "cloudy", "windy"],
    correctAnswer: 1,
  },
]

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const lesson = lessons.find((l) => l.id === id)

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  if (!lesson) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <BookText className="mx-auto h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Lesson Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              This lesson doesn&apos;t exist or has been removed.
            </p>
            <Link href="/lessons">
              <Button className="mt-4">Back to Lessons</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getExercises = () => {
    switch (lesson.type) {
      case "speaking":
        return speakingExercises
      case "reading":
        return readingExercises
      case "listening":
        return listeningExercises
      default:
        return []
    }
  }

  const exercises = getExercises()
  const currentExercise = exercises[currentStep]
  const totalSteps = exercises.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const getTypeIcon = () => {
    switch (lesson.type) {
      case "speaking":
        return Mic
      case "reading":
        return BookText
      case "listening":
        return Headphones
    }
  }

  const getTypeColor = () => {
    switch (lesson.type) {
      case "speaking":
        return "bg-chart-1"
      case "reading":
        return "bg-chart-2"
      case "listening":
        return "bg-chart-3"
    }
  }

  const TypeIcon = getTypeIcon()

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAnswer = (exerciseId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: answerIndex }))
  }

  const calculateScore = () => {
    let correct = 0
    exercises.forEach((ex: any) => {
      if (ex.correctAnswer !== undefined && answers[ex.id] === ex.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / exercises.filter((e: any) => e.correctAnswer !== undefined).length) * 100) || 85
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-lg border-2 text-center">
          <CardContent className="p-8">
            <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${getTypeColor()}`}>
              <Trophy className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Lesson Complete!</h2>
            <p className="mt-2 text-muted-foreground">{lesson.title}</p>

            <div className="my-8 flex items-center justify-center gap-2">
              <Star className="h-8 w-8 fill-primary text-primary" />
              <span className="text-5xl font-bold text-foreground">{score}%</span>
            </div>

            <p className="text-muted-foreground">
              {score >= 80
                ? "Excellent work! You&apos;ve mastered this lesson."
                : score >= 60
                  ? "Good job! Keep practicing to improve."
                  : "Keep trying! Practice makes perfect."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  setCurrentStep(0)
                  setAnswers({})
                  setShowResults(false)
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Link href="/lessons" className="flex-1">
                <Button className="w-full gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Back to Lessons
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/lessons"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lessons
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${getTypeColor()}`}>
              <TypeIcon className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground md:text-2xl">{lesson.title}</h1>
                <Badge>{lesson.level}</Badge>
              </div>
              <p className="mt-1 text-muted-foreground">{lesson.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {lesson.duration} minutes
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Exercise {currentStep + 1} of {totalSteps}
          </span>
          <span className="font-medium text-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Exercise Content */}
      <Card className="mb-6 border-2">
        <CardContent className="p-6 md:p-8">
          {lesson.type === "speaking" && (
            <SpeakingExercise
              exercise={currentExercise}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          )}
          {lesson.type === "reading" && (
            <ReadingExercise
              exercise={currentExercise}
              answer={answers[currentExercise?.id]}
              onAnswer={(index) => handleAnswer(currentExercise.id, index)}
            />
          )}
          {lesson.type === "listening" && (
            <ListeningExercise
              exercise={currentExercise}
              answer={answers[currentExercise?.id]}
              onAnswer={(index) => handleAnswer(currentExercise.id, index)}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNext} className="gap-2">
          {currentStep === totalSteps - 1 ? (
            <>
              Complete
              <CheckCircle2 className="h-4 w-4" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function SpeakingExercise({
  exercise,
  isRecording,
  setIsRecording,
  isPlaying,
  setIsPlaying,
}: {
  exercise: any
  isRecording: boolean
  setIsRecording: (v: boolean) => void
  isPlaying: boolean
  setIsPlaying: (v: boolean) => void
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-muted p-4">
        <p className="font-medium text-foreground">{exercise.instruction}</p>
      </div>

      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-xl font-medium text-foreground md:text-2xl">{`"${exercise.text}"`}</p>
        {exercise.hint && (
          <p className="mt-2 text-sm text-muted-foreground">Hint: {exercise.hint}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button
          variant="outline"
          size="lg"
          className="w-full gap-2 sm:w-auto"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5" />
              Pause Audio
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5" />
              Listen
            </>
          )}
        </Button>

        <Button
          size="lg"
          className={`w-full gap-2 sm:w-auto ${isRecording ? "bg-accent" : "bg-chart-1"} text-primary-foreground hover:opacity-90`}
          onClick={() => setIsRecording(!isRecording)}
        >
          <Mic className="h-5 w-5" />
          {isRecording ? "Stop Recording" : "Record Your Voice"}
        </Button>
      </div>

      {isRecording && (
        <div className="flex items-center justify-center gap-2 text-accent">
          <span className="h-3 w-3 animate-pulse rounded-full bg-accent" />
          Recording...
        </div>
      )}
    </div>
  )
}

function ReadingExercise({
  exercise,
  answer,
  onAnswer,
}: {
  exercise: any
  answer: number | undefined
  onAnswer: (index: number) => void
}) {
  return (
    <div className="space-y-6">
      {exercise.passage && (
        <div className="rounded-lg border border-border bg-muted/50 p-6">
          <p className="leading-relaxed text-foreground">{exercise.passage}</p>
        </div>
      )}

      {exercise.word && (
        <div className="rounded-lg border-2 border-chart-2/30 bg-chart-2/5 p-4">
          <p className="text-lg font-semibold text-foreground">{exercise.word}</p>
          <p className="mt-1 text-sm text-muted-foreground">{exercise.definition}</p>
        </div>
      )}

      <div className="rounded-lg bg-muted p-4">
        <p className="font-medium text-foreground">
          {exercise.question || `Fill in the blank: ${exercise.sentence}`}
        </p>
      </div>

      <RadioGroup
        value={answer?.toString()}
        onValueChange={(value) => onAnswer(parseInt(value))}
        className="space-y-3"
      >
        {exercise.options.map((option: string, index: number) => (
          <div
            key={index}
            className={`flex items-center space-x-3 rounded-lg border-2 p-4 transition-colors ${
              answer === index
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-foreground">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

function ListeningExercise({
  exercise,
  answer,
  onAnswer,
  isPlaying,
  setIsPlaying,
}: {
  exercise: any
  answer: number | undefined
  onAnswer: (index: number) => void
  isPlaying: boolean
  setIsPlaying: (v: boolean) => void
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-muted p-4">
        <p className="font-medium text-foreground">{exercise.instruction}</p>
      </div>

      <div className="flex flex-col items-center rounded-xl border-2 border-chart-3/30 bg-chart-3/5 p-8">
        <Headphones className="h-16 w-16 text-chart-3" />
        <p className="mt-4 text-center text-muted-foreground">{exercise.transcript}</p>
        <Button
          size="lg"
          className="mt-6 gap-2 bg-chart-3 text-primary-foreground hover:bg-chart-3/90"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Play Audio
            </>
          )}
        </Button>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <p className="font-medium text-foreground">
          {exercise.question || `Fill in the blank: ${exercise.sentence}`}
        </p>
      </div>

      <RadioGroup
        value={answer?.toString()}
        onValueChange={(value) => onAnswer(parseInt(value))}
        className="space-y-3"
      >
        {exercise.options.map((option: string, index: number) => (
          <div
            key={index}
            className={`flex items-center space-x-3 rounded-lg border-2 p-4 transition-colors ${
              answer === index
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <RadioGroupItem value={index.toString()} id={`listen-option-${index}`} />
            <Label htmlFor={`listen-option-${index}`} className="flex-1 cursor-pointer text-foreground">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
