import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Trophy, 
  FileText, 
  BarChart3, 
  Download,
  ExternalLink,
  CheckCircle,
  Star,
  Zap
} from "lucide-react";

export const DSAFeatureShowcase: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Structured Learning Paths",
      description: "Follow curated DSA roadmaps from industry experts like Striver's A2Z course",
      badge: "Learning",
      color: "blue"
    },
    {
      icon: <Trophy className="h-8 w-8 text-orange-500" />,
      title: "Live Coding Contests",
      description: "Participate in LeetCode, Codeforces, and HackerRank contests directly",
      badge: "Compete",
      color: "orange"
    },
    {
      icon: <FileText className="h-8 w-8 text-green-500" />,
      title: "Multi-Language Cheat Sheets",
      description: "Comprehensive DSA reference with C++, Java, Python, and JavaScript examples",
      badge: "Reference",
      color: "green"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      title: "Advanced Progress Tracking",
      description: "Track your progress with detailed analytics, streaks, and category-wise insights",
      badge: "Analytics",
      color: "purple"
    },
    {
      icon: <Download className="h-8 w-8 text-red-500" />,
      title: "Downloadable Resources",
      description: "Export cheat sheets as PDFs with customizable content and language preferences",
      badge: "Export",
      color: "red"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Smart Practice System",
      description: "Solve problems with AI feedback, progress indicators, and completion tracking",
      badge: "Practice",
      color: "yellow"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">🚀 Enhanced DSA Practice Hub</h2>
        <p className="text-muted-foreground text-lg">
          Your complete DSA preparation ecosystem with advanced features
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Star className="h-3 w-3 mr-1" />
            All Features Complete
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Production Ready
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-muted rounded-lg group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <Badge 
                  variant="outline" 
                  className={`bg-${feature.color}-100 text-${feature.color}-800`}
                >
                  {feature.badge}
                </Badge>
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ready to Master DSA? 🎯</CardTitle>
          <CardDescription className="text-lg">
            Start your comprehensive DSA preparation journey today
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Practicing
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Progress
              <BarChart3 className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-muted-foreground">Practice Problems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">10+</div>
              <div className="text-sm text-muted-foreground">DSA Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-muted-foreground">Contest Platforms</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};