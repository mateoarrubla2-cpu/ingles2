'use server'

import { revalidatePath } from 'next/cache'
import type { ApiResponse, Community, CommunityMember, CommunityPost, PostReply, CreateCommunityForm } from '@/lib/types'
import {
  queryTable,
  findOne,
  insertOne,
  generateId,
  generateCode,
  deleteMany,
} from '@/lib/db'
import { getCurrentUserId } from '@/lib/auth'

// Create a new community
export async function createCommunity(
  form: CreateCommunityForm
): Promise<ApiResponse<Community>> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Generate unique code
    let code = generateCode(8)
    let attempts = 0
    while (attempts < 10) {
      const existing = await findOne<any>('communities', 'code', code)
      if (!existing) break
      code = generateCode(8)
      attempts++
    }

    // Create community
    const newCommunity = await insertOne('communities', {
      id: generateId('community'),
      creator_id: userId,
      name: form.name,
      description: form.description,
      is_public: form.is_public,
      code,
      created_at: new Date().toISOString(),
    })

    // Add creator as admin member
    await insertOne('community_members', {
      id: generateId('cmember'),
      community_id: newCommunity.id,
      user_id: userId,
      role: 'admin',
      joined_at: new Date().toISOString(),
    })

    revalidatePath('/community')
    return { data: newCommunity, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
  }
}

// Get all communities a user is a member of
export async function getUserCommunities(): Promise<ApiResponse<Community[]>> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    const membershipList = await queryTable<any>('community_members', 'user_id', userId)
    const communities: Community[] = []

    for (const membership of membershipList) {
      const community = await findOne<any>('communities', 'id', membership.community_id)
      if (community) {
        const creator = await findOne<any>('profiles', 'id', community.creator_id)
        communities.push({
          ...community,
          creator: creator ? { id: creator.id, full_name: creator.full_name, avatar_url: creator.avatar_url } : null,
        })
      }
    }

    return { data: communities, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
  }
}

// Get public communities (for discovery)
extry {
    const allCommunities = await queryTable<any>('communities', 'is_public', true)
    const communities: Community[] = []

    for (const community of allCommunities) {
      const creator = await findOne<any>('profiles', 'id', community.creator_id)
      const members = await queryTable<any>('community_members', 'community_id', community.id)
      
      communities.push({
        ...community,
        creator: creator ? { id: creator.id, full_name: creator.full_name, avatar_url: creator.avatar_url } : null,
        member_count: members.length,
      })
    }

    // Sort by created_at descending, limit 20
    communities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    return { data: communities.slice(0, 20), error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 
  return { data: communities, error: null, success: true }
}

// Join a community using its code
export async function joinCommunityByCode(
  code: string
): Promise<ApiResponse<CommunityMember>> {
  const supabase = await createClient()
try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Find community by code
    const community = await findOne<any>('communities', 'code', code.toUpperCase())
    if (!community) {
      return { data: null, error: 'Community not found. Please check the code.', success: false }
    }

    // Check if already a member
    const members = await queryTable<any>('community_members', 'community_id', community.id)
    const existingMember = members.find(m => m.user_id === userId)

    if (existingMember) {
      return { data: null, error: 'You are already a member of this community.', success: false }
    }

    // Add member
    const newMember = await insertOne('community_members', {
      id: generateId('cmember'),
      community_id: community.id,
      user_id: userId,
      role: 'member',
      joined_at: new Date().toISOString(),
    })

    revalidatePath('/community')
    return { data: newMember, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 

// Leave a community
export async function leaveCommunity(
  communityId: string
): Promise<ApiResponse<null>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { data: null, error: 'Not authenticated', success: false }
  }

  // Check if user is the creator (creators cannot leave)
  const { data: community } = await supabase
    .from('communities')
    .select('creator_id')
    .eq('id', communityId)
    .single()
try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Check if user is the creator (creators cannot leave)
    const community = await findOne<any>('communities', 'id', communityId)
    if (community?.creator_id === userId) {
      return { data: null, error: 'Community creators cannot leave. Transfer ownership first.', success: false }
    }

    // Find and delete the specific member
    const members = await queryTable<any>('community_members', 'community_id', communityId)
    const member = members.find(m => m.user_id === userId)
    
    if (!member) {
      return { data: null, error: 'You are not a member of this community.', success: false }
    }

    await deleteMany('community_members', 'id', member.id)

    revalidatePath('/community')
    return { data: null, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 
  // Verify user is a member
  const { data: membership } = await supabase
    .from('community_members')
    .select('id')
    .eq('community_id', communityId)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Verify user is a member
    const members = await queryTable<any>('community_members', 'community_id', communityId)
    const membership = members.find(m => m.user_id === userId)

    if (!membership) {
      return { data: null, error: 'You must be a member to view posts.', success: false }
    }

    const posts = await queryTable<any>('community_posts', 'community_id', communityId)
    
    // Enrich with author data
    const enrichedPosts = []
    for (const post of posts) {
      const author = await findOne<any>('profiles', 'id', post.author_id || post.user_id)
      enrichedPosts.push({
        ...post,
        author: author ? { id: author.id, full_name: author.full_name, avatar_url: author.avatar_url } : null,
      })
    }

    enrichedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return { data: enrichedPosts, error: null, success: true }
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Verify user is a member
    const members = await queryTable<any>('community_members', 'community_id', communityId)
    const membership = members.find(m => m.user_id === userId)

    if (!membership) {
      return { data: null, error: 'You must be a member to create posts.', success: false }
    }

    const newPost = await insertOne('community_posts', {
      id: generateId('post'),
      community_id: communityId,
      author_id: userId,
      user_id: userId,
      title,
      content,
      created_at: new Date().toISOString(),
      likes_count: 0,
      reply_count: 0,
    })

    const author = await findOne<any>('profiles', 'id', userId)
    const postWithAuthor = {
      ...newPost,
      author: author ? { id: author.id, full_name: author.full_name, avatar_url: author.avatar_url } : null,
    }

    revalidatePath('/community')
    return { data: postWithAuthor, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 
): Promise<ApiResponse<PostReply[]>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('post_replies')
    .select(`
      *,
      author:profiles(id, full_name, avatar_url)
  try {
    const replies = await queryTable<any>('post_replies', 'post_id', postId)
    
    // Enrich with author data
    const enrichedReplies = []
    for (const reply of replies) {
      const author = await findOne<any>('profiles', 'id', reply.author_id || reply.user_id)
      enrichedReplies.push({
        ...reply,
        author: author ? { id: author.id, full_name: author.full_name, avatar_url: author.avatar_url } : null,
      })
    }

    enrichedReplies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    return { data: enrichedReplies, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Get post's community to verify membership
    const post = await findOne<any>('community_posts', 'id', postId)
    if (!post) {
      return { data: null, error: 'Post not found.', success: false }
    }

    // Verify user is a member
    const members = await queryTable<any>('community_members', 'community_id', post.community_id)
    const membership = members.find(m => m.user_id === userId)

    if (!membership) {
      return { data: null, error: 'You must be a member to reply.', success: false }
    }

    const newReply = await insertOne('post_replies', {
      id: generateId('reply'),
      post_id: postId,
      author_id: userId,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
    })

    // Increment reply count
    const replies = await queryTable<any>('post_replies', 'post_id', postId)
    const updatedPost = { ...post, reply_count: replies.length }

    const author = await findOne<any>('profiles', 'id', userId)
    const replyWithAuthor = {
      ...newReply,
      author: author ? { id: author.id, full_name: author.full_name, avatar_url: author.avatar_url } : null,
    }

    revalidatePath('/community')
    return { data: replyWithAuthor, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 ng): Promise<ApiResponse<null>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { data: null, error: 'Not authenticated', success: false }
  }

  // Check if already liked
  const { data: existingLike } = await supabase
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { data: null, error: 'Not authenticated', success: false }
    }

    // Check if already liked
    const likes = await queryTable<any>('post_likes', 'post_id', postId)
    const existingLike = likes.find(l => l.user_id === userId)

    if (existingLike) {
      // Unlike
      await deleteMany('post_likes', 'id', existingLike.id)
    } else {
      // Like
      await insertOne('post_likes', {
        id: generateId('like'),
        post_id: postId,
        user_id: userId,
        created_at: new Date().toISOString(),
      })
    }

    revalidatePath('/community')
    return { data: null, error: null, success: true }
  } catch (error) {
    return { data: null, error: String(error), success: false }
 
    .from('community_members')
    .select(`
      *,
      user:profiles(id, full_name, email, avatar_url)
    `)
    .eq('community_id', communityId)
    .order('joined_at', { ascending: true })

  if (error) {
    return { data: null, error: error.message, success: false }
  }

  return { data: data || [], error: null, success: true }
}
try {
    const members = await queryTable<any>('community_members', 'community_id', communityId)
    
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
 