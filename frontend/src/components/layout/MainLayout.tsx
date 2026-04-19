import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Settings,
  LayoutDashboard,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRoutes = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Resume Builder", path: "/resume-builder" },
    { name: "Practice Tests", path: "/practice" },
    { name: "Study Resources", path: "/resources" },
  ];

  const routes = userRoutes;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Glassmorphic Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.img
                whileHover={{ rotate: 12 }}
                transition={{ type: "spring", stiffness: 300 }}
                src="/logo.svg"
                alt="Interview Express Logo"
                className="h-9 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:inline-block">
                Interview Express
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {!currentUser ? (
              <>
                <Link
                  to="/features"
                  className={cn(
                    "nav-link",
                    isActive("/features") && "active"
                  )}
                >
                  Features
                </Link>
                <Link
                  to="/about"
                  className={cn(
                    "nav-link",
                    isActive("/about") && "active"
                  )}
                >
                  About
                </Link>
                <div className="ml-3 flex items-center gap-2">
                  <ModeToggle />
                  <Link to="/login">
                    <Button variant="ghost" className="rounded-xl font-medium">Log in</Button>
                  </Link>
                  <Link to="/register">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/25 font-medium">
                        <Sparkles className="w-4 h-4 mr-1.5" />
                        Sign up
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={cn(
                      "nav-link",
                      isActive(route.path) && "active"
                    )}
                  >
                    {route.name}
                  </Link>
                ))}
                <div className="ml-3 flex items-center gap-2">
                  <ModeToggle />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2 rounded-xl border-border/50 hover:border-primary/30 transition-colors">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                          </span>
                        </div>
                        <span className="hidden sm:inline">{currentUser.name}</span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
                      <DropdownMenuItem onClick={() => navigate("/profile")} className="rounded-lg cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-lg cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-lg cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-border/50"
            >
              <div className="py-4 px-4 space-y-1 bg-background/80 backdrop-blur-xl">
                {!currentUser ? (
                  <>
                    <Link
                      to="/features"
                      className="block py-2.5 px-3 text-base font-medium hover:text-primary hover:bg-muted rounded-xl transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link
                      to="/about"
                      className="block py-2.5 px-3 text-base font-medium hover:text-primary hover:bg-muted rounded-xl transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                    <div className="pt-3 space-y-2">
                      <Link
                        to="/login"
                        className="block w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full rounded-xl">
                          Log in
                        </Button>
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-white">
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {routes.map((route) => (
                      <Link
                        key={route.path}
                        to={route.path}
                        className="block py-2.5 px-3 text-base font-medium hover:text-primary hover:bg-muted rounded-xl transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {route.name}
                      </Link>
                    ))}
                    <div className="pt-3 border-t border-border/50 space-y-1">
                      <Link
                        to="/profile"
                        className="block py-2.5 px-3 text-base font-medium hover:text-primary hover:bg-muted rounded-xl transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block py-2.5 px-3 text-base font-medium hover:text-primary hover:bg-muted rounded-xl transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="mt-2 w-full text-left flex items-center py-2.5 px-3 text-base font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      {/* Premium Footer */}
      <footer className="relative py-16 border-t border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.svg" alt="Interview Express Logo" className="h-9 w-auto" />
                <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Interview Express
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AI-powered interview preparation platform helping job seekers ace their interviews and land their dream jobs.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Resources</h4>
              <ul className="space-y-2.5">
                <li><Link to="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Interview Express. All rights reserved.
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground/60">Crafted with</span>
              <span className="text-red-500 text-sm">♥</span>
              <span className="text-xs text-muted-foreground/60">for job seekers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
