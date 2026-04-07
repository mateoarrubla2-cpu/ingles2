"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  GraduationCap,
  Home,
  Users,
  MessageSquare,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const { currentUser, switchRole, userRole } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const studentLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/classroom", label: "My Classroom", icon: GraduationCap },
    { href: "/lessons", label: "Lessons", icon: BookOpen },
    { href: "/community", label: "Community", icon: MessageSquare },
  ]

  const teacherLinks = [
    { href: "/teacher", label: "Dashboard", icon: Home },
    { href: "/teacher/classrooms", label: "My Classrooms", icon: GraduationCap },
    { href: "/teacher/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/teacher/progress", label: "Student Progress", icon: BarChart3 },
  ]

  const links = userRole === "student" ? studentLinks : teacherLinks

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">LinguaLearn</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden gap-2 md:flex">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-6 w-6 rounded-full"
                />
                <span className="max-w-32 truncate">{currentUser.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                <p className="mt-1 text-xs font-medium capitalize text-secondary">
                  {userRole}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => switchRole("student")}>
                <Users className="mr-2 h-4 w-4" />
                Switch to Student
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole("teacher")}>
                <GraduationCap className="mr-2 h-4 w-4" />
                Switch to Teacher
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 p-4">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center gap-3 px-4 py-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={() => {
                  switchRole(userRole === "student" ? "teacher" : "student")
                  setMobileMenuOpen(false)
                }}
              >
                Switch to {userRole === "student" ? "Teacher" : "Student"}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
