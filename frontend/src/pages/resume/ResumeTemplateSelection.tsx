
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Heading } from "@/components/ui/heading";
import { resumeTemplates } from "@/data/resumeTemplates";
import { TemplateCard } from "@/components/resume/TemplateCard";

export default function ResumeTemplateSelection() {
  const { currentUser } = useAuth();
  
  // Redirect if no user or wrong user type
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser.role !== "user") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Heading 
          title="Resume Builder" 
          description="Choose a template to start building your professional resume"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumeTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
