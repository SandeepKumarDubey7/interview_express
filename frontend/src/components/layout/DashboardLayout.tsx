import {
  useState,
  useEffect,
  useRef
} from "react"
import {
  useNavigate,
  Link,
  useLocation
} from "react-router-dom"

import {
  cn
} from "@/lib/utils"
import {
  useAuth
} from "@/contexts/AuthContext"
import {
  useUserProgress
} from "@/contexts/UserProgressContext"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"
import {
  Button
} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"
import {
  ModeToggle
} from "@/components/mode-toggle"
import {
  Separator
} from "@/components/ui/separator"
import {
  Skeleton
} from "@/components/ui/skeleton"

import {
  Home,
  FileText,
  BookOpen,
  User,
  LogOut,
  Brain,
  Bot,
  MessageSquare,
  Menu,
  Flame,
  Trophy,
  Zap,
  Bell,
  Search,
  Code,
  Compass
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const {
    currentUser,
    logout
  } = useAuth();
  const { stats, level, xpForNextLevel, xpInCurrentLevel } = useUserProgress();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // ── Search state ──
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchablePages = [
    { name: "Home", href: "/dashboard", icon: Home, keywords: "dashboard home overview" },
    { name: "Resume Builder", href: "/resume-builder", icon: FileText, keywords: "resume cv builder templates" },
    { name: "Aptitude Test", href: "/practice/aptitude", icon: Brain, keywords: "aptitude test quantitative logical verbal reasoning" },
    { name: "DSA Practice", href: "/practice/dsa", icon: Code, keywords: "dsa data structures algorithms coding problems" },
    { name: "Mock Interview", href: "/practice/interview", icon: MessageSquare, keywords: "mock interview ai practice" },
    { name: "Study Resources", href: "/resources", icon: BookOpen, keywords: "study resources notes materials cheat sheet" },
    { name: "AI Assistant", href: "/assistant", icon: Bot, keywords: "ai assistant chatbot help" },
    { name: "Profile", href: "/profile", icon: User, keywords: "profile account settings" },
    { name: "Features", href: "/features", icon: Zap, keywords: "features overview platform" },
    { name: "About", href: "/about", icon: BookOpen, keywords: "about us company" },
    { name: "AI Career Navigator", href: "/career-navigator", icon: Compass, keywords: "ai career navigator prediction ml machine learning salary resume" },
  ];

  const filteredPages = searchQuery.trim()
    ? searchablePages.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keywords.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : searchablePages;

  // Open/close with ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
        setSearchQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredPages.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredPages.length) % filteredPages.length);
    } else if (e.key === 'Enter' && filteredPages.length > 0) {
      e.preventDefault();
      navigate(filteredPages[selectedIndex].href);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchNavigate = (href: string) => {
    navigate(href);
    setSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse" />
          <Skeleton className="w-[200px] h-4 rounded-lg" />
          <Skeleton className="w-[150px] h-4 rounded-lg" />
        </div>
      </div>
    )
  }

  const userNavigation = [{
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Resume Builder",
    href: "/resume-builder",
    icon: FileText,
  },
  {
    name: "Aptitude Test",
    href: "/practice/aptitude",
    icon: Brain,
  },
  {
    name: "DSA Practice",
    href: "/practice/dsa",
    icon: Code,
  },
  {
    name: "Mock Interview",
    href: "/practice/interview",
    icon: MessageSquare,
  },
  {
    name: "Study Resources",
    href: "/resources",
    icon: BookOpen,
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    icon: Bot,
  },
  {
    name: "AI Career Navigator",
    href: "/career-navigator",
    icon: Compass,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  ];

  const isActivePath = (href: string) => {
    if (href === "/dashboard") return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const SidebarNavItem = ({ item }: { item: typeof userNavigation[0] }) => {
    const active = isActivePath(item.href);
    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
          active
            ? "bg-gradient-to-r from-primary/15 to-accent/10 text-primary dark:text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {active && (
          <motion.div
            layoutId="activeNav"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
        <item.icon className={cn(
          "h-4 w-4 transition-colors",
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )} />
        <span>{item.name}</span>
      </Link>
    );
  };

  const renderMobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 w-72">
        <SheetHeader className="space-y-2.5 px-2">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
              Interview Express
            </span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Dashboard Navigation
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-1 py-4 px-2">
          {userNavigation.map((item) => (
            <SidebarNavItem key={item.name} item={item} />
          ))}
        </div>
        <SheetFooter className="px-2">
          <Button
            variant="outline"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full justify-start rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  const renderDesktopNav = () => (
    <div ref={sidebarRef} className="hidden border-r border-border/50 bg-card/50 backdrop-blur-sm h-screen w-[260px] py-4 flex-col flex md:flex">
      {/* Logo */}
      <div className="px-4 mb-2">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Interview Express
          </span>
        </Link>
      </div>

      <Separator className="my-3 opacity-50" />

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="flex flex-col gap-0.5">
          {userNavigation.map((item) => (
            <SidebarNavItem key={item.name} item={item} />
          ))}
        </div>
      </nav>

      {/* Gamification Bar */}
      <div className="px-3 mt-auto">
        <Separator className="mb-3 opacity-50" />

        {/* Streak & XP */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-semibold">{stats.streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground">Lv. {level}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-muted-foreground font-medium">XP Progress</span>
              <span className="text-[10px] text-muted-foreground">{xpInCurrentLevel}/{xpForNextLevel}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpForNextLevel > 0 ? Math.round((xpInCurrentLevel / xpForNextLevel) * 100) : 0}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Theme toggle */}
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ModeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {renderDesktopNav()}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-4 lg:px-6 py-3 border-b border-border/50 bg-background/70 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            {renderMobileNav()}

            {/* Search Bar — clickable trigger */}
            <div
              onClick={() => { setSearchOpen(true); setSearchQuery(''); setSelectedIndex(0); }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 text-muted-foreground w-64 cursor-pointer hover:border-primary/30 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search...</span>
              <kbd className="ml-auto text-[10px] bg-background/80 px-1.5 py-0.5 rounded border border-border font-mono">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            {/* User Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={currentUser?.image || "https://github.com/shadcn.png"}
                      alt={currentUser?.name || "Avatar"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-bold rounded-lg">
                      {currentUser?.name ? currentUser?.name[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-lg cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Search Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          {/* Dialog */}
          <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border font-mono text-muted-foreground">ESC</kbd>
            </div>
            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredPages.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                filteredPages.map((page, i) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.href}
                      onClick={() => handleSearchNavigate(page.href)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors ${i === selectedIndex
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted/50'
                        }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">{page.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{page.href}</span>
                    </button>
                  );
                })
              )}
            </div>
            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-border/50 flex items-center gap-4 text-[10px] text-muted-foreground">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
