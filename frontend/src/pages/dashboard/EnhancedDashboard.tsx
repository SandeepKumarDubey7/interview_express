import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Brain, MessageSquare, BookOpen, Bot, TrendingUp, Award, Target } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/animated/AnimatedCard";
import { Progress } from "@/components/ui/progress";

export default function EnhancedDashboard() {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== "user") {
    return <Navigate to="/organization-dashboard" replace />;
  }

  const features = [
    {
      icon: FileText,
      title: "Resume Builder",
      description: "Create professional resumes",
      detail: "Generate ATS-optimized resumes with AI-powered suggestions",
      link: "/resume-builder",
      color: "from-blue-500 to-cyan-500",
      progress: 75,
    },
    {
      icon: Brain,
      title: "Aptitude Tests",
      description: "Logical & Quantitative",
      detail: "Practice with simulated tests and coding challenges",
      link: "/practice/aptitude",
      color: "from-purple-500 to-pink-500",
      progress: 60,
    },
    {
      icon: Brain,
      title: "DSA Practice",
      description: "Coding Challenges",
      detail: "Solve data structures and algorithms problems",
      link: "/practice/dsa",
      color: "from-green-500 to-emerald-500",
      progress: 45,
    },
    {
      icon: MessageSquare,
      title: "Mock Interview",
      description: "AI-powered preparation",
      detail: "Practice interviews with AI feedback and evaluation",
      link: "/practice/interview",
      color: "from-orange-500 to-red-500",
      progress: 30,
    },
    {
      icon: BookOpen,
      title: "Study Resources",
      description: "Learning materials",
      detail: "Access curated resources for better preparation",
      link: "/resources",
      color: "from-indigo-500 to-purple-500",
      progress: 85,
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Career guidance",
      detail: "Get advice on job search and career development",
      link: "/assistant",
      color: "from-pink-500 to-rose-500",
      progress: 0,
    },
  ];

  const stats = [
    { label: "Tests Completed", value: "24", icon: Target, color: "text-blue-500" },
    { label: "Average Score", value: "78%", icon: TrendingUp, color: "text-green-500" },
    { label: "Achievements", value: "12", icon: Award, color: "text-purple-500" },
  ];

  const recentActivity = [
    { text: "Completed Quantitative Aptitude Test with score 80%", time: "2 days ago", color: "bg-green-500" },
    { text: "Created Modern Resume template", time: "3 days ago", color: "bg-blue-500" },
    { text: "Solved 'Two Sum' DSA problem", time: "5 days ago", color: "bg-yellow-500" },
    { text: "Completed Mock Interview session", time: "1 week ago", color: "bg-purple-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Continue your journey to land your dream job
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <Card className="border-2 hover:border-purple-300 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className={`h-12 w-12 ${stat.color}`} />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <Card className="h-full border-2 hover:border-purple-300 transition-all duration-300 overflow-hidden group">
                <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">{feature.detail}</p>
                  {feature.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{feature.progress}%</span>
                      </div>
                      <Progress value={feature.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full group-hover:scale-105 transition-transform">
                    <Link to={feature.link}>
                      {feature.progress > 0 ? "Continue" : "Get Started"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        {/* Recent Activity */}
        <AnimatedCard delay={0.6}>
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Activity</CardTitle>
              <CardDescription>Your latest achievements and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      className={`w-3 h-3 rounded-full ${activity.color}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.text}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>
    </DashboardLayout>
  );
}
