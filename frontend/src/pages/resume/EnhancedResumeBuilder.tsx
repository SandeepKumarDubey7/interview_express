import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ResumeData, ATSAnalysis } from "@/types/resume";
import { atsTemplates } from "@/data/atsTemplates";
import { analyzeResumeATS } from "@/services/atsService";
import {
  ArrowLeft,
  Save,
  Download,
  FileText,
  BarChart3,
  Loader2,
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { ResumeFormPanel } from "@/components/resume/ResumeFormPanel";
import { LivePreviewPanel } from "@/components/resume/LivePreviewPanel";
import { ATSScoreDashboard } from "@/components/resume/ATSScoreDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: ""
  },
  summary: "",
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: []
};

export default function EnhancedResumeBuilder() {
  const { currentUser } = useAuth();
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");

  const selectedTemplate = atsTemplates.find(t => t.id === templateId);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "user") {
    return <Navigate to="/dashboard" replace />;
  }

  if (!selectedTemplate) {
    return <Navigate to="/resume-builder" replace />;
  }

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (resumeData.personalInfo.fullName) {
        localStorage.setItem(`resume_${templateId}`, JSON.stringify(resumeData));
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [resumeData, templateId]);

  useEffect(() => {
    const saved = localStorage.getItem(`resume_${templateId}`);
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
        toast.success("Loaded your saved resume");
      } catch (error) {
        console.error("Error loading saved resume:", error);
      }
    }
  }, [templateId]);

  // Real-time ATS scoring — runs on every resume change (debounced)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const analysis = analyzeResumeATS(resumeData);
      setAtsAnalysis(analysis);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [resumeData]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(`resume_${templateId}`, JSON.stringify(resumeData));

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Resume saved successfully!");
    }, 500);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const { generateResumePDF } = await import("@/utils/resumePDFGenerator");
      const pdfBlob = await generateResumePDF(resumeData, selectedTemplate.id);

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success("Resume exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const completionPercentage = () => {
    let completed = 0;
    let total = 8;

    if (resumeData.personalInfo.fullName && resumeData.personalInfo.email) completed++;
    if (resumeData.summary && resumeData.summary.length > 50) completed++;
    if (resumeData.education.length > 0) completed++;
    if (resumeData.experience.length > 0 || resumeData.projects.length > 0) completed++;
    if (resumeData.skills.length > 0) completed++;
    if (resumeData.projects.length > 0) completed++;
    if (resumeData.certifications.length > 0) completed++;
    if (resumeData.achievements.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const percent = completionPercentage();
  const atsScore = atsAnalysis?.score.overall ?? 0;
  const atsColor = atsScore >= 80 ? "text-emerald-500" : atsScore >= 60 ? "text-amber-500" : "text-red-500";
  const atsBgColor = atsScore >= 80 ? "bg-emerald-500" : atsScore >= 60 ? "bg-amber-500" : "bg-red-500";

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
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
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">{selectedTemplate.name} Resume</h1>
              <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* AI Career Navigator Button */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={() => navigate("/career-navigator")}
                className="rounded-xl relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-purple-400/0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
                <Brain className="mr-2 h-4 w-4 relative z-10" />
                <span className="relative z-10">🔮 AI Career Navigator</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" onClick={handleSave} disabled={isSaving} className="rounded-xl">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={handleExportPDF} disabled={isExporting} className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/20">
                {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Progress Bar + Real-time ATS Mini Widget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Resume Completion */}
          <Card className="p-4 border-border/50 md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Resume Completion</span>
              <span className={`text-sm font-bold ${percent >= 80 ? 'text-emerald-500' : percent >= 50 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                {percent}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
          </Card>

          {/* Real-time ATS Score Mini Widget */}
          <Card className="p-4 border-border/50 flex items-center gap-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
                <motion.circle
                  cx="24" cy="24" r="20"
                  stroke="currentColor" strokeWidth="4" fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - atsScore / 100)}`}
                  className={atsBgColor}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - atsScore / 100) }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-bold ${atsColor}`}>{atsScore}</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">ATS Score</p>
              <p className="text-xs text-muted-foreground truncate">
                {atsScore >= 80
                  ? "Great resume!"
                  : atsScore >= 60
                    ? "Good, can improve"
                    : atsScore > 0
                      ? "Needs more content"
                      : "Start filling in data"
                }
              </p>
            </div>
            {atsScore > 0 && (
              <Badge
                variant="outline"
                className={`ml-auto flex-shrink-0 text-xs ${atsScore >= 80 ? "border-emerald-500 text-emerald-500" : atsScore >= 60 ? "border-amber-500 text-amber-500" : "border-red-500 text-red-500"}`}
              >
                {atsScore >= 80 ? <CheckCircle className="w-3 h-3 mr-1" /> : atsScore >= 60 ? <TrendingUp className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                {atsScore >= 80 ? "Pass" : atsScore >= 60 ? "Fair" : "Low"}
              </Badge>
            )}
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/50 p-1 h-11">
            <TabsTrigger value="builder" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium">
              <FileText className="w-4 h-4 mr-2" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="ats" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium">
              <BarChart3 className="w-4 h-4 mr-2" />
              ATS Score Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResumeFormPanel
                resumeData={resumeData}
                setResumeData={setResumeData}
                templateType={selectedTemplate.id}
              />
              <LivePreviewPanel
                resumeData={resumeData}
                templateType={selectedTemplate.id}
              />
            </div>
          </TabsContent>

          <TabsContent value="ats" className="mt-4">
            <ATSScoreDashboard
              analysis={atsAnalysis}
              resumeData={resumeData}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
