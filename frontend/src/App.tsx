
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DSAProgressProvider } from "./contexts/DSAProgressContext";
import { UserProgressProvider } from "./contexts/UserProgressContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Pages
import PremiumLandingPage from "./pages/PremiumLandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import Dashboard from "./pages/dashboard/Dashboard";
import EnhancedResumeBuilder from "./pages/resume/EnhancedResumeBuilder";
import AICareerNavigator from "./pages/resume/AICareerNavigator";

import EnhancedResumeTemplateSelection from "./pages/resume/EnhancedResumeTemplateSelection";
import AptitudeTestPage from "./pages/practice/AptitudeTestPage";

import EnhancedDSAPracticePage from "./pages/practice/EnhancedDSAPracticePage";
import LeetCodeEditorPage from "./pages/practice/LeetCodeEditorPage";
import ProfilePage from "./pages/user/ProfilePage";
import NotFound from "./pages/NotFound";

// Feature and About pages
import FeaturesPage from "./pages/FeaturesPage";
import AboutPage from "./pages/AboutPage";

// Create the mock interview page and study resources page
import MockInterviewPage from "./pages/practice/MockInterviewPage";
import StudyResourcesPage from "./pages/resources/StudyResourcesPage";
import AIAssistantPage from "./pages/assistant/AIAssistantPage";



const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserProgressProvider>
            <DSAProgressProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<PremiumLandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/about" element={<AboutPage />} />

                    {/* User routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/resume-builder" element={<EnhancedResumeTemplateSelection />} />
                    <Route path="/resume-builder/:templateId" element={<EnhancedResumeBuilder />} />
                    <Route path="/career-navigator" element={<AICareerNavigator />} />

                    <Route path="/practice/aptitude" element={<AptitudeTestPage />} />
                    <Route path="/practice/dsa" element={<EnhancedDSAPracticePage />} />
                    <Route path="/practice/dsa/:questionId" element={<LeetCodeEditorPage />} />

                    <Route path="/practice/interview" element={<MockInterviewPage />} />
                    <Route path="/resources" element={<StudyResourcesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/assistant" element={<AIAssistantPage />} />

                    {/* Catch all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </DSAProgressProvider>
          </UserProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
