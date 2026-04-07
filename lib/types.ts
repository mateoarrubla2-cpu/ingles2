// Database types for the English learning platform

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: 'student' | 'teacher' | 'admin'
  current_level: string | null
  created_at: string
  updated_at: string
}

export interface Classroom {
  id: string
  name: string
  description: string | null
  code: string
  level: string | null
  teacher_id: string
  max_students: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined fields
  teacher?: Profile
  student_count?: number
}

export interface ClassroomMember {
  id: string
  classroom_id: string
  user_id: string
  role: 'student' | 'assistant'
  joined_at: string
  // Joined fields
  classroom?: Classroom
  user?: Profile
}

export interface Community {
  id: string
  name: string
  description: string | null
  code: string
  is_public: boolean
  creator_id: string
  created_at: string
  updated_at: string
  // Joined fields
  creator?: Profile
  member_count?: number
}

export interface CommunityMember {
  id: string
  community_id: string
  user_id: string
  role: 'member' | 'moderator' | 'admin'
  joined_at: string
  // Joined fields
  community?: Community
  user?: Profile
}

export interface CommunityPost {
  id: string
  community_id: string
  author_id: string
  title: string
  content: string
  likes_count: number
  replies_count: number
  is_pinned: boolean
  created_at: string
  updated_at: string
  // Joined fields
  author?: Profile
  community?: Community
}

export interface PostReply {
  id: string
  post_id: string
  author_id: string
  content: string
  likes_count: number
  created_at: string
  updated_at: string
  // Joined fields
  author?: Profile
}

// Form types
export interface CreateClassroomForm {
  name: string
  description: string
  level: string
  max_students: number
}

export interface CreateCommunityForm {
  name: string
  description: string
  is_public: boolean
}

export interface JoinByCodeForm {
  code: string
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}
