'use server'

import { revalidatePath } from 'next/cache'
import type { ApiResponse, Classroom, ClassroomMember, CreateClassroomForm } from '@/lib/types'
import {
  queryTable,
  findOne,
  insertOne,
  generateId,
  generateCode,
  updateOne,
  deleteMany,
} from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// Create a new classroom (teacher only)
export async function createClassroom(
  form: CreateClassroomForm
): Promise<ApiResponse<Classroom>> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Check if user is a teacher
    const profile = await findOne<any>('profiles', 'id', userId)
    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
      return { data: null, error: 'Only teachers can create classrooms', success: false }
    }

    // Generate unique code
    let code = generateCode()
    let attempts = 0
    while (attempts < 10) {
      const existing = await findOne<any>('classrooms', 'code', code)
      if (!existing) break
      code = generateCode()
      attempts++
    }

    // Create classroom
    const newClassroom = await insertOne('classrooms', {
      id: generateId('classroom'),
      teacher_id: userId,
      name: form.name,
      description: form.description,
      level: form.level,
      max_students: form.max_students,
      code,
      created_at: new Date().toISOString(),
    })

    revalidatePath('/teacher/classrooms')
    return { data: newClassroom, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
  }
}

// Get all classrooms for a teacher
export async function getTeacherClassrooms(): Promise<ApiResponse<Classroom[]>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { data: null, error: 'Not authenticated', success: false }
  }

  const { data, error } = await supabase
    .from('classrooms')
    .select(`
      *,
      classroom_members(count)
    `)
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })
try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    const classrooms = await queryTable<any>('classrooms', 'teacher_id', userId)
    
    // Add student count to each classroom
    const enrichedClassrooms = classrooms
      .map(c => {
        const memberCount = 0 // Will be calculated below
        return { ...c, student_count: memberCount }
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    const membershipList = await queryTable<any>('classroom_members', 'user_id', userId)
    const classrooms: Classroom[] = []

    for (const membership of membershipList) {
      const classroom = await findOne<any>('classrooms', 'id', membership.classroom_id)
      if (classroom) {
        classrooms.push(classroom)
      }
    }

    return { data: classrooms, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { data: null, error: 'Not authenticated', success: false }
  }

  // Find classroom by code
  const { data: classroom, error: findError } = await supabase
    .from('classrooms')
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Find classroom by code
    const classroom = await findOne<any>('classrooms', 'code', code.toUpperCase())
    if (!classroom) {
      return { data: null, error: 'Classroom not found. Please check the code.', success: false }
    }

    // Check if already a member
    const members = await queryTable<any>('classroom_members', 'classroom_id', classroom.id)
    const existingMember = members.find(m => m.user_id === userId)

    if (existingMember) {
      return { data: null, error: 'You are already a member of this classroom.', success: false }
    }

    // Check max students
    if (classroom.max_students && members.length >= classroom.max_students) {
      return { data: null, error: 'This classroom has reached its maximum capacity.', success: false }
    }

    // Add member
    const newMember = await insertOne('classroom_members', {
      id: generateId('member'),
      classroom_id: classroom.id,
      user_id: userId,
      role: 'student',
      joined_at: new Date().toISOString(),
    })

    revalidatePath('/dashboard')
    revalidatePath('/classroom')
    return { data: newMember, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 } = await supabase.auth.getUser()
  if (authError || !user) {
    return { data: null, error: 'Not authenticated', success: false }
  }

  // Verify teacher owns this classroom
  const { data: classroom } = await supabase
    .from('classrooms')
    .select('id, teacher_id, max_students')
    .eq('id', classroomId)
    .single()

  if (!classroom || classroom.teacher_id !== user.id) {
    return { data: null, error: 'You do not have permission to add students to this classroom.', success: false }
  }

  // Find student by email
  const { data: student } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (!student) {
    return { data: null, error: 'No user found with that email address.', success: false }
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Verify teacher owns this classroom
    const classroom = await findOne<any>('classrooms', 'id', classroomId)
    if (!classroom || classroom.teacher_id !== userId) {
      return { data: null, error: 'You do not have permission to add students to this classroom.', success: false }
    }

    // Find student by email
    const student = await findOne<any>('profiles', 'email', email.toLowerCase())
    if (!student) {
      return { data: null, error: 'No user found with that email address.', success: false }
    }

    // Check if already a member
    const members = await queryTable<any>('classroom_members', 'classroom_id', classroomId)
    const existingMember = members.find(m => m.user_id === student.id)

    if (existingMember) {
      return { data: null, error: 'This student is already in the classroom.', success: false }
    }

    // Check max students
    if (classroom.max_students && members.length >= classroom.max_students) {
      return { data: null, error: 'This classroom has reached its maximum capacity.', success: false }
    }

    // Add member
    const newMember = await insertOne('classroom_members', {
      id: generateId('member'),
      classroom_id: classroomId,
      user_id: student.id,
      role: 'student',
      joined_at: new Date().toISOString(),
    })

    revalidatePath('/teacher/classrooms')
    return { data: newMember, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 uccess: true }
}

// Remove a student from a classroom
export async function removeStudentFromClassroom(
  classroomId: string,
  studentId: string
): Promise<ApiResponse<null>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { data: null, error: 'Not authenticated', success: false }
  }

  // Verify teacher owns this classroom
  const { data: classroom } = await supabase
    .from('classrooms')
    .select('teacher_id')
    .eq('id', classroomId)
    .single()

  if (!classroom || classroom.teacher_id !== user.id) {
    return { data: null, error: 'You do not have permission to remove students from this classroom.', success: false }
  }

  const { error } = await supabase
    .from('classroom_members')
    .delete()
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    const members = await queryTable<any>('classroom_members', 'classroom_id', classroomId)
    
    // Enrich with user data
    const enrichedMembers = []
    for (const member of members) {
      const user = await findOne<any>('profiles', 'id', member.user_id)
      enrichedMembers.push({
        ...member,
        user: user ? { id: user.id, full_name: user.full_name, email: user.email, avatar_url: user.avatar_url } : null,
      })
    }

    enrichedMembers.sort((a, b) => new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime())

    return { data: enrichedMembers, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Verify teacher owns this classroom
    const classroom = await findOne<any>('classrooms', 'id', classroomId)
    if (!classroom || classroom.teacher_id !== userId) {
      return { data: null, error: 'You do not have permission to remove students from this classroom.', success: false }
    }

    // Find and delete the specific member
    const members = await queryTable<any>('classroom_members', 'classroom_id', classroomId)
    const member = members.find(m => m.user_id === studentId)
    
    if (!member) {
      return { data: null, error: 'Student not found in this classroom.', success: false }
    }

    await deleteMany('classroom_members', 'id', member.id)

    revalidatePath('/teacher/classrooms')
    return { data: null, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 