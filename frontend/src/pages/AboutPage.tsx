
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  TrendingUp,
  Heart,
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

export default function AboutPage() {
  const offerings = [
    { title: "Professional Resume Builder", desc: "Multiple templates with AI-powered feedback" },
    { title: "Comprehensive Practice Tests", desc: "Aptitude tests and DSA challenges tailored to your target roles" },
    { title: "AI Mock Interviews", desc: "Realistic interview simulations with instant feedback" },
    { title: "AI Assistant", desc: "Get instant help with concepts and personalized advice" },
  ];

  const whyUs = [
    { title: "Comprehensive Suite", desc: "All your interview preparation tools in one platform" },
    { title: "AI-Powered", desc: "Advanced AI for personalized feedback and guidance" },
    { title: "Industry-Relevant", desc: "Content created by industry experts" },
    { title: "Continuous Updates", desc: "Regular updates to reflect the latest interview trends" },
  ];

  const stats = [
    { value: "90%", label: "Increased confidence", icon: Award },
    { value: "75%", label: "Improved technical skills", icon: TrendingUp },
    { value: "40%", label: "Higher offer rate", icon: Target },
    { value: "10K+", label: "Users worldwide", icon: Users },
  ];

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
                About Us
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
              About <span className="gradient-text">Interview Express</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed">
              Your all-in-one platform for interview preparation and career advancement
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-y border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <motion.h2 variants={fadeUp} className="text-3xl font-extrabold tracking-tight mb-4">
                Our <span className="gradient-text">Mission</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={1} className="text-muted-foreground leading-relaxed mb-4">
                We're on a mission to democratize access to quality interview preparation tools and help job seekers land their dream jobs.
              </motion.p>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground leading-relaxed mb-4">
                Interview Express was founded by a team of tech industry veterans who recognized the challenges that candidates face when preparing for technical interviews.
              </motion.p>
              <motion.p variants={fadeUp} custom={3} className="text-muted-foreground leading-relaxed">
                Our goal is to provide a comprehensive platform that addresses every aspect of interview preparation, from resume creation to technical practice and mock interviews.
              </motion.p>
            </div>
            <motion.div variants={fadeUp} custom={2}>
              <div className="p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 flex items-center justify-center">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/20">
                  <Target className="w-16 h-16 text-white" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl font-extrabold tracking-tight mb-3">
              What We <span className="gradient-text">Offer</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground">
              A comprehensive suite of tools to boost your interview performance
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <div className="max-w-2xl mx-auto space-y-3">
              {offerings.map((item, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} className="flex gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us + Impact */}
      <section className="py-20 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="text-3xl font-extrabold tracking-tight mb-6">
                Why Choose <span className="gradient-text">Us?</span>
              </motion.h2>
              <div className="space-y-3">
                {whyUs.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">{item.title}:</strong> {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="text-3xl font-extrabold tracking-tight mb-6">
                Our <span className="gradient-text">Impact</span>
              </motion.h2>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 text-center">
                    <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-extrabold gradient-text">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
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
              Ready to Start Your{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Journey?
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-xl text-slate-300/80 font-light mb-10">
              Join thousands of job seekers who have successfully landed their dream jobs
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <GlowingButton size="lg" className="text-lg px-8 py-6 rounded-2xl">
                  Sign Up For Free
                </GlowingButton>
              </Link>
              <Link to="/features">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-2xl border-white/15 text-white hover:bg-white/10">
                    Explore Features <ArrowRight className="ml-2 h-4 w-4" />
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
