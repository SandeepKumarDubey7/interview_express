
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useUserProgress } from "@/contexts/UserProgressContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff, StopCircle, RefreshCw, Bot, Sparkles, ArrowRight, MessageSquare, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { generateInterviewQuestions, evaluateInterviewAnswer } from "@/services/ai/interviewService";
import { motion, AnimatePresence } from "framer-motion";

// ── Speech Recognition types ──
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

// ── TTS helper ──
function speakText(text: string, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    toast.error("Text-to-Speech is not supported in this browser.");
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const cleanText = text.replace(/[*#_`]/g, '').replace(/\n+/g, '. ');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;
  // Prefer a natural-sounding English voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
    || voices.find(v => v.lang.startsWith('en-US'))
    || voices.find(v => v.lang.startsWith('en'));
  if (preferred) utterance.voice = preferred;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

export default function MockInterviewPage() {
  const { currentUser } = useAuth();
  const { addMockInterview, addActivity, addPracticeTime } = useUserProgress();
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [userResponse, setUserResponse] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [interviewType, setInterviewType] = useState<string>("behavioral");
  const [jobRole, setJobRole] = useState<string>("Software Engineer");
  const [score, setScore] = useState<number | null>(null);
  const [improvementTips, setImprovementTips] = useState<string>("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [idealAnswer, setIdealAnswer] = useState<string>("");

  // ── Speech states ──
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const interimTranscriptRef = useRef("");

  // Check Speech API support on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
    // Pre-load voices for TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // ── Speech-to-Text ──
  const startRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Use Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    const baseText = userResponse;
    interimTranscriptRef.current = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript = transcript;
        }
      }
      if (finalTranscript) {
        interimTranscriptRef.current += finalTranscript;
      }
      setUserResponse(baseText + (baseText ? " " : "") + interimTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'not-allowed') {
        toast.error("Microphone access denied. Please allow microphone access in your browser settings.");
      } else if (event.error !== 'aborted') {
        toast.error(`Speech recognition error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    toast.success("🎤 Recording started — speak your answer!");
  }, [userResponse]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    toast.success("Recording stopped.");
  }, []);

  // ── TTS: read question aloud ──
  const speakQuestion = useCallback((text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    // Clean up the question text for natural speech
    const cleanQ = text.replace(/^Question:\s*/i, '').replace(/\nLooking for:.*$/s, '').trim();
    speakText(cleanQ, () => setIsSpeaking(false));
  }, [isSpeaking]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // ── Generate next interview question ──
  const generateNextQuestion = async () => {
    setLoading(true);
    setCurrentQuestion("");
    setUserResponse("");
    setFeedback("");
    setScore(null);
    setImprovementTips("");
    setIdealAnswer("");
    stopSpeaking();

    try {
      // Try backend question bank first (dataset-driven)
      const params = new URLSearchParams({
        type: interviewType,
        role: jobRole,
        count: "1",
      });
      const backendRes = await fetch(`http://localhost:5000/interview-questions?${params}`);
      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.questions && data.questions.length > 0) {
          const item = data.questions[0];
          let q = item.question;
          // Store ideal answer for evaluation later
          if (item.answer) {
            setIdealAnswer(item.answer);
            q += `\nLooking for: ${item.answer.substring(0, 300)}`;
          }
          setCurrentQuestion(q);
          setQuestionNumber(prev => prev + 1);
          // Auto-speak the question
          setTimeout(() => {
            const cleanQ = q.replace(/^Question:\s*/i, '').replace(/\nLooking for:.*$/s, '').trim();
            setIsSpeaking(true);
            speakText(cleanQ, () => setIsSpeaking(false));
          }, 300);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Backend not available, fall through to AI
      console.log("Backend question bank unavailable, trying Gemini...");
    }

    try {
      // Fallback: Ollama AI via Flask backend
      const experience = "3-5";
      const questions = await generateInterviewQuestions(jobRole, experience);
      if (questions && questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        const item = questions[randomIndex] as any;
        
        let q = typeof item === 'string' ? item : (item.question || item.text || item.prompt);
        if (!q || typeof q !== 'string') {
          throw new Error("Malformed question from AI");
        }

        if (typeof item === 'object' && item.lookingFor) {
          q += `\nLooking for: ${item.lookingFor.substring(0, 300)}`;
        }

        setCurrentQuestion(q);
        setQuestionNumber(prev => prev + 1);
        // Auto-speak the question
        setTimeout(() => {
          const cleanQ = q.replace(/^Question:\s*/i, '').replace(/\nLooking for:.*$/s, '').trim();
          setIsSpeaking(true);
          speakText(cleanQ, () => setIsSpeaking(false));
        }, 300);
      } else {
        throw new Error("Failed to generate questions");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate a question. Please try again.");
      // Hardcoded fallback
      const fallback = interviewType === "behavioral"
        ? [
          "Tell me about a time when you had to overcome a significant challenge in a project.",
          "Describe a situation where you had to work with a difficult team member. How did you handle it?",
          "Give an example of a time when you showed leadership skills.",
          "Talk about a time when you failed at something. What did you learn from it?",
          "How do you handle working under pressure or tight deadlines?"
        ]
        : [
          `For a ${jobRole} role, explain how you would design a scalable system for handling high traffic.`,
          "What's your approach to testing code? Explain different testing methodologies you've used.",
          "How would you optimize the performance of a slow application?",
          "Explain the concept of dependency injection and when you would use it.",
          "What version control strategies have you used in your previous projects?"
        ];
      const q = fallback[Math.floor(Math.random() * fallback.length)];
      setCurrentQuestion(q);
      setQuestionNumber(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // ── Evaluate answer ──
  const generateFeedback = async () => {
    if (!currentQuestion || !userResponse.trim()) {
      toast.error("Please provide an answer to evaluate");
      return;
    }
    setLoading(true);
    stopSpeaking();

    // Extract clean question (without "Looking for:" part)
    const cleanQuestion = currentQuestion.replace(/^Question:\s*/i, '').replace(/\nLooking for:.*$/s, '').trim();

    // Try AI evaluation via Flask backend
    try {
      const evaluation = await evaluateInterviewAnswer(cleanQuestion, userResponse);
      if (evaluation && evaluation.score > 0) {
        setFeedback(evaluation.feedback);
        setScore(evaluation.score);
        setImprovementTips(evaluation.improvementTips);
        setTimeout(() => {
          const summary = `You scored ${evaluation.score} out of 10. ${evaluation.feedback}`;
          setIsSpeaking(true);
          speakText(summary, () => setIsSpeaking(false));
        }, 300);
        // Track progress
        addMockInterview();
        addPracticeTime(5);
        addActivity(`Mock Interview: scored ${evaluation.score}/10`, 'interview');
        setLoading(false);
        return;
      }
    } catch {
      console.log("AI evaluation unavailable, trying backend heuristic...");
    }

    // Fallback: Backend keyword-matching evaluation
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/evaluate-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: cleanQuestion,
          answer: userResponse,
          ideal_answer: idealAnswer,
        }),
      });
      if (res.ok) {
        const evaluation = await res.json();
        setFeedback(evaluation.feedback);
        setScore(evaluation.score);
        setImprovementTips(evaluation.improvementTips);
        setTimeout(() => {
          const summary = `You scored ${evaluation.score} out of 10. ${evaluation.feedback}`;
          setIsSpeaking(true);
          speakText(summary, () => setIsSpeaking(false));
        }, 300);
        // Track progress
        addMockInterview();
        addPracticeTime(5);
        addActivity(`Mock Interview: scored ${evaluation.score}/10`, 'interview');
        setLoading(false);
        return;
      }
    } catch {
      console.log("Backend evaluation also unavailable");
    }

    toast.error("Failed to evaluate your answer. Please try again.");
    setFeedback("We couldn't generate feedback at this time. Please try again later.");
    setScore(null);
    setImprovementTips("");
    setLoading(false);
  };

  const getScoreColor = (s: number) => {
    if (s >= 8) return "text-emerald-500";
    if (s >= 5) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (s: number) => {
    if (s >= 8) return "from-emerald-500/20 to-emerald-500/5";
    if (s >= 5) return "from-amber-500/20 to-amber-500/5";
    return "from-red-500/20 to-red-500/5";
  };

  // Clean question for display (separate question from "Looking for")
  const displayQuestion = currentQuestion.replace(/^Question:\s*/i, '').replace(/\nLooking for:.*$/s, '').trim();
  const lookingFor = currentQuestion.match(/Looking for:\s*(.+)$/s)?.[1]?.trim();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Mock Interview</h1>
          <p className="text-muted-foreground mt-1">
            Practice with AI-powered interviews — speak your answers or type them
          </p>
        </div>

        {/* AI Avatar + Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Avatar Card */}
          <Card className="border-border/50 lg:col-span-1">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <motion.div
                  animate={isSpeaking ? { scale: [1, 1.08, 1] } : isRecording ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  <Bot className="w-12 h-12 text-white" />
                </motion.div>
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-2xl border-2 border-red-500/50 animate-ping" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                  </>
                )}
                {isSpeaking && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse">
                    <Volume2 className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg mb-1">AI Interviewer</h3>
              <p className="text-sm text-muted-foreground">
                {isSpeaking ? "Speaking..." : isRecording ? "Listening to you..." : "Ready to practice"}
              </p>

              <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Online</span>
              </div>

              {questionNumber > 0 && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Question #{questionNumber}
                </div>
              )}

              {/* Speech support indicator */}
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                {speechSupported ? (
                  <><Mic className="w-3 h-3 text-emerald-500" /> Speech recognition ready</>
                ) : (
                  <><MicOff className="w-3 h-3 text-red-500" /> Use Chrome for speech</>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="border-border/50 lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Interview Settings
              </CardTitle>
              <CardDescription>
                Choose interview type and role, then generate a question
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs
                defaultValue="behavioral"
                value={interviewType}
                onValueChange={(value) => setInterviewType(value)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 rounded-xl bg-muted/50 p-1 h-11">
                  <TabsTrigger value="behavioral" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium">
                    💼 Behavioral
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium">
                    💻 Technical
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-2">
                <label htmlFor="job-role" className="text-sm font-medium">Job Role</label>
                <Input
                  id="job-role"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Software Engineer, Data Scientist"
                  className="rounded-xl"
                />
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  onClick={generateNextQuestion}
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/20 h-11"
                >
                  {loading ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> {currentQuestion ? "Next Question" : "Start Interview"}</>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>

        {/* Question Card */}
        <AnimatePresence>
          {currentQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Question #{questionNumber}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speakQuestion(currentQuestion)}
                      className="rounded-xl"
                    >
                      {isSpeaking ? (
                        <><VolumeX className="mr-1 h-4 w-4" /> Stop</>
                      ) : (
                        <><Volume2 className="mr-1 h-4 w-4" /> Listen</>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-lg leading-relaxed font-medium">{displayQuestion}</p>
                  {lookingFor && (
                    <div className="p-2.5 rounded-lg bg-muted/50 border border-border/50">
                      <p className="text-xs text-muted-foreground"><span className="font-semibold">💡 What interviewers look for:</span> {lookingFor}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between gap-3">
                  <div className="flex gap-2">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={isRecording ? "destructive" : "default"}
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={!speechSupported}
                        className={`rounded-xl ${!isRecording ? 'bg-gradient-to-r from-primary to-accent text-white' : ''}`}
                      >
                        {isRecording ? (
                          <><StopCircle className="mr-2 h-4 w-4" /> Stop Recording</>
                        ) : (
                          <><Mic className="mr-2 h-4 w-4" /> Speak Answer</>
                        )}
                      </Button>
                    </motion.div>
                    {!speechSupported && (
                      <span className="text-xs text-muted-foreground self-center">Use Chrome for speech</span>
                    )}
                  </div>

                  <Button variant="outline" onClick={generateNextQuestion} disabled={loading} className="rounded-xl">
                    {loading ? "Loading..." : <>Next Question <ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response + Feedback Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                Your Response
                {isRecording && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-medium animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Recording
                  </span>
                )}
              </CardTitle>
              <CardDescription>Speak or type your answer below</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={isRecording ? "Listening... speak your answer" : "Type your answer here, or click 'Speak Answer' to use your microphone..."}
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                rows={8}
                className="rounded-xl resize-none border-border/50 focus:border-primary/50"
              />
            </CardContent>
            <CardFooter>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
                <Button
                  onClick={generateFeedback}
                  disabled={!userResponse.trim() || loading || !currentQuestion}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/20"
                >
                  {loading ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Get AI Feedback</>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    AI Feedback
                  </CardTitle>
                  <CardDescription>Personalized feedback on your response</CardDescription>
                </div>
                {feedback && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (isSpeaking) { stopSpeaking(); return; }
                      const summary = score !== null ? `You scored ${score} out of 10. ${feedback}` : feedback;
                      setIsSpeaking(true);
                      speakText(summary, () => setIsSpeaking(false));
                    }}
                    className="rounded-xl"
                  >
                    {isSpeaking ? <><VolumeX className="mr-1 h-4 w-4" /> Stop</> : <><Volume2 className="mr-1 h-4 w-4" /> Listen</>}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {feedback ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {score !== null && (
                    <div className={`flex items-center justify-between p-3 rounded-xl bg-gradient-to-r ${getScoreBg(score)} border border-border/30`}>
                      <span className="font-semibold text-sm">Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score * 10}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${score >= 8 ? 'bg-emerald-500' : score >= 5 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                          />
                        </div>
                        <span className={`text-lg font-extrabold ${getScoreColor(score)}`}>
                          {score}/10
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                    <h3 className="font-semibold text-sm mb-2">💬 Feedback</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feedback}</p>
                  </div>

                  {improvementTips && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <h3 className="font-semibold text-sm mb-2">💡 Tips for Improvement</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{improvementTips}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <Bot className="w-12 h-12 text-muted-foreground/20 mb-3" />
                  <p className="text-sm">Speak or type your response to receive feedback</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">The AI will score and analyze your answer</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
