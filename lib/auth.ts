/**
 * Simple authentication context for db.json implementation
 * This is a mock implementation - in production, use real auth
 */

import { cookies } from 'next/headers'

const CURRENT_USER_COOKIE = 'current_user_id'

/**
 * Get the current authenticated user ID from cookies
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(CURRENT_USER_COOKIE)?.value || null
  } catch {
    return null
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser() {
  const userId = await getCurrentUserId()
  if (!userId) return null

  // Import here to avoid circular dependencies
  const { findOne } = await import('@/lib/db')
  return await findOne('profiles', 'id', userId)
}

/**
 * Set the current user (for demo/testing purposes)
 */
export async function setCurrentUser(userId: string | null): Promise<void> {
  const cookieStore = await cookies()
  if (userId) {
    cookieStore.set(CURRENT_USER_COOKIE, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
  } else {
    cookieStore.delete(CURRENT_USER_COOKIE)
  }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  await setCurrentUser(null)
}
