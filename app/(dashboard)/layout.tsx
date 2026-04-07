import { AppProvider } from "@/lib/app-context"
import { Navigation } from "@/components/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>{children}</main>
      </div>
    </AppProvider>
  )
}
