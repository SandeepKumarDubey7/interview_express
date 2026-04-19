
import { MainLayout } from "@/components/layout/MainLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, Mail, HelpCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !isLoading) {
      if ((currentUser.role as string) === "organization") {
        navigate("/organization-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [currentUser, isLoading, navigate]);

  return (
    <MainLayout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Subtle gradient mesh */}
          <div className="absolute inset-0 gradient-mesh" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md mx-auto px-4"
          >
            {/* Back link */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
              <KeyRound className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight mb-2">Reset Your Password</h2>
            <p className="text-muted-foreground mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="glass-card p-6">
              <ForgotPasswordForm />
            </div>

            {/* Help tips */}
            <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <HelpCircle className="w-4 h-4 text-primary" />
                Helpful tips
              </div>
              {[
                "Check your spam folder for the reset email",
                "Use the email address you registered with",
                "Contact support if issues persist",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 mt-0.5 text-primary/50 flex-shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
