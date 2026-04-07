"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  BookOpen,
  Mic,
  Headphones,
  BookText,
  Users,
  GraduationCap,
  Trophy,
  Globe,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react"

export default function LandingPage() {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
  
  const features = [
    {
      icon: Mic,
      title: "Speaking Practice",
      description: "Improve your pronunciation with interactive exercises and real-time feedback.",
      color: "bg-chart-1",
    },
    {
      icon: BookText,
      title: "Reading Comprehension",
      description: "Build vocabulary through engaging texts from beginner to advanced levels.",
      color: "bg-chart-2",
    },
    {
      icon: Headphones,
      title: "Listening Skills",
      description: "Train your ear with native speakers in various real-world scenarios.",
      color: "bg-chart-3",
    },
    {
      icon: Users,
      title: "Collaborative Community",
      description: "Connect with fellow learners, share resources, and practice together.",
      color: "bg-chart-4",
    },
  ]

  const benefits = [
    "Structured curriculum from A1 to C2",
    "Virtual classrooms with dedicated teachers",
    "Interactive exercises and quizzes",
    "Progress tracking and achievements",
    "Collaborative learning community",
    "Personalized feedback on assignments",
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LinguaLearn</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-primary-foreground">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">Master English at Your Own Pace</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
              <span className="text-balance">Learn English from{" "}</span>
              <span className="relative">
                <span className="relative z-10">Beginner to Advanced</span>
                <span className="absolute bottom-2 left-0 z-0 h-3 w-full bg-secondary/30 md:h-4" />
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90 md:text-xl">
              Join thousands of students mastering English through interactive lessons, 
              virtual classrooms, and a supportive learning community.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/lessons">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Explore Lessons
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Level Badges */}
      <section className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
            COMPLETE CURRICULUM ACROSS ALL LEVELS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {levels.map((level, index) => (
              <div
                key={level}
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold shadow-sm transition-transform hover:scale-110"
                style={{
                  backgroundColor: `oklch(${0.85 - index * 0.08} 0.18 ${85 + index * 40})`,
                  color: index > 2 ? "#fff" : "#1a1a2e",
                }}
              >
                {level}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              <span className="text-balance">Everything You Need to Master English</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our comprehensive platform combines interactive lessons, expert teachers, 
              and a vibrant community to accelerate your learning.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-2 border-border transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                <span className="text-balance">Your Personal Learning Journey</span>
              </h2>
              <p className="mb-8 text-muted-foreground">
                Our platform adapts to your level and learning style, providing a 
                personalized path to English fluency.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="mt-8 inline-block">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              <Card className="border-2 border-primary bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Join a Virtual Classroom</h3>
                    <p className="text-sm text-muted-foreground">
                      Get assigned to a classroom with a dedicated teacher who guides your progress.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="border-2 border-secondary bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-foreground">
                    2
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Complete Interactive Lessons</h3>
                    <p className="text-sm text-muted-foreground">
                      Practice speaking, reading, and listening with engaging exercises.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="border-2 border-accent bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
                    3
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Connect and Collaborate</h3>
                    <p className="text-sm text-muted-foreground">
                      Join our community to practice with peers and get support.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Loved by Students Worldwide
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Join thousands of happy learners who have transformed their English skills.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Maria G.",
                level: "B1 Student",
                text: "The structured lessons and supportive community helped me go from barely speaking to having confident conversations!",
                avatar: "Maria",
              },
              {
                name: "Carlos R.",
                level: "A2 Student",
                text: "My teacher gives amazing feedback on my assignments. I can really see my progress week by week.",
                avatar: "Carlos",
              },
              {
                name: "Ana M.",
                level: "B2 Student",
                text: "The listening exercises with real conversations prepared me perfectly for my Cambridge exam!",
                avatar: "Ana",
              },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="border-2 border-border">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-4 text-foreground">{`"${testimonial.text}"`}</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.avatar}`}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.level}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <Trophy className="mx-auto mb-6 h-16 w-16 text-primary" />
          <h2 className="mb-4 text-3xl font-bold text-background md:text-4xl">
            Ready to Start Your English Journey?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-background/80">
            Join our community today and take the first step towards English fluency. 
            Start with free lessons and upgrade anytime.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Learning Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">LinguaLearn</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Making English learning accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
