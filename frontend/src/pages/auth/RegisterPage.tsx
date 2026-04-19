
import { MainLayout } from "@/components/layout/MainLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Code, Brain, FileText } from "lucide-react";

export default function RegisterPage() {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !isLoading) {
      navigate("/dashboard");
    }
  }, [currentUser, isLoading, navigate]);

  const benefits = [
    { icon: Code, text: "Access to all practice tests and coding challenges" },
    { icon: FileText, text: "AI-powered resume builder with multiple templates" },
    { icon: Brain, text: "Simulated interview sessions with real-time feedback" },
    { icon: CheckCircle, text: "Personalized study resources and learning paths" },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        <div className="flex-1 flex">
          {/* Left panel — gradient branding */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950" />
            <div className="absolute inset-0">
              <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-primary/15 rounded-full blur-[100px]" />
            </div>
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '48px 48px',
              }}
            />
            <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white">Interview Express</span>
                </div>
                <h2 className="text-3xl xl:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                  Start your
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                    career journey
                  </span>
                </h2>
                <p className="text-slate-300/80 text-lg mb-10 leading-relaxed max-w-md">
                  Create an account to start preparing for your next interview and boost your chances of success.
                </p>

                <div className="space-y-4">
                  {benefits.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-slate-300 text-sm">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-background">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full max-w-md"
            >
              <RegisterForm />
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
