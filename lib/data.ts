// Types
export type UserRole = "student" | "teacher"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  level?: string
  classroomId?: string
}

export interface Classroom {
  id: string
  name: string
  teacherId: string
  teacherName: string
  studentIds: string[]
  description: string
  color: string
}

export interface Lesson {
  id: string
  title: string
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  type: "speaking" | "reading" | "listening"
  description: string
  duration: number
  completed?: boolean
  score?: number
}

export interface Assignment {
  id: string
  title: string
  description: string
  classroomId: string
  teacherId: string
  dueDate: string
  type: "individual" | "group"
  studentIds: string[]
  submissions: Submission[]
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  content: string
  submittedAt: string
  grade?: number
  feedback?: string
}

export interface ForumPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  title: string
  content: string
  createdAt: string
  likes: number
  replies: ForumReply[]
}

export interface ForumReply {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  createdAt: string
  likes: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
}

// Mock Users
export const users: User[] = [
  {
    id: "s1",
    name: "Maria Garcia",
    email: "maria@email.com",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    level: "B1",
    classroomId: "c1",
  },
  {
    id: "s2",
    name: "Carlos Rodriguez",
    email: "carlos@email.com",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    level: "A2",
    classroomId: "c1",
  },
  {
    id: "s3",
    name: "Ana Martinez",
    email: "ana@email.com",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    level: "B2",
    classroomId: "c2",
  },
  {
    id: "t1",
    name: "Prof. Sarah Johnson",
    email: "sarah@school.com",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "t2",
    name: "Prof. Michael Brown",
    email: "michael@school.com",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
]

// Mock Classrooms
export const classrooms: Classroom[] = [
  {
    id: "c1",
    name: "Beginner English A1-A2",
    teacherId: "t1",
    teacherName: "Prof. Sarah Johnson",
    studentIds: ["s1", "s2"],
    description: "Foundation course for English beginners. Learn basic grammar, vocabulary, and everyday conversations.",
    color: "bg-chart-1",
  },
  {
    id: "c2",
    name: "Intermediate English B1-B2",
    teacherId: "t2",
    teacherName: "Prof. Michael Brown",
    studentIds: ["s3"],
    description: "Advance your English skills with complex grammar, professional vocabulary, and fluent conversations.",
    color: "bg-chart-2",
  },
]

// Mock Lessons
export const lessons: Lesson[] = [
  // A1 Level
  {
    id: "l1",
    title: "Greetings & Introductions",
    level: "A1",
    type: "speaking",
    description: "Learn how to introduce yourself and greet others in everyday situations.",
    duration: 15,
    completed: true,
    score: 85,
  },
  {
    id: "l2",
    title: "Simple Present Tense",
    level: "A1",
    type: "reading",
    description: "Master the basics of present tense verbs through engaging texts.",
    duration: 20,
    completed: true,
    score: 90,
  },
  {
    id: "l3",
    title: "Numbers & Time",
    level: "A1",
    type: "listening",
    description: "Practice understanding numbers and time expressions in conversations.",
    duration: 15,
    completed: false,
  },
  // A2 Level
  {
    id: "l4",
    title: "Daily Routines",
    level: "A2",
    type: "speaking",
    description: "Describe your daily activities and routines fluently.",
    duration: 20,
    completed: false,
  },
  {
    id: "l5",
    title: "Past Tense Stories",
    level: "A2",
    type: "reading",
    description: "Read and understand stories written in past tense.",
    duration: 25,
    completed: false,
  },
  {
    id: "l6",
    title: "At the Restaurant",
    level: "A2",
    type: "listening",
    description: "Understand conversations about ordering food and dining out.",
    duration: 18,
  },
  // B1 Level
  {
    id: "l7",
    title: "Expressing Opinions",
    level: "B1",
    type: "speaking",
    description: "Learn to express and defend your opinions on various topics.",
    duration: 25,
  },
  {
    id: "l8",
    title: "News Article Analysis",
    level: "B1",
    type: "reading",
    description: "Read and analyze authentic news articles from English publications.",
    duration: 30,
  },
  {
    id: "l9",
    title: "Podcast Comprehension",
    level: "B1",
    type: "listening",
    description: "Understand native speakers in podcast-style conversations.",
    duration: 25,
  },
  // B2 Level
  {
    id: "l10",
    title: "Debate & Discussion",
    level: "B2",
    type: "speaking",
    description: "Participate in debates on complex social and political topics.",
    duration: 30,
  },
  {
    id: "l11",
    title: "Academic Writing",
    level: "B2",
    type: "reading",
    description: "Study academic texts and learn scholarly vocabulary.",
    duration: 35,
  },
  {
    id: "l12",
    title: "Movies & Media",
    level: "B2",
    type: "listening",
    description: "Understand movies, TV shows, and media without subtitles.",
    duration: 30,
  },
  // C1 Level
  {
    id: "l13",
    title: "Professional Presentations",
    level: "C1",
    type: "speaking",
    description: "Deliver professional presentations with confidence.",
    duration: 35,
  },
  {
    id: "l14",
    title: "Literary Analysis",
    level: "C1",
    type: "reading",
    description: "Analyze literature and understand literary devices.",
    duration: 40,
  },
  {
    id: "l15",
    title: "Lectures & Seminars",
    level: "C1",
    type: "listening",
    description: "Understand academic lectures and professional seminars.",
    duration: 35,
  },
  // C2 Level
  {
    id: "l16",
    title: "Mastery Conversation",
    level: "C2",
    type: "speaking",
    description: "Engage in native-level conversations on any topic.",
    duration: 40,
  },
  {
    id: "l17",
    title: "Classic Literature",
    level: "C2",
    type: "reading",
    description: "Read and analyze classic English literature works.",
    duration: 45,
  },
  {
    id: "l18",
    title: "Native Nuances",
    level: "C2",
    type: "listening",
    description: "Understand idioms, slang, and regional accents perfectly.",
    duration: 40,
  },
]

// Mock Assignments
export const assignments: Assignment[] = [
  {
    id: "a1",
    title: "Write About Your Family",
    description: "Write a 150-word paragraph describing your family members using the vocabulary we learned this week.",
    classroomId: "c1",
    teacherId: "t1",
    dueDate: "2026-04-15",
    type: "individual",
    studentIds: ["s1", "s2"],
    submissions: [
      {
        id: "sub1",
        assignmentId: "a1",
        studentId: "s1",
        content: "My family is small but very close. I have my mother Rosa, my father Pedro, and my younger sister Lucia...",
        submittedAt: "2026-04-10",
        grade: 88,
        feedback: "Excellent work! Your vocabulary use is impressive. Keep practicing verb conjugations.",
      },
    ],
  },
  {
    id: "a2",
    title: "Group Presentation: Travel Destinations",
    description: "Work in groups to create a presentation about your dream travel destinations. Each member should present for 2 minutes.",
    classroomId: "c1",
    teacherId: "t1",
    dueDate: "2026-04-20",
    type: "group",
    studentIds: ["s1", "s2"],
    submissions: [],
  },
  {
    id: "a3",
    title: "Business Email Writing",
    description: "Write a professional email responding to a job offer, using formal language and proper email structure.",
    classroomId: "c2",
    teacherId: "t2",
    dueDate: "2026-04-18",
    type: "individual",
    studentIds: ["s3"],
    submissions: [],
  },
]

// Mock Forum Posts
export const forumPosts: ForumPost[] = [
  {
    id: "p1",
    authorId: "s1",
    authorName: "Maria Garcia",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    title: "Tips for improving pronunciation?",
    content: "Hi everyone! I struggle with the TH sound in English. Does anyone have tips or exercises that helped them?",
    createdAt: "2026-04-05",
    likes: 12,
    replies: [
      {
        id: "r1",
        postId: "p1",
        authorId: "s2",
        authorName: "Carlos Rodriguez",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
        content: "I had the same problem! Try placing your tongue between your teeth and blowing air gently. Practice with words like think, the, and thing.",
        createdAt: "2026-04-05",
        likes: 8,
      },
      {
        id: "r2",
        postId: "p1",
        authorId: "s3",
        authorName: "Ana Martinez",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
        content: "YouTube has great tutorials! I recommend watching videos that show mouth positioning for each sound.",
        createdAt: "2026-04-06",
        likes: 5,
      },
    ],
  },
  {
    id: "p2",
    authorId: "s3",
    authorName: "Ana Martinez",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    title: "Study group for B2 Cambridge exam",
    content: "Anyone preparing for the B2 First exam? I am looking for study partners to practice speaking and writing together!",
    createdAt: "2026-04-04",
    likes: 18,
    replies: [],
  },
  {
    id: "p3",
    authorId: "s2",
    authorName: "Carlos Rodriguez",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    title: "Best podcasts for English learners?",
    content: "I want to improve my listening skills during my commute. What podcasts do you recommend for A2 level students?",
    createdAt: "2026-04-03",
    likes: 24,
    replies: [
      {
        id: "r3",
        postId: "p3",
        authorId: "s1",
        authorName: "Maria Garcia",
        authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        content: "ESL Pod and All Ears English are perfect for beginners! They speak slowly and explain everything clearly.",
        createdAt: "2026-04-03",
        likes: 11,
      },
    ],
  },
]

// Mock Achievements
export const achievements: Achievement[] = [
  {
    id: "ach1",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "footprints",
    unlockedAt: "2026-03-15",
  },
  {
    id: "ach2",
    name: "Word Collector",
    description: "Learn 100 new vocabulary words",
    icon: "book-open",
    unlockedAt: "2026-03-28",
  },
  {
    id: "ach3",
    name: "Conversation Starter",
    description: "Complete 5 speaking lessons",
    icon: "mic",
    unlockedAt: "2026-04-02",
  },
  {
    id: "ach4",
    name: "Bookworm",
    description: "Complete 10 reading lessons",
    icon: "book",
  },
  {
    id: "ach5",
    name: "Listening Pro",
    description: "Complete 10 listening lessons",
    icon: "headphones",
  },
  {
    id: "ach6",
    name: "Level Master",
    description: "Complete all lessons in one level",
    icon: "trophy",
  },
]

// Helper functions
export const getCurrentUser = (): User => users[0] // Default to first student for demo

export const getTeacher = (): User => users.find(u => u.role === "teacher")!

export const getStudentClassroom = (studentId: string): Classroom | undefined => {
  const student = users.find(u => u.id === studentId)
  if (!student?.classroomId) return undefined
  return classrooms.find(c => c.id === student.classroomId)
}

export const getTeacherClassrooms = (teacherId: string): Classroom[] => {
  return classrooms.filter(c => c.teacherId === teacherId)
}

export const getClassroomStudents = (classroomId: string): User[] => {
  const classroom = classrooms.find(c => c.id === classroomId)
  if (!classroom) return []
  return users.filter(u => classroom.studentIds.includes(u.id))
}

export const getLessonsByLevel = (level: string): Lesson[] => {
  return lessons.filter(l => l.level === level)
}

export const getStudentAssignments = (studentId: string): Assignment[] => {
  return assignments.filter(a => a.studentIds.includes(studentId))
}

export const getClassroomAssignments = (classroomId: string): Assignment[] => {
  return assignments.filter(a => a.classroomId === classroomId)
}

export const getStudentProgress = (studentId: string) => {
  const completedLessons = lessons.filter(l => l.completed).length
  const totalLessons = lessons.length
  const averageScore = lessons.filter(l => l.score).reduce((acc, l) => acc + (l.score || 0), 0) / lessons.filter(l => l.score).length || 0
  
  return {
    completedLessons,
    totalLessons,
    progressPercent: Math.round((completedLessons / totalLessons) * 100),
    averageScore: Math.round(averageScore),
    unlockedAchievements: achievements.filter(a => a.unlockedAt).length,
    totalAchievements: achievements.length,
  }
}
