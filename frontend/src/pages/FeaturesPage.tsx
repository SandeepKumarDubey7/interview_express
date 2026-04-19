
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BookOpen,
  Code,
  Mic,
  Award,
  BarChart,
  CheckCircle,
  Zap,
  Brain,
  Bot,
  Sparkles,
  ArrowRight,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import { GlowingButton } from "@/components/animated/GlowingButton";
import { ParticleBackground } from "@/components/animated/ParticleBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function FeaturesPage() {
  const coreFeatures = [
    { icon: FileText, title: "Resume Builder", desc: "Create professional, ATS-optimized resumes with multiple templates and AI-powered feedback.", color: "from-blue-500 to-cyan-400" },
    { icon: BookOpen, title: "Aptitude Testing", desc: "Practice with quantitative, logical, verbal, and data interpretation questions.", color: "from-violet-500 to-purple-400" },
    { icon: Code, title: "DSA Practice", desc: "Solve coding challenges similar to those asked in technical interviews.", color: "from-emerald-500 to-green-400" },
    { icon: Mic, title: "AI Mock Interviews", desc: "Simulate real interview experiences with our AI interviewer.", color: "from-orange-500 to-amber-400" },
    { icon: Award, title: "Learning Resources", desc: "Access curated study materials based on your performance and needs.", color: "from-indigo-500 to-blue-400" },
    { icon: BarChart, title: "Performance Analytics", desc: "Track your progress and identify areas for improvement.", color: "from-pink-500 to-rose-400" },
    { icon: Compass, title: "AI Career Navigator", desc: "Upload your resume and get ML-powered career predictions, salary estimates, skill gap analysis, and a personalized learning roadmap.", color: "from-blue-600 to-purple-500" },
  ];

  const advancedFeatures = [
    { icon: Bot, title: "AI Assistant", desc: "Get instant help with technical concepts, interview strategies, and personalized advice.", color: "from-cyan-500 to-teal-400" },
    { icon: Brain, title: "Custom Study Plans", desc: "Get personalized study plans based on your target role and timeline.", color: "from-purple-500 to-indigo-400" },
    { icon: Mic, title: "Interview Recordings", desc: "Record and review your mock interviews to identify areas for improvement.", color: "from-red-500 to-orange-400" },
    { icon: Zap, title: "Company-Specific Prep", desc: "Access company-specific interview questions and practice tests.", color: "from-amber-500 to-yellow-400" },
    { icon: CheckCircle, title: "Expert Reviews", desc: "Get feedback from industry experts on your resume and interview performance.", color: "from-emerald-500 to-lime-400" },
    { icon: Award, title: "Community Forum", desc: "Connect with other job seekers and share experiences and tips.", color: "from-blue-500 to-violet-400" },
  ];

  const FeatureCard = ({ icon: Icon, title, desc, color, index }: { icon: any, title: string, desc: string, color: string, index: number }) => (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="relative p-6 bg-card rounded-2xl border border-border/50 h-full hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-300`} />
        <div className="relative">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <MainLayout>
      {/* Hero */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Platform Features
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
              Powerful <span className="gradient-text">Features</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed">
              Discover all the powerful features of Interview Express to boost your interview preparation
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-muted/20 border-y border-border/50">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl font-extrabold tracking-tight mb-3">
              Core <span className="gradient-text">Features</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">
              Everything you need to succeed in technical interviews
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreFeatures.map((feature, i) => (
              <FeatureCard key={i} {...feature} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl font-extrabold tracking-tight mb-3">
              Advanced <span className="gradient-text">Features</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">
              Take your interview preparation to the next level
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advancedFeatures.map((feature, i) => (
              <FeatureCard key={i} {...feature} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
        </div>
        <ParticleBackground />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Ready to Get{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Started?
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-xl text-slate-300/80 font-light mb-10">
              Join thousands who have landed their dream jobs with Interview Express
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <GlowingButton size="lg" className="text-lg px-8 py-6 rounded-2xl">
                  Sign Up For Free
                </GlowingButton>
              </Link>
              <Link to="/login">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl border-white/15 text-white hover:bg-white/10">
                    Log In <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
