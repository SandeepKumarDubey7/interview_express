
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SidebarNavItemProps {
  icon: LucideIcon
  title: string
  href: string
  isActive?: boolean
}

export function SidebarNavItem({ icon: Icon, title, href, isActive }: SidebarNavItemProps) {
  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </Link>
  )
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  return (
    <div className={cn("flex flex-col gap-1 py-2", className)} {...props} />
  )
}
