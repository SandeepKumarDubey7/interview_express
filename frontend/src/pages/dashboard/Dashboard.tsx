import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/contexts/UserProgressContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText, Brain, MessageSquare, BookOpen, Bot, Code,
  Flame, Trophy, Star, Zap,
  TrendingUp, Target, Clock, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

// Helper: relative time
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
}

const ACTIVITY_ICONS: Record<string, { color: string; icon: any }> = {
  aptitude: { color: "bg-emerald-500", icon: CheckCircle2 },
  resume: { color: "bg-blue-500", icon: FileText },
  dsa: { color: "bg-amber-500", icon: Zap },
  interview: { color: "bg-violet-500", icon: MessageSquare },
  resource: { color: "bg-indigo-500", icon: BookOpen },
  general: { color: "bg-gray-500", icon: Star },
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const {
    stats,
    level,
    xpForNextLevel,
    xpInCurrentLevel,
    accuracyRate,
    practiceHours,
    earnedBadges,
  } = useUserProgress();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }


  const statCards = [
    { label: "Problems Solved", value: stats.problemsSolved.toString(), icon: Target, color: "text-blue-500" },
    { label: "Practice Hours", value: practiceHours.toString(), icon: Clock, color: "text-violet-500" },
    { label: "Mock Interviews", value: stats.mockInterviews.toString(), icon: MessageSquare, color: "text-orange-500" },
    { label: "Accuracy Rate", value: stats.totalAnswers > 0 ? `${accuracyRate}%` : "—", icon: TrendingUp, color: "text-emerald-500" },
  ];

  // XP bar width percentage
  const xpPercent = xpForNextLevel > 0 ? Math.round((xpInCurrentLevel / xpForNextLevel) * 100) : 0;

  return (
    <DashboardLayout>
      <motion.div initial="hidden" animate="visible" className="space-y-6">
        {/* Welcome Banner */}
        <motion.div variants={fadeUp} custom={0}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-accent to-pink-500 p-6 md:p-8 text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
                Welcome back, {currentUser.name}! 👋
              </h1>
              <p className="text-white/80 text-base md:text-lg font-light max-w-xl">
                {stats.problemsSolved === 0 && stats.mockInterviews === 0
                  ? "Get started by trying a practice problem or taking a mock interview!"
                  : "Keep up the momentum! You're making great progress toward your dream job."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={fadeUp} custom={1} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i + 1}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <Card className="border-border/50 hover:border-primary/20 transition-colors h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${i === 0 ? 'from-blue-500/15 to-blue-500/5' :
                      i === 1 ? 'from-violet-500/15 to-violet-500/5' :
                        i === 2 ? 'from-orange-500/15 to-orange-500/5' :
                          'from-emerald-500/15 to-emerald-500/5'
                      } flex items-center justify-center`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold tracking-tight">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Gamification Row */}
        <motion.div variants={fadeUp} custom={3}>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                {/* Streak */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold">{stats.streak} {stats.streak > 0 ? '🔥' : ''}</div>
                    <div className="text-xs text-muted-foreground font-medium">Day Streak</div>
                  </div>
                </div>

                {/* XP Bar */}
                <div className="flex-1 max-w-xs w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-bold">Level {level}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{xpInCurrentLevel} / {xpForNextLevel} XP</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPercent}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2">
                  {earnedBadges.map((badge, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.15, y: -2 }}
                      className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center cursor-default"
                      title={badge.label}
                    >
                      <span className="text-lg">{badge.emoji}</span>
                    </motion.div>
                  ))}
                  {/* Empty badge slots */}
                  {Array.from({ length: Math.max(0, 4 - earnedBadges.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-10 h-10 rounded-xl bg-muted/30 border border-dashed border-border flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-muted-foreground/40" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>


        {/* Recent Activity */}
        <motion.div variants={fadeUp} custom={6}>
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {stats.activities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">No activity yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Start practicing to see your progress here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.activities.slice(0, 5).map((item, i) => {
                    const meta = ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.general;
                    const IconComp = meta.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                        className="flex items-start gap-3 group"
                      >
                        <div className={`w-8 h-8 rounded-lg ${meta.color}/10 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <IconComp className={`w-4 h-4 ${meta.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug">{item.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(item.timestamp)}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
