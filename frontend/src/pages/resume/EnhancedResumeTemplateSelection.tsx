import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { atsTemplates } from "@/data/atsTemplates";
import { CheckCircle, FileText, Sparkles, ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function EnhancedResumeTemplateSelection() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "user") {
    return <Navigate to="/dashboard" replace />;
  }

  const atsFeatures = [
    "Single column layout for easy parsing",
    "Standard fonts (Arial, Calibri, Times New Roman)",
    "No tables, images, or graphics",
    "Standard section headings recognized by ATS",
    "Built-in ATS score checker and keyword matcher",
  ];

  return (
    <DashboardLayout>
      <motion.div initial="hidden" animate="visible" className="space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp} custom={0}>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">ATS-Friendly Resume Builder</h1>
          <p className="text-muted-foreground mt-1">Choose a template optimized for Applicant Tracking Systems</p>
        </motion.div>

        {/* ATS Info Card */}
        <motion.div variants={fadeUp} custom={1}>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-pink-500/5 border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3">What makes these templates ATS-friendly?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {atsFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {atsTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              variants={fadeUp}
              custom={index + 2}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group"
            >
              <Card className="h-full border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        {template.name}
                      </CardTitle>
                      <CardDescription className="mt-2">{template.description}</CardDescription>
                    </div>
                    {template.atsCompliant && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        ATS
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pb-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Best For</p>
                    <p className="text-sm">{template.bestFor}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sections</p>
                    <div className="flex flex-wrap gap-1.5">
                      {template.sections.map((section, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs rounded-lg border-border/50 font-normal">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link to={`/resume-builder/${template.id}`} className="w-full">
                    <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-md shadow-primary/20 group-hover:shadow-lg transition-all">
                      Use Template
                      <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pro Tips */}
        <motion.div variants={fadeUp} custom={6}>
          <Card className="border-primary/10 bg-gradient-to-r from-primary/[0.03] to-accent/[0.03]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-primary" />
                Pro Tips for B.Tech Students
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong className="text-foreground">Freshers with no internship?</strong> Choose the Functional template to highlight your skills and projects</p>
              <p>• <strong className="text-foreground">Have internship experience?</strong> Use the Chronological template to showcase your work history</p>
              <p>• <strong className="text-foreground">Strong projects + internship?</strong> The Combination template balances both perfectly</p>
              <p>• <strong className="text-foreground">Maximum ATS compatibility?</strong> The Minimal template ensures your resume gets parsed correctly</p>
              <p>• <strong className="text-foreground">All templates include:</strong> ATS score checker, keyword matcher, and AI-powered suggestions</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
