import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
    ArrowLeft,
    Upload,
    FileText,
    Sparkles,
    Download,
    Share2,
    Trophy,
    TrendingUp,
    DollarSign as _DollarSign,
    Target,
    Brain,
    CheckCircle,
    XCircle,
    Loader2,
    X,
    BookOpen,
    Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateCareerInsight } from "@/services/ai/careerService";

// ─── Types ───────────────────────────────────────────────────────────

interface SkillGap {
    skill: string;
    have: boolean;
    importance: number;
}

interface RoadmapStep {
    step: number;
    skill: string;
    title: string;
    description: string;
    duration: string;
}

interface PredictionResult {
    career_path: string;

    confidence_score: number;
    detected_skills: string[];
    missing_skills: string[];
    skill_gap_analysis: SkillGap[];
    roadmap: RoadmapStep[];
    total_skills_detected: number;
    total_skills_missing: number;
}

// ─── Animated Counter ────────────────────────────────────────────────

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 1500;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = value / steps;
        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                setDisplay(value);
                clearInterval(timer);
            } else {
                setDisplay(Math.floor(start));
            }
        }, stepTime);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

// ─── Circular Progress ──────────────────────────────────────────────

function CircularProgress({ value, size = 160 }: { value: number; size?: number }) {
    const r = (size - 16) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - value / 100);
    const color = value >= 75 ? "#10b981" : value >= 50 ? "#f59e0b" : "#ef4444";

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth="10" fill="none" className="text-white/10" />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={r}
                    stroke={color} strokeWidth="10" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{value}%</span>
                <span className="text-xs text-white/60 mt-1">Confidence</span>
            </div>
        </div>
    );
}

// ─── Career Clarity Badge ───────────────────────────────────────────

function ClarityBadge({ confidence }: { confidence: number }) {
    const level = confidence >= 80 ? "Expert Navigator" : confidence >= 60 ? "Career Explorer" : "Beginner Mapper";
    const emoji = confidence >= 80 ? "🏆" : confidence >= 60 ? "🧭" : "🗺️";
    const gradient = confidence >= 80
        ? "from-amber-400 to-yellow-500"
        : confidence >= 60
            ? "from-blue-400 to-cyan-500"
            : "from-gray-400 to-gray-500";

    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-white font-semibold text-sm shadow-lg`}
        >
            <span className="text-lg">{emoji}</span>
            Career Clarity: {level}
        </motion.div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────

export default function AICareerNavigator() {
    const { currentUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [aiInsight, setAiInsight] = useState<string>("");

    if (!currentUser) return <Navigate to="/login" replace />;

    const handleFile = (file: File) => {
        const ext = file.name.toLowerCase();
        if (!ext.endsWith(".pdf") && !ext.endsWith(".docx")) {
            toast.error("Please upload a PDF or DOCX file");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be under 10 MB");
            return;
        }
        setSelectedFile(file);
        setResult(null);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    }, []);

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setIsAnalyzing(true);
        setAnalysisProgress(0);
        setAiInsight("");

        const progressInterval = setInterval(() => {
            setAnalysisProgress(prev => Math.min(prev + Math.random() * 15, 90));
        }, 400);

        try {
            const formData = new FormData();
            formData.append("resume", selectedFile);

            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            const response = await fetch(`${backendUrl}/predict-career`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Prediction failed");
            }

            setAnalysisProgress(100);
            await new Promise(r => setTimeout(r, 300));
            setResult(data);
            toast.success("Career analysis complete!");

            // Generate AI career insight via Ollama
            generateCareerInsight(
                data.career_path,
                data.detected_skills,
                data.missing_skills
            ).then(insight => setAiInsight(insight)).catch(console.error);

        } catch (error: any) {
            toast.error(error.message || "Failed to analyze resume. Is the backend running?");
        } finally {
            clearInterval(progressInterval);
            setIsAnalyzing(false);
            setAnalysisProgress(0);
        }
    };

    const handleDownloadReport = () => {
        if (!result) return;
        const report = `
═══════════════════════════════════════════════
    AI CAREER NAVIGATOR — CAREER REPORT
═══════════════════════════════════════════════

📌 PREDICTED CAREER PATH
   ${result.career_path}


📊 CONFIDENCE SCORE
   ${result.confidence_score}%

✅ DETECTED SKILLS (${result.total_skills_detected})
${result.detected_skills.map(s => `   • ${s}`).join("\n")}

❌ MISSING SKILLS (${result.total_skills_missing})
${result.missing_skills.map(s => `   • ${s}`).join("\n")}

🗺️ LEARNING ROADMAP
${result.roadmap.map(r => `   Step ${r.step}: ${r.title} (${r.duration})\n   ${r.description}`).join("\n\n")}

═══════════════════════════════════════════════
   Generated by Interview Express
   AI Career Navigator
═══════════════════════════════════════════════
`;
        const blob = new Blob([report], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Career_Report.txt";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Report downloaded!");
    };

    const handleShare = async () => {
        if (!result) return;
        const text = `🔮 AI Career Navigator Result\n\nPredicted Career: ${result.career_path}\nConfidence: ${result.confidence_score}%\n\nPowered by Interview Express`;
        if (navigator.share) {
            await navigator.share({ title: "My Career Prediction", text });
        } else {
            await navigator.clipboard.writeText(text);
            toast.success("Result copied to clipboard!");
        }
    };

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link to="/resume-builder">
                            <Button variant="ghost" size="icon" className="rounded-xl">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                🔮 AI Career Navigator
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                ML-powered career prediction from your resume
                            </p>
                        </div>
                    </div>
                    {result && <ClarityBadge confidence={result.confidence_score} />}
                </div>

                {/* Upload Section */}
                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Upload Card */}
                            <Card className="relative overflow-hidden border-0 shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
                                <div className="relative p-8">
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={onDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                                        className={`
                      flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed
                      cursor-pointer transition-all duration-300
                      ${isDragging
                                                ? "border-purple-500 bg-purple-500/10 scale-[1.02]"
                                                : selectedFile
                                                    ? "border-emerald-500/50 bg-emerald-500/5"
                                                    : "border-white/20 hover:border-purple-400/50 hover:bg-white/5"
                                            }
                    `}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.docx"
                                            className="hidden"
                                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                        />

                                        {selectedFile ? (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="flex flex-col items-center gap-3"
                                            >
                                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                                    <FileText className="w-8 h-8 text-emerald-500" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-semibold">{selectedFile.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {(selectedFile.size / 1024).toFixed(1)} KB • Ready to analyze
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost" size="sm"
                                                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                                    className="text-xs text-muted-foreground"
                                                >
                                                    <X className="w-3 h-3 mr-1" /> Remove
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4">
                                                <motion.div
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
                                                >
                                                    <Upload className="w-10 h-10 text-purple-400" />
                                                </motion.div>
                                                <div className="text-center">
                                                    <p className="font-semibold text-lg">Drop your resume here</p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        or click to browse • PDF, DOCX up to 10 MB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Analyze Button */}
                                    {selectedFile && !isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6"
                                        >
                                            <Button
                                                onClick={handleAnalyze}
                                                className="w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-[1.01]"
                                            >
                                                <Brain className="w-5 h-5 mr-2" />
                                                Analyze Resume with AI
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* Loading State */}
                                    {isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-6 space-y-4"
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                                <span className="font-semibold text-purple-400">
                                                    Analyzing your skills using Machine Learning…
                                                </span>
                                            </div>
                                            <Progress value={analysisProgress} className="h-2" />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Extracting skills</span>
                                                <span>Running ML models</span>
                                                <span>Generating report</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </Card>

                            {/* Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { icon: Brain, title: "ML Analysis", desc: "RandomForest + NLP skill extraction", gradient: "from-blue-500/10 to-blue-600/10" },
                                    { icon: Target, title: "Career Match", desc: "12+ career paths analyzed", gradient: "from-purple-500/10 to-purple-600/10" },
                                    { icon: TrendingUp, title: "Growth Plan", desc: "Personalized learning roadmap", gradient: "from-emerald-500/10 to-emerald-600/10" },
                                ].map((card) => (
                                    <Card key={card.title} className={`p-5 border-0 bg-gradient-to-br ${card.gradient} backdrop-blur-sm`}>
                                        <card.icon className="w-8 h-8 text-purple-400 mb-3" />
                                        <h3 className="font-bold">{card.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        /* ─── Results Dashboard ─── */
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 justify-end">
                                <Button variant="outline" onClick={() => { setResult(null); setSelectedFile(null); }} className="rounded-xl">
                                    <Upload className="w-4 h-4 mr-2" /> New Analysis
                                </Button>
                                <Button variant="outline" onClick={handleShare} className="rounded-xl">
                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                </Button>
                                <Button onClick={handleDownloadReport} className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                    <Download className="w-4 h-4 mr-2" /> Download Report
                                </Button>
                            </div>

                            {/* Top Row: Career + Confidence */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Career Path */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Card className="relative overflow-hidden border-0 h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
                                        <div className="relative p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
                                            <Sparkles className="w-8 h-8 text-yellow-300 mb-3" />
                                            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Predicted Career Path</p>
                                            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
                                                {result.career_path}
                                            </h2>
                                            <Badge className="mt-4 bg-white/20 text-white border-0">
                                                {result.total_skills_detected} skills detected
                                            </Badge>
                                        </div>
                                    </Card>
                                </motion.div>



                                {/* Confidence */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Card className="relative overflow-hidden border-0 h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent)]" />
                                        <div className="relative p-6 flex flex-col items-center justify-center min-h-[220px]">
                                            <CircularProgress value={result.confidence_score} />
                                            <Trophy className="w-5 h-5 text-yellow-400 mt-3" />
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Skills Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Detected Skills */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-emerald-500/5 to-emerald-600/5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            <h3 className="font-bold text-lg">Detected Skills</h3>
                                            <Badge variant="secondary" className="ml-auto">{result.total_skills_detected}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {result.detected_skills.map(skill => (
                                                <Badge key={skill} className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 capitalize">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Missing Skills */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-red-500/5 to-red-600/5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <XCircle className="w-5 h-5 text-red-500" />
                                            <h3 className="font-bold text-lg">Skill Gaps</h3>
                                            <Badge variant="secondary" className="ml-auto">{result.total_skills_missing}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missing_skills.map(skill => (
                                                <Badge key={skill} variant="outline" className="text-red-500 dark:text-red-400 border-red-500/30 capitalize">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {result.missing_skills.length === 0 && (
                                                <p className="text-sm text-muted-foreground">No skill gaps found! 🎉</p>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Skill Gap Analysis Progress Bars */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Card className="p-6 border-0 shadow-lg">
                                    <div className="flex items-center gap-2 mb-5">
                                        <Target className="w-5 h-5 text-purple-500" />
                                        <h3 className="font-bold text-lg">Skill Gap Analysis</h3>
                                    </div>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        {result.skill_gap_analysis.map((item, i) => (
                                            <motion.div
                                                key={item.skill}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + i * 0.05 }}
                                                className="space-y-1"
                                            >
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="capitalize font-medium flex items-center gap-2">
                                                        {item.have
                                                            ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                                            : <XCircle className="w-3.5 h-3.5 text-red-400" />
                                                        }
                                                        {item.skill}
                                                    </span>
                                                    <span className={`font-semibold ${item.have ? "text-emerald-500" : "text-red-400"}`}>
                                                        {item.have ? "100%" : "0%"}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: item.have ? "100%" : "0%" }}
                                                        transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                                                        className={`h-full rounded-full ${item.have ? "bg-emerald-500" : "bg-red-400"}`}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>

                            {/* AI Career Insight */}
                            {aiInsight && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.55 }}
                                >
                                    <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Sparkles className="w-5 h-5 text-purple-500" />
                                            <h3 className="font-bold text-lg">AI Career Insight</h3>
                                            <Badge className="ml-auto bg-purple-500/15 text-purple-600 dark:text-purple-400 border-0">Ollama AI</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {aiInsight}
                                        </p>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Learning Roadmap */}
                            {result.roadmap.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Card className="p-6 border-0 shadow-lg">
                                        <div className="flex items-center gap-2 mb-6">
                                            <BookOpen className="w-5 h-5 text-blue-500" />
                                            <h3 className="font-bold text-lg">Personalized Learning Roadmap</h3>
                                        </div>
                                        <div className="relative">
                                            {/* Timeline line */}
                                            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />

                                            <div className="space-y-6">
                                                {result.roadmap.map((step, i) => (
                                                    <motion.div
                                                        key={step.step}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.7 + i * 0.1 }}
                                                        className="flex gap-4 relative"
                                                    >
                                                        {/* Step circle */}
                                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20 z-10">
                                                            {step.step}
                                                        </div>

                                                        {/* Content card */}
                                                        <Card className="flex-1 p-4 border-0 bg-gradient-to-br from-white/5 to-white/10 dark:from-white/5 dark:to-white/10 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <h4 className="font-bold">{step.title}</h4>
                                                                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                                                                    <Badge variant="outline" className="mt-2 text-xs capitalize">
                                                                        {step.skill}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                                                                    <Clock className="w-3 h-3" />
                                                                    {step.duration}
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </DashboardLayout>
    );
}
