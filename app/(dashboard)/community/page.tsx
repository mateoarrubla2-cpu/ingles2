"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateCommunityDialog } from "@/components/create-community-dialog"
import { JoinCodeDialog } from "@/components/join-code-dialog"
import {
  getUserCommunities,
  getPublicCommunities,
  getCommunityPosts,
  createCommunityPost,
  createPostReply,
  getPostReplies,
  leaveCommunity,
} from "@/lib/actions/communities"
import type { Community, CommunityPost, PostReply } from "@/lib/types"
import {
  MessageSquare,
  Heart,
  Send,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Users,
  X,
  Globe,
  Lock,
  Copy,
  Check,
  LogOut,
  KeyRound,
} from "lucide-react"

export default function CommunityPage() {
  const [myCommunities, setMyCommunities] = useState<Community[]>([])
  const [publicCommunities, setPublicCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null)
  const [replies, setReplies] = useState<PostReply[]>([])
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchCommunities = async () => {
    const [myResult, publicResult] = await Promise.all([
      getUserCommunities(),
      getPublicCommunities(),
    ])

    if (myResult.success && myResult.data) {
      setMyCommunities(myResult.data)
    }
    if (publicResult.success && publicResult.data) {
      setPublicCommunities(publicResult.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCommunities()
  }, [])

  const fetchPosts = async (communityId: string) => {
    setLoadingPosts(true)
    const result = await getCommunityPosts(communityId)
    if (result.success && result.data) {
      setPosts(result.data)
    }
    setLoadingPosts(false)
  }

  const fetchReplies = async (postId: string) => {
    setLoadingReplies(true)
    const result = await getPostReplies(postId)
    if (result.success && result.data) {
      setReplies(result.data)
    }
    setLoadingReplies(false)
  }

  const handleSelectCommunity = (community: Community) => {
    setSelectedCommunity(community)
    setSelectedPost(null)
    setReplies([])
    fetchPosts(community.id)
  }

  const handleSelectPost = (post: CommunityPost) => {
    setSelectedPost(post)
    fetchReplies(post.id)
  }

  const handleCreatePost = async () => {
    if (!selectedCommunity || !newPostTitle.trim() || !newPostContent.trim()) return

    setSubmitting(true)
    const result = await createCommunityPost(
      selectedCommunity.id,
      newPostTitle,
      newPostContent
    )

    if (result.success && result.data) {
      setPosts((prev) => [result.data!, ...prev])
      setNewPostTitle("")
      setNewPostContent("")
      setShowNewPost(false)
    }
    setSubmitting(false)
  }

  const handleAddReply = async () => {
    if (!selectedPost || !replyText.trim()) return

    setSubmitting(true)
    const result = await createPostReply(selectedPost.id, replyText)

    if (result.success && result.data) {
      setReplies((prev) => [...prev, result.data!])
      setReplyText("")
    }
    setSubmitting(false)
  }

  const handleLeaveCommunity = async (communityId: string) => {
    const result = await leaveCommunity(communityId)
    if (result.success) {
      setMyCommunities((prev) => prev.filter((c) => c.id !== communityId))
      if (selectedCommunity?.id === communityId) {
        setSelectedCommunity(null)
        setPosts([])
      }
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Community</h1>
          <p className="mt-1 text-muted-foreground">
            Connect with fellow learners, share resources, and help each other grow.
          </p>
        </div>
        <div className="flex gap-2">
          <JoinCodeDialog type="community" onSuccess={fetchCommunities} />
          <CreateCommunityDialog onSuccess={fetchCommunities} />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-primary/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{myCommunities.length}</p>
              <p className="text-sm text-muted-foreground">My Communities</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-secondary/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Globe className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{publicCommunities.length}</p>
              <p className="text-sm text-muted-foreground">Public Communities</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-accent/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <MessageSquare className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{posts.length}</p>
              <p className="text-sm text-muted-foreground">Discussions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Communities Sidebar */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="my" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="my" className="flex-1">My Communities</TabsTrigger>
              <TabsTrigger value="discover" className="flex-1">Discover</TabsTrigger>
            </TabsList>

            <TabsContent value="my" className="space-y-2">
              {myCommunities.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="py-8 text-center">
                    <Users className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      No communities yet. Join or create one!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                myCommunities.map((community) => (
                  <Card
                    key={community.id}
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                      selectedCommunity?.id === community.id ? "border-primary" : "border-border"
                    }`}
                    onClick={() => handleSelectCommunity(community)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                            {community.is_public ? (
                              <Globe className="h-5 w-5 text-secondary-foreground" />
                            ) : (
                              <Lock className="h-5 w-5 text-secondary-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{community.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {community.member_count || 1} members
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="discover" className="space-y-2">
              {publicCommunities.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="py-8 text-center">
                    <Globe className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      No public communities available.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                publicCommunities.map((community) => (
                  <Card
                    key={community.id}
                    className="cursor-pointer border-2 transition-all hover:shadow-md"
                    onClick={() => handleSelectCommunity(community)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                          <Globe className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{community.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {community.member_count || 1} members
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {selectedCommunity ? (
            <div className="space-y-4">
              {/* Community Header */}
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
                        {selectedCommunity.is_public ? (
                          <Globe className="h-7 w-7 text-secondary-foreground" />
                        ) : (
                          <Lock className="h-7 w-7 text-secondary-foreground" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {selectedCommunity.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedCommunity.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                        <KeyRound className="h-4 w-4 text-primary" />
                        <span className="font-mono text-sm font-bold">
                          {selectedCommunity.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyCode(selectedCommunity.code)}
                        >
                          {copiedCode === selectedCommunity.code ? (
                            <Check className="h-3 w-3 text-secondary" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleLeaveCommunity(selectedCommunity.id)}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Leave
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search & New Post */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={() => setShowNewPost(true)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Discussion
                </Button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Posts List */}
                <div className="space-y-4">
                  {loadingPosts ? (
                    <div className="flex items-center justify-center py-12">
                      <Spinner className="h-6 w-6" />
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <Card className="border-2 border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">No discussions yet.</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setShowNewPost(true)}
                        >
                          Start a Discussion
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredPosts.map((post) => (
                      <Card
                        key={post.id}
                        className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                          selectedPost?.id === post.id ? "border-primary" : "border-border"
                        }`}
                        onClick={() => handleSelectPost(post)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              {post.author?.full_name?.charAt(0) || "?"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-foreground">{post.title}</h3>
                              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                {post.content}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span>{post.author?.full_name || "Unknown"}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(post.created_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {post.likes_count}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {post.replies_count}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Selected Post Detail */}
                <div className="lg:sticky lg:top-24 lg:h-fit">
                  {selectedPost ? (
                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              {selectedPost.author?.full_name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {selectedPost.author?.full_name || "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(selectedPost.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedPost(null)
                              setReplies([])
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-lg font-semibold text-foreground">
                          {selectedPost.title}
                        </h3>
                        <p className="mt-2 text-muted-foreground">{selectedPost.content}</p>

                        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Heart className="h-4 w-4" />
                            {selectedPost.likes_count} likes
                          </span>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            {replies.length} replies
                          </span>
                        </div>

                        {/* Replies */}
                        <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                          {loadingReplies ? (
                            <div className="flex items-center justify-center py-4">
                              <Spinner className="h-4 w-4" />
                            </div>
                          ) : (
                            replies.map((reply) => (
                              <div key={reply.id} className="rounded-lg bg-muted p-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs text-secondary-foreground">
                                    {reply.author?.full_name?.charAt(0) || "?"}
                                  </div>
                                  <span className="text-sm font-medium text-foreground">
                                    {reply.author?.full_name || "Unknown"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(reply.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">{reply.content}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Reply Input */}
                        <div className="mt-4 flex gap-2">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={2}
                            className="flex-1"
                          />
                          <Button
                            size="icon"
                            onClick={handleAddReply}
                            disabled={!replyText.trim() || submitting}
                            className="shrink-0"
                          >
                            {submitting ? (
                              <Spinner className="h-4 w-4" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-2 border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-center text-muted-foreground">
                          Select a discussion to view details and replies
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Users className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Select a Community
                </h3>
                <p className="mt-2 text-center text-muted-foreground">
                  Choose a community from the sidebar to view discussions and connect with other learners.
                </p>
                <div className="mt-6 flex gap-2">
                  <JoinCodeDialog
                    type="community"
                    trigger={
                      <Button variant="outline">
                        <KeyRound className="mr-2 h-4 w-4" />
                        Join with Code
                      </Button>
                    }
                    onSuccess={fetchCommunities}
                  />
                  <CreateCommunityDialog
                    trigger={
                      <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Community
                      </Button>
                    }
                    onSuccess={fetchCommunities}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <Card className="w-full max-w-lg border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Start a New Discussion</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewPost(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Title
                </label>
                <Input
                  placeholder="What&apos;s your question or topic?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Content
                </label>
                <Textarea
                  placeholder="Share more details..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewPost(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim() || submitting}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {submitting && <Spinner className="mr-2 h-4 w-4" />}
                  Post Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
