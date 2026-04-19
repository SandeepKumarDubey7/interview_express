import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDSAProgress } from "@/contexts/DSAProgressContext";
import { dsaQuestions } from "@/data/dsaQuestions";
import { dsaCheatSheetData } from "@/data/dsaCheatSheet";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Clock, 
  BookOpen,
  CheckCircle,
  BarChart3
} from "lucide-react";

export const DSAStatistics: React.FC = () => {
  const { questionProgress, topicProgress, getCompletionStats } = useDSAProgress();
  const stats = getCompletionStats();

  // Calculate category-wise progress
  const categoryStats = React.useMemo(() => {
    const categories = Array.from(new Set(dsaQuestions.map(q => q.category)));
    return categories.map(category => {
      const categoryQuestions = dsaQuestions.filter(q => q.category === category);
      const completedInCategory = questionProgress.filter(
        p => p.completed && p.category === category
      ).length;
      
      return {
        category,
        total: categoryQuestions.length,
        completed: completedInCategory,
        percentage: Math.round((completedInCategory / categoryQuestions.length) * 100) || 0
      };
    });
  }, [questionProgress]);

  // Calculate recent activity
  const recentActivity = React.useMemo(() => {
    const recent = [...questionProgress]
      .filter(p => p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 5);
    
    return recent.map(p => {
      const question = dsaQuestions.find(q => q.id === p.questionId);
      return {
        ...p,
        title: question?.title || 'Unknown Question',
        daysAgo: Math.floor((Date.now() - new Date(p.completedAt!).getTime()) / (1000 * 60 * 60 * 24))
      };
    });
  }, [questionProgress]);

  // Calculate streak
  const currentStreak = React.useMemo(() => {
    const sortedProgress = [...questionProgress]
      .filter(p => p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    
    if (sortedProgress.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const progress of sortedProgress) {
      const progressDate = new Date(progress.completedAt!);
      progressDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays === streak + 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, [questionProgress]);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompleted}</div>
            <p className="text-xs text-muted-foreground">
              out of {dsaQuestions.length} problems
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              {currentStreak === 1 ? 'day' : 'days'} in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Studied</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topicsStudied}</div>
            <p className="text-xs text-muted-foreground">
              out of {dsaCheatSheetData.length} topics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attempts</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questionProgress.length > 0 
                ? (questionProgress.reduce((sum, p) => sum + p.attempts, 0) / questionProgress.length).toFixed(1)
                : '0.0'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              per problem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Progress by Difficulty</CardTitle>
          <CardDescription>Your performance across different difficulty levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800">Easy</Badge>
                <span className="text-sm">{stats.easyCompleted} solved</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round((stats.easyCompleted / dsaQuestions.filter(q => q.difficulty === 'Easy').length) * 100)}%
              </span>
            </div>
            <Progress 
              value={(stats.easyCompleted / dsaQuestions.filter(q => q.difficulty === 'Easy').length) * 100} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>
                <span className="text-sm">{stats.mediumCompleted} solved</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round((stats.mediumCompleted / dsaQuestions.filter(q => q.difficulty === 'Medium').length) * 100)}%
              </span>
            </div>
            <Progress 
              value={(stats.mediumCompleted / dsaQuestions.filter(q => q.difficulty === 'Medium').length) * 100} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-100 text-red-800">Hard</Badge>
                <span className="text-sm">{stats.hardCompleted} solved</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round((stats.hardCompleted / dsaQuestions.filter(q => q.difficulty === 'Hard').length) * 100)}%
              </span>
            </div>
            <Progress 
              value={(stats.hardCompleted / dsaQuestions.filter(q => q.difficulty === 'Hard').length) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress by Category</CardTitle>
          <CardDescription>Your performance across different DSA topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {cat.completed}/{cat.total} ({cat.percentage}%)
                  </span>
                </div>
                <Progress value={cat.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest solved problems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-medium text-sm">{activity.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.daysAgo === 0 ? 'Today' : `${activity.daysAgo} days ago`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={
                        activity.difficulty === "Easy" 
                          ? "bg-green-100 text-green-800" 
                          : activity.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {activity.difficulty}
                    </Badge>
                    {activity.attempts > 1 && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.attempts} attempts
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};