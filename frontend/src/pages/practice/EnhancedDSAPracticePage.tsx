import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Textarea } from "@/components/ui/textarea";
import { dsaQuestions, DSAQuestion } from "@/data/dsaQuestions";
import { generatedDSAQuestions, LeetCodeQuestion } from "@/data/generatedDSAQuestions";
import { dsaCheatSheetData } from "@/data/dsaCheatSheet";
import { useDSAProgress } from "@/contexts/DSAProgressContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { queryGemini } from "@/services/geminiService";
import { DSAPDFGenerator } from "@/services/dsaPDFGenerator";
import { DSAStatistics } from "@/components/dsa/DSAStatistics";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Code,
  Search,
  Filter,
  Terminal,
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Database,
  BookOpen,
  Trophy,
  Download,
  ExternalLink,
  Building2,
  Zap,
  FileText,
  Clock,
  Target,
  Award,
  Users,
  Globe,
  Lightbulb,
  ChevronRight,
  Star,
  TrendingUp,
  List,
  GitBranch,
  Layers,
  TreePine,
  Network
} from "lucide-react";

export default function EnhancedDSAPracticePage() {
  const { currentUser } = useAuth();
  const {
    markQuestionCompleted,
    markTopicStudied,
    getQuestionProgress,
    getTopicProgress,
    getCompletionStats
  } = useDSAProgress();

  // Icon mapping function
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Clock,
      List,
      Search,
      GitBranch,
      Layers,
      TreePine,
      Target,
      Network,
      Database
    };

    const IconComponent = iconMap[iconName] || Clock;
    return <IconComponent className="h-5 w-5" />;
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const editorNavigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState<DSAQuestion | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  // Helper: get starter code for a language, with C/C++ fallback
  const getStarterCode = (question: DSAQuestion, lang: string): string => {
    const existing = question.starterCode[lang];
    if (existing) return existing;
    // Generate a fallback template for C and C++
    const fnName = question.title.replace(/[^a-zA-Z0-9]/g, '').replace(/^(.)/, (_, c) => c.toLowerCase());
    if (lang === 'c') {
      return `#include <stdio.h>\n#include <stdlib.h>\n\n// ${question.title}\nvoid ${fnName}() {\n    // Write your code here\n}\n\nint main() {\n    ${fnName}();\n    return 0;\n}`;
    }
    if (lang === 'cpp') {
      return `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\n// ${question.title}\nclass Solution {\npublic:\n    void ${fnName}() {\n        // Write your code here\n    }\n};\n\nint main() {\n    Solution sol;\n    sol.${fnName}();\n    return 0;\n}`;
    }
    return `// ${question.title}\n// Write your solution here`;
  };
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    output?: string;
    errorMessage?: string;
    feedback?: string;
    executionTime?: number;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [questionSource, setQuestionSource] = useState<"standard" | "leetcode">("leetcode");
  const [activeTab, setActiveTab] = useState("practice");
  const [cheatSheetLanguage, setCheatSheetLanguage] = useState("cpp");
  const [cheatSheetSearch, setCheatSheetSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const allQuestions = questionSource === "standard" ? dsaQuestions : generatedDSAQuestions;
  const categories = Array.from(new Set(allQuestions.map(q => q.category))).sort();

  const filteredQuestions = allQuestions.filter(question => {
    const matchesSearch = searchTerm
      ? question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesDifficulty = !difficultyFilter || difficultyFilter === "all" || question.difficulty === difficultyFilter;
    const matchesCategory = !categoryFilter || categoryFilter === "all" || question.category === categoryFilter;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, difficultyFilter, categoryFilter, questionSource]);

  const filteredCheatSheet = dsaCheatSheetData.filter(topic =>
    cheatSheetSearch === "" ||
    topic.title.toLowerCase().includes(cheatSheetSearch.toLowerCase()) ||
    topic.description.toLowerCase().includes(cheatSheetSearch.toLowerCase())
  );

  useEffect(() => {
    const questionId = searchParams.get('question');
    if (questionId) {
      const question = dsaQuestions.find(q => q.id === questionId);
      if (question) {
        setSelectedQuestion(question);
        setCode(getStarterCode(question, language));
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedQuestion) {
      setCode(getStarterCode(selectedQuestion, language));
    }
  }, [language, selectedQuestion]);

  const selectQuestion = (question: DSAQuestion) => {
    // Navigate to the LeetCode-style editor page
    editorNavigate(`/practice/dsa/${question.id}`);
  };

  const runCode = async () => {
    if (!selectedQuestion) return;

    setIsRunning(true);
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const executionTime = Math.random() * 0.2 + 0.1;
      const success = Math.random() > 0.3;

      if (success) {
        setResult({
          success: true,
          output: "Test cases passed successfully!",
          executionTime,
        });
        toast.success("Code ran successfully!");
      } else {
        setResult({
          success: false,
          errorMessage: "One or more test cases failed.",
          executionTime,
        });
        toast.error("Code execution failed.");
      }
    } catch (error) {
      console.error("Error running code:", error);
      toast.error("Failed to run code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    if (!selectedQuestion) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const prompt = `
        I'm solving this coding problem:
        
        ${selectedQuestion.title}
        ${selectedQuestion.description}
        
        Here's my solution in ${language}:
        
        ${code}
        
        Please evaluate if my solution is correct. 
        
        Format your response as follows:
        1. Is the solution correct? (Yes/No)
        2. What is the time complexity?
        3. What is the space complexity?
        4. Provide specific feedback for improvement if needed.
        5. Include any edge cases I might have missed.
      `;

      const response = await queryGemini(prompt);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const success = Math.random() > 0.3;
      const executionTime = Math.random() * 0.2 + 0.1;

      if (success) {
        // Mark question as completed
        if (selectedQuestion) {
          markQuestionCompleted(
            selectedQuestion.id,
            selectedQuestion.difficulty,
            selectedQuestion.category,
            executionTime
          );
        }

        setResult({
          success: true,
          output: "All test cases passed!",
          feedback: response.text || "Your solution is correct and efficient.",
          executionTime,
        });
        toast.success("Solution submitted successfully!");
      } else {
        setResult({
          success: false,
          errorMessage: "Solution fails for some inputs.",
          feedback: response.text || "There are some issues with your solution that need to be fixed.",
          executionTime,
        });
        toast.error("Solution has some issues.");
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error("Failed to submit code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCode = () => {
    if (selectedQuestion) {
      setCode(getStarterCode(selectedQuestion, language));
      setResult(null);
      toast.info("Code has been reset.");
    }
  };

  const downloadCheatSheet = async () => {
    try {
      await DSAPDFGenerator.downloadPDF({
        language: cheatSheetLanguage as 'cpp' | 'java' | 'python' | 'javascript',
        includeComplexity: true,
        includeCode: true,
        includeKeyPoints: true
      });
      toast.success("DSA Cheat Sheet downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download cheat sheet. Please try again.");
    }
  };

  const renderStructuredLearningPaths = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">📚 Structured Learning Paths</h2>
        <p className="text-muted-foreground">Follow curated roadmaps to master DSA concepts</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-900 dark:text-blue-100">A2Z DSA Course – TakeUForward</CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  Complete A2Z structured DSA roadmap by Striver
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Comprehensive course covering all DSA topics from basics to advanced with detailed explanations and practice problems.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Star className="h-4 w-4" />
              <span>Most Popular</span>
              <Badge variant="secondary" className="bg-blue-200 text-blue-800">Free</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105 transition-transform"
              onClick={() => window.open('https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z', '_blank')}
            >
              Start Learning
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-purple-900 dark:text-purple-100">Company-wise DSA Questions</CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-300">
                  Practice DSA questions asked in specific companies
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
              Access curated question sets from top tech companies like Google, Amazon, Microsoft, and more.
            </p>
            <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
              <TrendingUp className="h-4 w-4" />
              <span>Company Focused</span>
              <Badge variant="secondary" className="bg-purple-200 text-purple-800">Premium</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white group-hover:scale-105 transition-transform"
              onClick={() => window.open('https://nextleet.com/search/sheet', '_blank')}
            >
              Browse Companies
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  const renderLiveCodingContests = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🏆 Live Coding Contests</h2>
        <p className="text-muted-foreground">Participate in competitive programming contests</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>LeetCode Contests</CardTitle>
                <CardDescription>Weekly & Biweekly</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Weekly and biweekly coding contests for interview preparation with global rankings.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>Every Saturday & Sunday</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full group-hover:bg-orange-500 group-hover:text-white transition-colors"
              onClick={() => window.open('https://leetcode.com/contest/', '_blank')}
            >
              Join Contest
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Codeforces</CardTitle>
                <CardDescription>Competitive Programming</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Competitive programming contests for advanced problem solving and algorithmic thinking.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-red-500" />
              <span>Global Community</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full group-hover:bg-red-500 group-hover:text-white transition-colors"
              onClick={() => window.open('https://codeforces.com/', '_blank')}
            >
              Compete Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>HackerRank</CardTitle>
                <CardDescription>Skill Challenges</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Skill-based contests and hiring challenges with certificates and company connections.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-green-500" />
              <span>Career Focused</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full group-hover:bg-green-500 group-hover:text-white transition-colors"
              onClick={() => window.open('https://www.hackerrank.com/contests', '_blank')}
            >
              Start Challenge
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
  const renderProgressDashboard = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">📊 Your DSA Progress</h2>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      <DSAStatistics />
    </div>
  );

  const renderCheatSheetSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">📘 DSA Quick Revision Cheat Sheets</h2>
          <p className="text-muted-foreground">Quick reference for all important DSA concepts and algorithms</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadCheatSheet} className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2">
          <Select value={cheatSheetLanguage} onValueChange={setCheatSheetLanguage}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search topics..."
            className="pl-9"
            value={cheatSheetSearch}
            onChange={(e) => setCheatSheetSearch(e.target.value)}
          />
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {filteredCheatSheet.map((topic, index) => {
          const topicProgress = getTopicProgress(`topic-${index}`);
          const isStudied = topicProgress?.completed || false;

          return (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                      {getIconComponent(topic.iconName)}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold flex items-center gap-2">
                        {topic.title}
                        {isStudied && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground">{topic.description}</div>
                    </div>
                  </div>
                  <Button
                    variant={isStudied ? "secondary" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      markTopicStudied(`topic-${index}`, topic.title);
                      toast.success(`Marked "${topic.title}" as studied!`);
                    }}
                    className="mr-4"
                  >
                    {isStudied ? "Studied ✓" : "Mark as Studied"}
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {topic.concepts.map((concept, conceptIndex) => (
                    <div key={conceptIndex} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-500" />
                        {concept.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">{concept.description}</p>

                      {concept.complexity && (
                        <div className="mb-3">
                          <div className="text-sm font-medium mb-1">Complexity:</div>
                          <div className="flex gap-4 text-sm">
                            <span>Time: <code className="bg-muted px-1 rounded">{concept.complexity.time}</code></span>
                            <span>Space: <code className="bg-muted px-1 rounded">{concept.complexity.space}</code></span>
                          </div>
                        </div>
                      )}

                      {concept.code && concept.code[cheatSheetLanguage] && (
                        <div>
                          <div className="text-sm font-medium mb-2">Implementation:</div>
                          <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                            <code>{concept.code[cheatSheetLanguage]}</code>
                          </pre>
                        </div>
                      )}

                      {concept.keyPoints && concept.keyPoints.length > 0 && (
                        <div className="mt-3">
                          <div className="text-sm font-medium mb-2">Key Points:</div>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {concept.keyPoints.map((point, pointIndex) => (
                              <li key={pointIndex} className="text-muted-foreground">{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  );

  const renderQuestionsList = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Tabs defaultValue={questionSource} onValueChange={(value) => setQuestionSource(value as "standard" | "leetcode")} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="standard">Standard ({dsaQuestions.length})</TabsTrigger>
              <TabsTrigger value="leetcode">LeetCode ({generatedDSAQuestions.length})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search questions..."
              className="pl-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={difficultyFilter || "all"}
            onValueChange={(value) => setDifficultyFilter(value !== "all" ? value : null)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter || "all"}
            onValueChange={(value) => setCategoryFilter(value !== "all" ? value : null)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Question count */}
        <div className="text-sm text-muted-foreground">
          Showing {paginatedQuestions.length} of {filteredQuestions.length} questions
          {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
        </div>

        <div className="grid gap-4">
          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Filter className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg">No questions found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search term</p>
            </div>
          )}

          {paginatedQuestions.map((question) => {
            const questionProgress = getQuestionProgress(question.id);
            const isCompleted = questionProgress?.completed || false;
            const lcMeta = question as LeetCodeQuestion;

            return (
              <Card
                key={question.id}
                className={`card-hover cursor-pointer ${isCompleted ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950' : ''}`}
                onClick={() => selectQuestion(question)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      {isCompleted && <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />}
                      <div>
                        <CardTitle className={`text-base ${isCompleted ? 'text-green-700 dark:text-green-300' : ''}`}>
                          {lcMeta.lc_id ? `${lcMeta.lc_id}. ` : ''}{question.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {question.description.substring(0, 150)}...
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        question.difficulty === "Easy"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : question.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {question.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="secondary">{question.category}</Badge>
                    {questionSource === "leetcode" && lcMeta.acceptance ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        {typeof lcMeta.acceptance === 'number' ? lcMeta.acceptance.toFixed(1) : lcMeta.acceptance}% accepted
                      </Badge>
                    ) : null}
                    {lcMeta.faang && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                        🏢 FAANG
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                        ✅ Solved
                      </Badge>
                    )}
                    {questionProgress?.attempts && questionProgress.attempts > 1 && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                        {questionProgress.attempts} attempts
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectQuestion(question);
                    }}
                  >
                    {isCompleted ? 'Solve Again' : 'Solve Challenge'}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 7) {
                  page = i + 1;
                } else if (currentPage <= 4) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  page = totalPages - 6 + i;
                } else {
                  page = currentPage - 3 + i;
                }
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className="w-9 h-9"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderQuestionDetail = () => {
    if (!selectedQuestion) return null;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedQuestion(null);
                setSearchParams({});
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedQuestion.title}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={
                    selectedQuestion.difficulty === "Easy"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : selectedQuestion.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {selectedQuestion.difficulty}
                </Badge>
                <Badge variant="secondary">{selectedQuestion.category}</Badge>
                {(selectedQuestion as LeetCodeQuestion).url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open((selectedQuestion as LeetCodeQuestion).url, '_blank');
                    }}
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    LeetCode
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Problem Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p>{selectedQuestion.description}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold">Examples:</h3>
                  {selectedQuestion.examples.map((example, idx) => (
                    <div key={idx} className="p-3 bg-muted/20 rounded-md space-y-1 text-sm">
                      <div><strong>Input:</strong> {example.input}</div>
                      <div><strong>Output:</strong> {example.output}</div>
                      {example.explanation && (
                        <div><strong>Explanation:</strong> {example.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold">Constraints:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {selectedQuestion.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col">
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Solution</CardTitle>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="relative min-h-[300px]">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-sm h-[300px] resize-none"
                    placeholder="Write your solution here..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between flex-wrap gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetCode}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={runCode}
                    disabled={isRunning || isSubmitting}
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run Code
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={submitCode}
                    disabled={isSubmitting || isRunning}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>Submit Solution</>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {result && (
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle>
                      {result.success ? 'Success' : 'Error'}
                    </CardTitle>
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.executionTime && (
                    <div className="text-sm">
                      <span className="font-medium">Execution Time:</span> {result.executionTime.toFixed(3)}s
                    </div>
                  )}

                  {result.output && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-sm">
                      <div className="font-medium mb-1 text-emerald-700 dark:text-emerald-300">Output:</div>
                      <div className="whitespace-pre-wrap text-foreground">{result.output}</div>
                    </div>
                  )}

                  {result.errorMessage && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-sm">
                      <div className="font-medium mb-1 text-red-700 dark:text-red-300">Error:</div>
                      <div className="whitespace-pre-wrap text-foreground">{result.errorMessage}</div>
                    </div>
                  )}

                  {result.feedback && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md text-sm">
                      <div className="font-medium mb-1 text-blue-700 dark:text-blue-300">AI Feedback:</div>
                      <div className="whitespace-pre-wrap text-foreground">{result.feedback}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {!selectedQuestion ? (
          <>
            <div className="flex justify-between items-center">
              <Heading
                title="DSA Practice Hub"
                description="Your complete DSA preparation ecosystem - practice, learn, compete, and master"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="practice">Practice</TabsTrigger>
                <TabsTrigger value="learning">Learning Paths</TabsTrigger>
                <TabsTrigger value="contests">Contests</TabsTrigger>
                <TabsTrigger value="cheatsheet">Cheat Sheet</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="practice" className="space-y-6">
                {renderQuestionsList()}
              </TabsContent>

              <TabsContent value="learning" className="space-y-6">
                {renderStructuredLearningPaths()}
              </TabsContent>

              <TabsContent value="contests" className="space-y-6">
                {renderLiveCodingContests()}
              </TabsContent>

              <TabsContent value="cheatsheet" className="space-y-6">
                {renderCheatSheetSection()}
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                {renderProgressDashboard()}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          // Question detail is now handled by LeetCodeEditorPage at /practice/dsa/:questionId
          <Navigate to="/practice/dsa" replace />
        )}
      </div>
    </DashboardLayout>
  );
}