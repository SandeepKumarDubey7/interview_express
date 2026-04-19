import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/contexts/UserProgressContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Question } from "@/data/aptitudeQuestions";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, CheckCircle, RefreshCw, Download, BookOpen, Calculator, Brain, MessageSquare, Trophy, Sparkles } from "lucide-react";
import { quantitativeGeneratedQuestions, logicalGeneratedQuestions, verbalGeneratedQuestions } from "@/data/generatedAptitudeQuestions";
import { aptitudeNotes } from "@/data/aptitudeNotes";
import { aptitudeFormulas } from "@/data/aptitudeFormulas";
import { AptitudePDFGenerator } from "@/services/aptitudePDFGenerator";
import { motion, AnimatePresence } from "framer-motion";

const sliceCount = 50;

const getRandomQuestions = (questions: Question[], count: number) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function AptitudeTestPage() {
  const { currentUser } = useAuth();
  const { addAptitudeResult, addActivity, addPracticeTime } = useUserProgress();
  const [mainTab, setMainTab] = useState<string>("syllabus");
  const [activeTab, setActiveTab] = useState<"quantitative" | "logical" | "verbal">("quantitative");

  // Randomize questions for this session
  const randomQuant = useMemo(() => getRandomQuestions(quantitativeGeneratedQuestions, sliceCount), []);
  const randomLogical = useMemo(() => getRandomQuestions(logicalGeneratedQuestions, sliceCount), []);
  const randomVerbal = useMemo(() => getRandomQuestions(verbalGeneratedQuestions, sliceCount), []);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const SubjectPractice = ({ title, questions }: { title: string; questions: Question[] }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState<{ [key: string]: boolean }>({});
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const total = questions.length;

    const selectAnswer = (qid: string, ans: string) => {
      setSelectedAnswers(prev => ({ ...prev, [qid]: ans }));
    };

    const submitAnswer = () => {
      const q = questions[currentQuestion];
      if (!selectedAnswers[q.id]) {
        toast.error("Please select an option before submitting.");
        return;
      }
      if (submitted[q.id]) return;
      const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
      setSubmitted(prev => ({ ...prev, [q.id]: true }));
      if (isCorrect) setScore(prev => prev + 1);
    };

    const next = () => {
      if (currentQuestion < total - 1) setCurrentQuestion(prev => prev + 1);
    };
    const prev = () => {
      if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1);
    };
    const finish = () => {
      setFinished(true);
      toast.success("Practice completed! See your score below.");
      // Track progress on dashboard
      addAptitudeResult(score, total);
      addPracticeTime(15);
      addActivity(`Aptitude Test: scored ${score}/${total} in ${title}`, 'aptitude');
    };
    const reset = () => {
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setSubmitted({});
      setFinished(false);
      setScore(0);
    };

    const q = questions[currentQuestion];
    const isSubmitted = submitted[q.id] || false;
    const isCorrect = selectedAnswers[q.id] === q.correctAnswer;

    return (
      <div className="space-y-6">
        {!finished && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {total}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Score: {score}/{Object.keys(submitted).length}
                </span>
              </div>
            </div>

            {/* Gradient progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / total) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          <Sparkles className="w-3 h-3" />
                          Question {currentQuestion + 1}
                        </div>
                        <p className="text-lg font-medium leading-relaxed">{q.question}</p>
                      </div>
                      <div className="space-y-2.5">
                        {q.options.map((opt, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.005 }}
                            whileTap={{ scale: 0.995 }}
                            className={`p-3.5 border rounded-xl cursor-pointer transition-all duration-200 ${isSubmitted && opt === q.correctAnswer
                                ? "bg-emerald-500/10 border-emerald-500/30"
                                : isSubmitted && selectedAnswers[q.id] === opt && !isCorrect
                                  ? "bg-red-500/10 border-red-500/30"
                                  : selectedAnswers[q.id] === opt
                                    ? "bg-primary/10 border-primary/30 shadow-sm"
                                    : "border-border/50 hover:border-primary/20 hover:bg-muted/30"
                              }`}
                            onClick={() => !isSubmitted && selectAnswer(q.id, opt)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSubmitted && opt === q.correctAnswer
                                  ? "bg-emerald-500 text-white"
                                  : isSubmitted && selectedAnswers[q.id] === opt && !isCorrect
                                    ? "bg-red-500 text-white"
                                    : selectedAnswers[q.id] === opt
                                      ? "bg-primary text-white"
                                      : "bg-muted text-muted-foreground"
                                }`}>
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <span className="text-sm">{opt}</span>
                              {isSubmitted && opt === q.correctAnswer && (
                                <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto" />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Result feedback */}
                      <AnimatePresence>
                        {isSubmitted && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`p-4 rounded-xl ${isCorrect ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}
                          >
                            <div className="font-semibold text-sm mb-1">
                              {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Correct Answer: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{q.correctAnswer}</span>
                            </div>
                            {q.explanation && <div className="text-sm text-muted-foreground mt-1">{q.explanation}</div>}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-6 gap-2">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={prev} disabled={currentQuestion === 0} className="rounded-xl">
                        <ChevronLeft className="mr-1 h-4 w-4" /> Prev
                      </Button>
                      <Button onClick={submitAnswer} disabled={isSubmitted} className="rounded-xl bg-gradient-to-r from-primary to-accent text-white hover:opacity-90">
                        Submit
                      </Button>
                      <Button variant="outline" onClick={next} disabled={currentQuestion === total - 1} className="rounded-xl">
                        Next <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant={currentQuestion === total - 1 ? "default" : "outline"} onClick={finish} className="rounded-xl">
                      {currentQuestion === total - 1 ? "Finish" : "Finish Early"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Removed Question navigator as requested */}
          </>
        )}

        {/* Results */}
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Practice Summary
                </CardTitle>
                <CardDescription>Your score and review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 text-center">
                    <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{score}/{total}</div>
                    <div className="text-sm text-muted-foreground mt-1">Correct Answers</div>
                  </div>
                  <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
                    <div className="text-3xl font-extrabold gradient-text">{Math.round((score / total) * 100)}%</div>
                    <div className="text-sm text-muted-foreground mt-1">Score</div>
                  </div>
                  <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 text-center">
                    <div className="text-3xl font-extrabold text-red-500">{total - score}</div>
                    <div className="text-sm text-muted-foreground mt-1">Incorrect</div>
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="space-y-3">
                  <h3 className="font-bold">Question Review</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {questions.map((question, idx) => {
                      const answered = selectedAnswers[question.id];
                      const correct = answered === question.correctAnswer;
                      return (
                        <div key={idx} className={`p-3.5 rounded-xl border ${correct ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                          <div className="font-medium text-sm">{idx + 1}. {question.question}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mt-2">
                            <div>Your Answer: <span className={correct ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-red-500 font-semibold"}>{answered || "No answer"}</span></div>
                            <div>Correct: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{question.correctAnswer}</span></div>
                          </div>
                          {question.explanation && <div className="text-xs text-muted-foreground mt-1.5">{question.explanation}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={reset} className="rounded-xl">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake Practice
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    );
  };

  const renderSyllabus = () => (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Complete Placement Aptitude Syllabus
        </CardTitle>
        <CardDescription>Standard topics common in placement drives</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Quantitative Aptitude", icon: Calculator, color: "from-blue-500 to-cyan-400",
            items: ["Number System", "Percentage", "Profit and Loss", "Ratio and Proportion", "Time and Work", "Time, Speed and Distance", "Simple & Compound Interest", "Averages", "Mixtures & Allegations", "Permutation & Combination", "Probability", "Data Interpretation", "Simplification"]
          },
          {
            title: "Logical Reasoning", icon: Brain, color: "from-violet-500 to-purple-400",
            items: ["Coding-Decoding", "Blood Relations", "Direction Sense", "Syllogism", "Seating Arrangement", "Puzzles", "Series (Number & Alphabet)", "Statement & Conclusion", "Clocks & Calendars"]
          },
          {
            title: "Verbal Ability", icon: MessageSquare, color: "from-emerald-500 to-green-400",
            items: ["Reading Comprehension", "Error Detection", "Sentence Improvement", "Para Jumbles", "Synonyms & Antonyms", "Fill in the Blanks", "Active & Passive Voice"]
          }
        ].map((section, i) => (
          <div key={i} className="p-5 rounded-xl bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                <section.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-sm">{section.title}</h3>
            </div>
            <ul className="space-y-1.5">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderNotes = () => (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Aptitude Notes
            </CardTitle>
            <CardDescription>Structured notes with short tricks and examples</CardDescription>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={() => AptitudePDFGenerator.downloadNotes()} className="rounded-xl bg-gradient-to-r from-primary to-accent text-white hover:opacity-90">
              <Download className="mr-2 h-4 w-4" />
              Download Notes
            </Button>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quant-notes" className="w-full">
          <TabsList className="rounded-xl bg-muted/50 p-1 mb-4">
            <TabsTrigger value="quant-notes" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium">Quantitative</TabsTrigger>
            <TabsTrigger value="logical-notes" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium">Logical</TabsTrigger>
            <TabsTrigger value="verbal-notes" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium">Verbal</TabsTrigger>
          </TabsList>

          {[
            { value: "quant-notes", notes: aptitudeNotes.quantitative },
            { value: "logical-notes", notes: aptitudeNotes.logical },
            { value: "verbal-notes", notes: aptitudeNotes.verbal },
          ].map(({ value, notes }) => (
            <TabsContent key={value} value={value} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-200"
                  >
                    <div className="font-bold text-primary text-sm mb-2">{n.title}</div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {n.points.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    {n.example && (
                      <div className="mt-3 p-2.5 bg-muted/50 rounded-lg text-xs">
                        <span className="font-semibold text-primary">Example: </span>{n.example}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );

  const renderFormulaSheet = () => (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Complete Formula Sheet
            </CardTitle>
            <CardDescription>Organized quantitative formulas for quick reference</CardDescription>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={() => AptitudePDFGenerator.downloadFormulaSheet()} className="rounded-xl bg-gradient-to-r from-primary to-accent text-white hover:opacity-90">
              <Download className="mr-2 h-4 w-4" />
              Download Formula Sheet
            </Button>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aptitudeFormulas.quantitative.map((blk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-200"
            >
              <div className="font-bold text-sm text-primary mb-3 pb-2 border-b border-border/50 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-accent" />
                {blk.heading}
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {blk.formulas.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary/40 mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Placement Aptitude Preparation</h1>
          <p className="text-muted-foreground mt-1">Syllabus, 100+ practice questions per subject, notes, formula sheet, and downloads</p>
        </div>

        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted/50 p-1 h-11">
            <TabsTrigger value="syllabus" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium text-sm">
              📚 Syllabus
            </TabsTrigger>
            <TabsTrigger value="practice" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium text-sm">
              ✍️ Practice
            </TabsTrigger>
            <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium text-sm">
              📝 Notes
            </TabsTrigger>
            <TabsTrigger value="formulas" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium text-sm">
              🧮 Formulas
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="syllabus">
              {renderSyllabus()}
            </TabsContent>

            <TabsContent value="practice">
              <div className="space-y-6">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "quantitative" | "logical" | "verbal")} className="w-full">
                  <TabsList className="rounded-xl bg-muted/50 p-1">
                    <TabsTrigger value="quantitative" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium">
                      Quantitative
                    </TabsTrigger>
                    <TabsTrigger value="logical" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium">
                      Logical
                    </TabsTrigger>
                    <TabsTrigger value="verbal" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium">
                      Verbal
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="quantitative" className="mt-4">
                    <SubjectPractice title="Quantitative Practice" questions={randomQuant} />
                  </TabsContent>
                  <TabsContent value="logical" className="mt-4">
                    <SubjectPractice title="Logical Practice" questions={randomLogical} />
                  </TabsContent>
                  <TabsContent value="verbal" className="mt-4">
                    <SubjectPractice title="Verbal Practice" questions={randomVerbal} />
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="notes">
              {renderNotes()}
            </TabsContent>

            <TabsContent value="formulas">
              {renderFormulaSheet()}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
